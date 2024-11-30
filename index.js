// index.js
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

// Configure dotenv to load environment variables from .env file
dotenv.config();

// Create a new Telegraf bot instance with your bot token from the environment variable
const bot = new Telegraf(process.env.BOT_TOKEN);

// Command /start
bot.start((ctx) => ctx.reply('Welcome to the Telegram bot!'));

// Command /help
bot.help((ctx) => ctx.reply('This is a help message!'));

// Echo any text message sent to the bot
bot.on('text', (ctx) => ctx.reply(`You said: ${ctx.message.text}`));

// Launch the bot
bot.launch().then(() => {
    console.log('Bot is running!');
}).catch(err => {
    console.error('Error launching the bot:', err);
});
