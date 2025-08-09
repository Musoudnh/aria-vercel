export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { query } = req.body || {};
    const q = String(query || '').toLowerCase();
    let answer = "I can help with revenue, GM%, cash, anomalies, scenarios, and approvals.";
    if (q.includes("gross") || q.includes("gm")) {
      answer = "Gross margin dipped due to a 2.4% COGS increase on SKUs 1024/1071 and FX headwinds. Try a 1.5% supplier discount and 1% price nudge.";
    } else if (q.includes("revenue")) {
      answer = "Revenue is up ~8.2% MTD driven by volume and price mix; quarter projects +$94k vs plan.";
    } else if (q.includes("scenario") || q.includes("upside") || q.includes("downside")) {
      answer = "Upside: +1% price, -0.8% COGS, +2 Sales FTE. I can generate a draft model.";
    } else if (q.includes("approve") || q.includes("approval")) {
      answer = "You can approve or request changes from the Approvals page.";
    } else if (q.includes("report") || q.includes("deck") || q.includes("ppt")) {
      answer = "I can assemble a Monthly Executive Report or a Board Deck and export.";
    }
    res.status(200).json({ answer });
  } catch (e) {
    res.status(500).json({ error: 'server_error' });
  }
}