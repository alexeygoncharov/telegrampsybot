require('dotenv').config();


const { Telegraf } = require('telegraf');
const generateAPChatbot = require('./genereateAPChatbot');
const completionsAPChatbot = require('./completionsAPChatbot');


global.bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Привет! Я - твой личный психолог. Я готов тебе помочь. Пожалуйста, напишите свой вопрос. С чем вам помочь?')
})
bot.use((ctx, next) => {
    global.ctx = ctx;
    global.user_id = ctx?.message?.chat?.username || 'default';
    next();
})
bot.hears('hi', async(ctx) => ctx.reply('Hello sweeetheart!!! ;3'));

bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.command('refresh', (ctx) => {
    //chatsEntropy[ctx.message.chat.id] = {}
    generateAPChatbot(true);
    return ctx.reply('refresh feed')
});

bot.on('text',async () => {
    //generateAPChatbot(); uncomment if want to use generation api
    completionsAPChatbot()
    ctx.replyWithChatAction('typing');
})
bot.launch()
