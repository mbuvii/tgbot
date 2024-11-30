// index.js
import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// Simple in-memory store for user contexts
const userContexts = {};

// Basic route for health check
app.get('/', (req, res) => {
  res.send('Bot is running');
});

// Handle incoming messages
bot.on('text', (ctx) => {
  const userId = ctx.from.id; // Get user ID from the message
  const text = ctx.message.text;

  // Initialize user's context if not present
  if (!userContexts[userId]) {
    userContexts[userId] = {
      history: [], // History of messages
    };
  }

  // Add the incoming text to the user's history
  userContexts[userId].history.push(text);

  // Handle the response
  handleResponse(ctx, text, userContexts[userId].history);
});

// Function to handle API responses
const handleResponse = async (ctx, prompt, history) => {
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

    // Optionally, append the response to history
    history.push(result);
    
    await ctx.reply(result);
  } catch (error) {
    console.error('Error from the first API:', error);

    const guru2 = `https://ultimetron.guruapi.tech/gpt3?prompt=${encodeURIComponent(prompt)}`;

    try {
      // Second API call if the first fails
      let response = await fetch(guru2);
      let data = await response.json();
      let result = data.completion;

      // Append to history
      history.push(result);

      await ctx.reply(result);
    } catch (secondError) {
      console.error('Error from the second API:', secondError);
      await ctx.reply('An error occurred while processing your request.');
    }
  }
};

// Start the bot
bot.launch().then(() => console.log('Bot is running!')).catch(err => console.error('Error launching the bot:', err));

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
