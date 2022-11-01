"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const querystring_1 = require("querystring");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version } = require("../package.json");
const apiUrl = "https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize";
/**
 * Function to convert text(or ssml) to Voice
 *
 * @param {string} text Plain text (or ssml) on Russian, English or Turkish
 * @param {YandexTTSParams} params Request params for voice acting
 *
 * @returns {Buffer} Voice in format ogg-opus or wav-lpcm
 *
 * @see https://cloud.yandex.ru/docs/speechkit/tts/request
 */
async function TTS(text, params) {
    const options = {
        ssml: false,
        lang: "ru-RU",
        voice: "oksana",
        speed: 1.0,
        format: "oggopus",
        sampleRateHertz: 48000,
        emotion: "neutral",
        ...params,
    };
    const textParamName = options.ssml ? "ssml" : "text";
    const stringifiedParams = querystring_1.stringify({
        [textParamName]: text,
        lang: options.lang,
        voice: options.voice,
        speed: options.speed,
        format: options.format,
        sampleRateHertz: options.sampleRateHertz,
        emotion: options.emotion,
        folderId: options.folderId,
    });
    return new Promise((resolve, reject) => {
        const req = https_1.request(apiUrl, {
            method: "POST",
            headers: {
                Accept: `audio/${options.format}` === "oggopus"
                    ? "ogg; codec=opus"
                    : "vnd.wave; codec=lpcm",
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: options.auth,
                "User-Agent": `${name}/${version}`,
            },
        }, (res) => {
            let data = "";
            res.setEncoding("binary");
            res.on("data", (chunk) => {
                // console.log(chunk);
                data += chunk;
            });
            res.on("error", reject);
            res.on("end", () => {
                if (res.statusCode !== 200) {
                    const errorJson = Buffer.from(data, "binary").toString("utf8");
                    const { error_code: ec, error_message: em } = JSON.parse(errorJson);
                    reject(new Error(`${ec}: ${em}`));
                }
                else {
                    resolve(Buffer.from(data, "binary"));
                }
            });
        });
        req.write(stringifiedParams);
        req.end();
    });
}
exports.default = TTS;
