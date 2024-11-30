// index.js
import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Configure dotenv to load environment variables from .env file
dotenv.config();

// Create a new Telegraf bot instance with your bot token from environment variables
const bot = new Telegraf(process.env.BOT_TOKEN);

let handler = async (ctx) => {
  const text = ctx.message.text;

  if (!text) {
    return ctx.reply("Please provide some text.");
  }

  try {
    ctx.replyWithChatAction('typing');
    const prompt = encodeURIComponent(text);

    const guru1 = `https://api.gurusensei.workers.dev/llama?prompt=${prompt}`;

    try {
      let response = await fetch(guru1);
      let data = await response.json();
      let result = data.response.response;

      if (!result) {
        throw new Error('No valid JSON response from the first API');
      }

      // Send the response back to the user
      await ctx.reply(result);
    } catch (error) {
      console.error('Error from the first API:', error);

      const guru2 = `https://ultimetron.guruapi.tech/gpt3?prompt=${prompt}`;

      let response = await fetch(guru2);
      let data = await response.json();
      let result = data.completion;

      // Send the response back to the user
      await ctx.reply(result);
    }
  } catch (error) {
    console.error('Error:', error);
    ctx.reply('*ERROR*');
  }
};

// Register the handler for any text message
bot.on('text', handler);

// Start the bot
bot.launch().then(() => {
  console.log('Bot is running!');
}).catch(err => {
  console.error('Error launching the bot:', err);
});
