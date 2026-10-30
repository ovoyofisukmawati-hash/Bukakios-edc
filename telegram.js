export default async function handler(req, res) {
    // Hanya izinkan method POST untuk keamanan akses endpoint
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message } = req.body;

    // Ambil kredensial dari Environment Variables Vercel yang aman dari eksposur klien
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return res.status(500).json({ error: 'Konfigurasi Environment Variables Telegram belum lengkap di server.' });
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();

        if (data.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ success: false, description: data.description });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
