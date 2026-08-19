
const BASE = "https://api.internal.temp-mail.io/api/v3";
const HEADERS = {
  "User-Agent": "okhttp/4.12.0",
  "Content-Type": "application/json",
  "Accept-Encoding": "gzip",
};

const SITE = "https://alightmotion.qsr.web.id";

function randomNum(len = 5) {
  let s = "";
  for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 10);
  return s;
}

async function createEmail(name) {
  const res = await fetch(`${BASE}/email/new`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ name }),
  });
  return res.json();
}

async function getMessages(email) {
  const res = await fetch(`${BASE}/email/${email}/messages`, { headers: HEADERS });
  return res.json();
}

function extractLink(html) {
  const m = (html || "").match(/https:\/\/alight-creative\.firebaseapp\.com\/__\/auth\/links\?link=[^'"]+/);
  return m ? m[0].replace(/&amp;/g, "&") : null;
}

async function waitForLink(email, timeoutMs = 60000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    const msgs = await getMessages(email);
    if (msgs.length) {
      const link = extractLink(msgs[0].body_html);
      if (link) return link;
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  return null;
}

async function processOne(index) {
  const name = "vellzyy" + randomNum();
  const data = await createEmail(name);
  const email = data.email;
  const token = data.token;

  // Kirim permintaan email verifikasi
  const r = await fetch(`${SITE}/api/email-prem?email=${encodeURIComponent(email)}`);
  const rd = await r.json();

  // Tunggu link verifikasi masuk
  const link = await waitForLink(email);

  let verify = null;
  if (link) {
    const v = await fetch(`${SITE}/api/vertif-prem?email=${encodeURIComponent(email)}&link=${encodeURIComponent(link)}`);
    verify = await v.json();
  }

  const inboxUrl = `https://temp-mail.io/id/email/${email}/token/${token}`;

  return {
    index,
    email,
    token,
    inboxUrl,
    emailPrem: rd,
    link,
    verify,
  };
}

(async () => {
  const amount = parseInt(process.argv[2] || "1", 10);
  if (!amount || amount < 1) {
    console.log("Gunakan: node amprem.js <amount>");
    return;
  }

  console.log(`Memproses ${amount} akun...\n`);

  for (let i = 1; i <= amount; i++) {
    if (i > 1) {
      console.log(`Menunggu 60 detik sebelum akun berikutnya (hindari rate-limit)...`);
      await new Promise((r) => setTimeout(r, 60000));
    }
    try {
      const res = await processOne(i);
      console.log(`\n========== AKUN ${i}/${amount} ==========`);
      console.log(`Email   : ${res.email}`);
      console.log(`Token   : ${res.token}`);
      console.log(`Inbox   : ${res.inboxUrl}`);
      console.log(`Link    : ${res.link || "(tidak ditemukan)"}`);
      console.log(`Verifikasi: ${res.verify ? JSON.stringify(res.verify.message || res.verify) : "GAGAL"}`);
    } catch (e) {
      console.log(`\n========== AKUN ${i}/${amount} ==========`);
      console.log(`ERROR   : ${e.message}`);
    }
  }

  console.log("\nSelesai.");
})();