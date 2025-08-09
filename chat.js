(function(){
  const dock = document.createElement('div');
  dock.className = 'chat-dock';
  dock.id = 'chatDock';
  // If the page already has the markup (from template), just bind
  const dockEl = document.getElementById('chatDock');
  const body = document.getElementById('chatBody');
  const input = document.getElementById('chatInput');
  const send = document.getElementById('chatSend');
  const toggle = document.getElementById('chatToggle');

  const STORAGE_KEY = 'aria_chat_transcript_v1';
  const OPEN_KEY = 'aria_chat_open_v1';

  function loadTranscript(){ try{ return JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'[]'); }catch(e){ return []; } }
  function saveTranscript(items){ sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(-200))); }

  function addMsg(text, who, push=true){
    const div = document.createElement('div');
    div.className = 'msg ' + (who || 'aria');
    div.textContent = text;
    body.appendChild(div);
    if(push){ transcript.push({text, who: who||'aria', ts: Date.now()}); saveTranscript(transcript); }
    body.scrollTop = body.scrollHeight;
  }

  async function askApi(q){
    const res = await fetch('/api/aria/ask', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({query:q}) });
    if(!res.ok) throw new Error('bad_status');
    const data = await res.json();
    return data && (data.answer || JSON.stringify(data));
  }

  async function handleSend(){
    const q = (input.value||'').trim();
    if(!q) return;
    addMsg(q, 'user');
    input.value='';
    try{
      const a = await askApi(q);
      addMsg(a || 'Done.', 'aria');
    }catch(e){
      addMsg('Temporary issue reaching the API. Try again.', 'aria');
    }
  }

  // Init
  let transcript = loadTranscript();
  if(transcript.length){ transcript.forEach(it=>addMsg(it.text, it.who, false)); } else { addMsg('Hi! I’m Aria. Ask about revenue, gross margin, cash, anomalies, or scenarios.', 'aria'); }
  function setOpen(open){ document.getElementById('chatDock').classList.toggle('open', open); localStorage.setItem(OPEN_KEY, open?'1':'0'); }
  setOpen(localStorage.getItem(OPEN_KEY)==='1');
  toggle.addEventListener('click', ()=>{ const isOpen = document.getElementById('chatDock').classList.contains('open'); setOpen(!isOpen); });
  send.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ handleSend(); } });
})();