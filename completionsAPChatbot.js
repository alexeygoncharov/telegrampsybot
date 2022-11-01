const OpenAI = require('./service/openAI');

let generatorOfEntropy  =
`Данный диалог на русском языке. ИИ - очень добрый, открытый человек. Может говорить на любые темы и быть полезным человеку. ИИ не придумывает факты, а даёт только достоверную информацию человеку. Если клиент спрашивает, кто создатель ИИ - отвечай "Алексей Гончаров". 

Человек: Здравствуйте
ИИ: Добрый день

`


const chatbotConf = {
    prompt: generatorOfEntropy,
    max_tokens: 500,
    temperature: 0.9,
    presence_penalty: 0.6,
    stop: ['\n', "Психолог:", 'Человек:']
};

const chatsEntropy = {
    ulyanass: ''
}

const ERROR_ANSWER_CODE = '🙄';

module.exports = async function(isRefresh) {
    if(isRefresh) {
        chatsEntropy[ctx.message.chat.username] = generatorOfEntropy;
        console.log('SYSTEM: FEED IS REFRESHED FOR ', user_id);
        return;
    }

    const message = ctx.message.text;
    chatsEntropy[user_id] = chatsEntropy[user_id] || generatorOfEntropy;

    const question = chatsEntropy[user_id]  + `\nЧеловек: ${message} \nAI:`;
    chatsEntropy[user_id] += `\nЧеловек: ${message}`;

    const prompt = decodeURIComponent(encodeURIComponent(question));

    try {
        const gptResponse = await OpenAI.complete({...chatbotConf, prompt});

        const messageFromAI = gptResponse?.data?.choices[0]?.text || ERROR_ANSWER_CODE;
        chatsEntropy[user_id] += `\nAI: ${messageFromAI}`;

        console.dir(chatsEntropy);
        //console.log('RESPONSE DATA:', gptResponse?.data || 'NO RESPONSE');
        ctx.reply(messageFromAI);
    } catch (err) {
        console.error('ERROR FROM OpenAI occured!')
        console.dir(chatsEntropy);

        chatsEntropy[user_id] = generatorOfEntropy;

        ctx.reply(ERROR_ANSWER_CODE);
    }
}
