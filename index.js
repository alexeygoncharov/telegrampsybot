require('dotenv').config();


const { Telegraf } = require('telegraf');
const generateAPChatbot = require('./genereateAPChatbot');
const completionsAPChatbot = require('./completionsAPChatbot');


global.bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Hey Chika ya hikka, lets talk!')
})
bot.use((ctx, next) => {
    global.ctx = ctx;
    global.user_id = ctx?.message?.chat?.username || 'default';
    next();
})
bot.hears('hi', async(ctx) => ctx.reply('Hello sweeetheart!!! ;3'));
bot.hears('hello', async(ctx) => ctx.reply('Hello sweeetheart!!! ;3'));
bot.hears('привет', async(ctx) => ctx.reply('Иди нахуй'));

bot.command('refresh', (ctx) => {
    //chatsEntropy[ctx.message.chat.id] = {}
    generateAPChatbot(true);
    return ctx.reply('refresh feed')
});
bot.command('generate', (ctx) => {
    return ctx.reply('switching to generate chatmode')
});
bot.on('text',async () => {
    //generateAPChatbot(); uncomment if want to use generation api
    completionsAPChatbot()
})
bot.launch()
