/// <reference types="node" />
declare type VoiceActors = "oksana" | "jane" | "omazh" | "zahar" | "ermil" | "silaerkan" | "erkanyavas" | "alyss" | "nick" | "alena" | "filipp";
export declare type YandexTTSParams = {
    ssml?: boolean;
    lang?: "ru-RU" | "en-US" | "tr-TR";
    voice?: VoiceActors;
    emotion?: "neutral" | "good" | "evil";
    speed?: number;
    format?: "oggopus" | "lpcm";
    sampleRateHertz?: 48000 | 16000 | 8000;
    folderId?: string;
    auth: string;
};
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
export default function TTS(text: string, params: YandexTTSParams): Promise<Buffer>;
export {};
