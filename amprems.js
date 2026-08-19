
import readline from 'readline/promises';

const rl = readline.createInterface({

    input: process.stdin,

    output: process.stdout

})

async function sendlink(mail) {

    try {

        const headers = {

            "Referer": "https://alight-motion-premium.vercel.app/",

            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36"

        }

        const raw = await fetch(`https://api.kyzznekoo.my.id/api/alightmotion/v3/magic-link?email=${encodeURIComponent(mail)}`, {

            method: 'GET',

            headers: headers

        })

        const res = await raw.json()

        return res

    } catch (e) {

        return e.message

    }

}

async function verify(mail, linkz) {

    try {

        const headers = {

            "Referer": "https://alight-motion-premium.vercel.app/",

            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36"

        }

        const raw = await fetch(`https://api.kyzznekoo.my.id/api/alightmotion/v3/applyPremium?email=${mail}&link=${linkz}`, {

            method: 'GET',

            headers: headers

        })

        const res = await raw.json()

        return res

    } catch (e) {

        return e.message

    }

}

async function main() {

    console.log('masukan email: ')

    const mail = await rl.question(' ')

    const res1 = await sendlink(mail)

    if (res1.status == true) {

        console.log('Magic link berhasil dikirim ke email. Sesi berlaku 5 menit, kirim link itu disini: ')

        const link = await rl.question(' ')

        const res2 = await verify(mail, link)

        if (res2.status == true) {

            console.log('=========================================')

            console.log('AKUN AM BERHASIL DIAKTIVASI')

            console.log('TARGET: ' + mail)

            console.log('DURASI: ~1 TAHUN')

            console.log('DETAIL:')

            console.log(res2.data)

            console.log('=========================================')

            process.exit(1)

        }

    }

}

main()