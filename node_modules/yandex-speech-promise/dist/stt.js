"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const querystring_1 = require("querystring");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version } = require("../package.json");
const apiUrl = "https://stt.api.cloud.yandex.net/speech/v1/stt:recognize";
/**
 * Function to recognize speech to text
 *
 * @param {Buffer} audio
 * @param {YandexSTTParams} params
 *
 * @returns {string} - result of recognition
 *
 * @see https://cloud.yandex.ru/docs/speechkit/stt/request
 */
function STT(audio, params) {
    return new Promise((resolve, reject) => {
        const options = {
            profanityFilter: false,
            lang: "ru-RU",
            topic: "general",
            format: "oggopus",
            sampleRateHertz: 48000,
            ...params,
        };
        const stringifiedParams = querystring_1.stringify(options);
        const req = https_1.request(`${apiUrl}?${stringifiedParams}`, {
            headers: {
                "Content-Type": `audio/${options.format}` === "oggopus"
                    ? "ogg; codec=opus"
                    : "vnd.wave; codec=lpcm",
                Accept: "application/json",
                Authorization: options.auth,
                "User-Agent": `${name}/${version}`,
            },
            method: "POST",
        }, (res) => {
            res.setEncoding("utf8");
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("error", reject);
            res.on("end", () => {
                const obj = JSON.parse(data);
                if (obj.result) {
                    resolve(obj.result);
                }
                else {
                    const { error_code: ec, error_message: em } = obj;
                    reject(new Error(`${ec}: ${em}`));
                }
            });
        });
        req.write(audio);
        req.end();
    });
}
exports.default = STT;
