const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '7598141042:AAGGYowfRbNGktMk8hupx-7xCcjcmMQwvmk';
const bot = new TelegramBot(token, { polling: true });

const adLink = "https://whoushex.top/4/9119665"; // Lien de publicité

bot.onText(/https?:\/\/(vm\.tiktok\.com|www\.tiktok\.com)\/[\w\d]+/, async (msg, match) => {
    const chatId = msg.chat.id;
    const videoUrl = match[0];

    // Demander de visiter la publicité avant CHAQUE téléchargement
    bot.sendMessage(chatId, `📢 Avant de télécharger la vidéo, merci de visiter ce lien :\n👉 [Clique ici](${adLink})`, {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "✅ J'ai visité le lien", callback_data: `confirm_${videoUrl}` }]
            ]
        }
    });
});

bot.on("callback_query", async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    if (data.startsWith("confirm_")) {
        const videoUrl = data.replace("confirm_", "");
        sendTikTokVideo(chatId, videoUrl);
    }
});

async function sendTikTokVideo(chatId, url) {
    bot.sendMessage(chatId, '⚙️ Traitement du lien, veuillez patienter...');

    try {
        const resolvedUrl = await getTikTokVideoUrl(url);
        bot.sendMessage(chatId, '✅ Voici votre lien de téléchargement :');
        bot.sendMessage(chatId, resolvedUrl);
    } catch (error) {
        bot.sendMessage(chatId, `⚠️ Une erreur est survenue : ${error.message}`);
    }
}

async function getTikTokVideoUrl(url) {
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.data?.data?.play) {
            return response.data.data.play;
        }
        throw new Error('Aucune vidéo trouvée pour ce lien.');
    } catch (error) {
        throw new Error('Erreur lors de la récupération de la vidéo.');
    }
}

console.log("🤖 Bot en marche...");