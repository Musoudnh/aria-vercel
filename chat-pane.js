(function(){
  const body = document.getElementById('chatBody');
  const input = document.getElementById('chatInput');
  const send = document.getElementById('chatSend');
  const STORAGE_KEY = 'aria_chat_transcript_v2';

  function load(){ try{ return JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'[]'); }catch(e){ return []; } }
  function save(items){ sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(-200))); }
  function add(text, who){
    const d = document.createElement('div');
    d.className = 'msg ' + (who||'aria'); d.textContent = text;
    body.appendChild(d); body.scrollTop = body.scrollHeight;
    transcript.push({text, who: who||'aria', ts: Date.now()}); save(transcript);
  }
  async function ask(q){
    const res = await fetch('/api/aria/ask', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({query:q})});
    if(!res.ok) throw new Error('bad');
    const data = await res.json(); return data.answer || 'Done.';
  }
  async function sendIt(){
    const q = (input.value||'').trim(); if(!q) return;
    add(q, 'user'); input.value='';
    try{ const a = await ask(q); add(a, 'aria'); }
    catch(e){ add('Temporary issue reaching Aria. Try again.', 'aria'); }
  }
  let transcript = load();
  if(!transcript.length){ add('Hi! I’m Aria. Ask about revenue, gross margin, anomalies, or scenarios.', 'aria'); }
  else { transcript.forEach(m=>add(m.text, m.who)); }
  send.addEventListener('click', sendIt);
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendIt(); });
})();