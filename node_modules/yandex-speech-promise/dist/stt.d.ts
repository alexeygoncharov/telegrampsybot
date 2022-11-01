/// <reference types="node" />
export declare type YandexSTTParams = {
    profanityFilter?: boolean;
    format?: "lpcm" | "oggopus";
    sampleRateHertz?: 48000 | 16000 | 8000;
    folderId?: string;
    auth: string;
    lang?: "ru-RU" | "en-US" | "tr-TR";
    topic?: "general" | "general:rc" | "maps";
};
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
export default function STT(audio: Buffer, params: YandexSTTParams): Promise<string>;
