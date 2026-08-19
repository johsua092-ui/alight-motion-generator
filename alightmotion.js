const args = process.argv.slice(2);
const command = args[0];


const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json"
};

async function sendEmail(email) {
  const url = `https://generator-amprem.zone.id/api/amsend?email=${encodeURIComponent(email)}`;
  
  try {
    console.log(`[+] Mengirim email ke: ${email}`);
    const response = await fetch(url, { method: "GET", headers });
    const data = await response.json();
    console.log("[>] Response:", data);
  } catch (error) {
    console.error("[!] Error saat mengirim email:", error);
  }
}

async function verifyLink(email, link) {
  const url = `https://generator-amprem.zone.id/api/amverif?email=${encodeURIComponent(email)}&link=${encodeURIComponent(link)}`;
  
  try {
    console.log(`[+] Melakukan verifikasi link untuk: ${email}`);
    const response = await fetch(url, { method: "GET", headers });
    const data = await response.json();
    console.log("[>] Response:", data);
  } catch (error) {
    console.error("[!] Error saat verifikasi link:", error);
  }
}

if (command === "--send") {
  const email = args[1];
  if (!email) {
    console.error("Format salah! Gunakan: node am.js --send <email>");
    process.exit(1);
  }
  sendEmail(email);

} else if (command === "--verif") {
  const email = args[1];
  const link = args[2];
  if (!email || !link) {
    console.error("Format salah! Gunakan: node am.js --verif <email> <link verif>");
    console.error("Catatan: Endpoint API membutuhkan email dan link secara bersamaan.");
    process.exit(1);
  }
  verifyLink(email, link);

} else {
  console.log("Perintah tidak dikenali. Cara penggunaan:");
  console.log("  node am.js --send <email>");
  console.log("  node am.js --verif <email> <link verif>");
}
