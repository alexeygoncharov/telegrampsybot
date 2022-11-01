"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.text2speech = exports.speech2text = void 0;
var stt_1 = require("./stt");
Object.defineProperty(exports, "speech2text", { enumerable: true, get: function () { return __importDefault(stt_1).default; } });
var tts_1 = require("./tts");
Object.defineProperty(exports, "text2speech", { enumerable: true, get: function () { return __importDefault(tts_1).default; } });
