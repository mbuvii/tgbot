import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// Use your bot token from the .env file
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Welcome to your AI Personal Assistant! Ask me anything.');
});

bot.on('text', async (ctx) => {
    const text = ctx.message.text;

    if (!text) {
        ctx.reply("Please provide some text.");
        return;
    }

    try {
        ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
        const prompt = encodeURIComponent(text);

        const guru1 = `https://api.gurusensei.workers.dev/llama?prompt=${prompt}`;
        let response = await fetch(guru1);
        let data = await response.json();
        let result = data.response.response;

        if (!result) {
            throw new Error('No valid JSON response from the first API');
        }

        await ctx.reply(result);
    } catch (error) {
        console.error('Error from the first API:', error);
        const guru2 = `https://ultimetron.guruapi.tech/gpt3?prompt=${prompt}`;

        try {
            let response = await fetch(guru2);
            let data = await response.json();
            let result = data.completion;

            await ctx.reply(result);
        } catch (err) {
            console.error('Error:', err);
            await ctx.reply("*ERROR*");
        }
    }
});

bot.launch();
console.log('Bot is running...');
