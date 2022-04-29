"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const pcsclite_1 = __importDefault(require("@pokusew/pcsclite"));
const pcsc = (0, pcsclite_1.default)();
const CONTROL_CODE = parseInt((_a = process.env.CONTROL_CODE) !== null && _a !== void 0 ? _a : '0x003136b0');
pcsc.on('reader', (reader) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('リーダーを認識しました: ' + reader.name);
    reader.on('end', () => {
        console.log('リーダーが取り外されました');
    });
    reader.on('error', (err) => {
        if (err instanceof Error) {
            console.error('PCSC Error', err.message);
            return;
        }
        console.error('PCSC Error', err);
    });
    const conProtocol = yield new Promise((r, d) => reader.connect({ share_mode: reader.SCARD_SHARE_DIRECT, protocol: 0 }, (e, protocol) => (e ? d(e) : r(protocol))));
    console.log('Direct connected: ' + reader.name);
    const startSesRes = yield new Promise((r, d) => reader.control(Buffer.from([0xff, 0xc2, 0x00, 0x00, 0x02, 0x81, 0x00, 0x00]), CONTROL_CODE, 7, (e, res) => (e ? d(e) : r(res))));
    console.log('Start Session Result:', startSesRes);
    const switchPrtRes = yield new Promise((r, d) => reader.control(Buffer.from([0xff, 0xc2, 0x00, 0x02, 0x04, 0x8f, 0x02, 0x03, 0x00, 0x00]), CONTROL_CODE, 7, (e, res) => (e ? d(e) : r(res))));
    console.log('Switch Protocol Result:', switchPrtRes);
    const pollingTimerId = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const pollingRes = yield new Promise((r, d) => reader.control(Buffer.from([
            0xff, 0xc2, 0x00, 0x01, 0x08, 0x95, 0x06, 0x06, 0x00, 0xfe, 0x00,
            0x00, 0x00, 0x00,
        ]), CONTROL_CODE, 256, (e, res) => (e ? d(e) : r(res))));
        console.log('Polling Result:', pollingRes);
        if (pollingRes.length >= 4 && pollingRes[3] === 0x90) {
            const idm = pollingRes.slice(16, 24);
            const idmStrAry = [];
            for (const d of idm.values()) {
                idmStrAry.push(d.toString(16).padStart(2, '0'));
            }
            const idmStr = idmStrAry.join(' ');
            const pmm = pollingRes.slice(24, 32);
            const pmmStrAry = [];
            for (const d of pmm.values()) {
                pmmStrAry.push(d.toString(16).padStart(2, '0'));
            }
            const pmmStr = pmmStrAry.join(' ');
            console.log('💳 Felica detected!');
            console.log('IDm     :', idmStr);
            console.log('PMm     :', pmmStr);
            const readBlockRes = yield new Promise((r, d) => reader.control(Buffer.from([
                0xff,
                0xc2,
                0x00,
                0x01,
                0x12,
                0x95,
                0x10,
                0x10,
                0x06,
                ...idm,
                0x01,
                0x8b,
                0x1a,
                0x01,
                0x80,
                0x00,
                0x00,
            ]), CONTROL_CODE, 256, (e, res) => (e ? d(e) : r(res))));
            if (readBlockRes.length >= 4 && readBlockRes[3] === 0x90) {
                const rawData = readBlockRes.slice(27, 43);
                const idBlock = rawData.toString('ascii');
                console.log(`学籍番号: ${idBlock.slice(2, 9)}`);
                console.log('読み取りを終了します');
                clearInterval(pollingTimerId);
                process.exit(0);
            }
        }
    }), 1000);
}));
pcsc.on('error', (err) => {
    if (err instanceof Error) {
        console.error('PCSC Error', err.message);
        return;
    }
    console.error('PCSC Error', err);
});
