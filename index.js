// index.js
import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import express from 'express';

// Load environment variables
dotenv.config();

// Create a bot instance using the token from environment variables
const bot = new Telegraf(process.env.BOT_TOKEN);

// Initialize Express app
const app = express();

// Add a simple route (could be useful for health checks)
app.get('/', (req, res) => {
  res.send('Bot is running');
});

// Handle incoming messages
bot.on('text', (ctx) => {
  const text = ctx.message.text;
  if (!text) {
    return ctx.reply("Please provide some text.");
  }

  handleResponse(ctx, text);
});

// Function to handle API responses
const handleResponse = async (ctx, prompt) => {
  const guru1 = `https://api.gurusensei.workers.dev/llama?prompt=${encodeURIComponent(prompt)}`;

  try {
    ctx.replyWithChatAction('typing');

    // First API call
    let response = await fetch(guru1);
    let data = await response.json();
    let result = data.response?.response;

    if (!result) {
      throw new Error('No valid JSON response from the first API');
    }

    await ctx.reply(result);
  } catch (error) {
    console.error('Error from the first API:', error);

    const guru2 = `https://ultimetron.guruapi.tech/gpt3?prompt=${encodeURIComponent(prompt)}`;

    try {
      // Second API call if the first fails
      let response = await fetch(guru2);
      let data = await response.json();
      let result = data.completion;

      await ctx.reply(result);
    } catch (secondError) {
      console.error('Error from the second API:', secondError);
      await ctx.reply('An error occurred while processing your request.');
    }
  }
};

// Start the bot
bot.launch().then(() => {
  console.log('Bot is running!');
}).catch(err => {
  console.error('Error launching the bot:', err);
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
