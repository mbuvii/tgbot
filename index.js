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
  // Use the new API endpoint
  const apiUrl = `https://apigemini-a5cf3977cb14.herokuapp.com/api/generate?prompt=${encodeURIComponent(prompt)}`;

  try {
    ctx.replyWithChatAction('typing');

    // Single API call to the new endpoint
    let response = await fetch(apiUrl);
    let data = await response.json();

    // Simplifying the extraction of the response text
    let result = data.text;

    if (!result) {
      throw new Error('No valid response from the API');
    }

    await ctx.reply(result);
  } catch (error) {
    console.error('Error from the API:', error);
    await ctx.reply('An error occurred while processing your request.');
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
