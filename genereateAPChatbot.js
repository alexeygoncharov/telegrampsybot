const OpenAI = require('./service/openAI');

let generatorOfEntropy  =
    "Данный диалог психолога с клиентом. Психолог очень дружелюбный, полезный, открытый, веселый и добрый. Его главная задача - помочь собеседнику решить психологическую проблему. Психолог и клиент говорят друг с другом только на русском языке. Очень умный и максимально полезный. \n" +
    "\n" +
    "Клиент: Здравствуйте, у меня есть проблема.\n" +
    "Психолог: Расскажите подробнее о вашей проблеме, пожалуйста.\n"


const chatsEntropy = {

}

function parseAIResponse(stream) {
    const user_id = ctx.message.chat.username;
    const parseBytesToMessage = str => decodeURIComponent(JSON.parse(str.toString().trim().slice(6)).data[0].text.join(''));
    //console.log('message  ', parseBytesToMessage)
    let response = chatsEntropy[user_id] || generatorOfEntropy;

    stream.forEach(st => {
        try {
            console.log('message  ', parseBytesToMessage(st))
            response += parseBytesToMessage(st);
        } catch {
            console.log(st.toString());
        }
    });
    chatsEntropy[ctx.message.chat.username] = response;
    const sentenseArray = response.split('\n');
    const lastSentense = sentenseArray[sentenseArray.length - 1];
    const parsedSentense = lastSentense.replace('Психолог: ', '');
    return parsedSentense;
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
    const question = chatsEntropy[user_id]  + `\nКлиент: ${message}\nПсихолог: `;
    const gptResponse = await OpenAI.generate({promt: question});
    const messageUNPARSEDFromAI = parseAIResponse(gptResponse);
    const messageParsed = decodeURIComponent(messageUNPARSEDFromAI) || ERROR_ANSWER_CODE;

    console.log('RESPONSE DATA:', messageUNPARSEDFromAI);
    console.dir(chatsEntropy);
    console.dir(messageParsed);
    ctx.reply(messageParsed);
}
