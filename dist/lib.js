"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nydus_1 = require("nydus");
const crypto_1 = require("crypto");
class HotsAPIResult {
    constructor(data, options, client) {
        this.options = options;
        this.data = data;
        this.client = client;
    }
    duplicateOptions() {
        let ret = {};
        for (var key in this.options) {
            ret[key] = this.options[key];
        }
        return ret;
    }
    getReplays() {
        return this.data.replays;
    }
    getPreviousPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.data.replays.length == 0 || this.options.page == 0) {
                return null;
            }
            const newOptions = this.duplicateOptions();
            let page = this.data.page;
            if (page === undefined && this.options.page !== undefined) {
                page = this.options.page;
            }
            else {
                return null;
            }
            newOptions.page = page - 1;
            return yield this.client.getReplayPage(this.options);
        });
    }
    getNextPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.data.replays.length == 0) {
                return null;
            }
            const newOptions = this.duplicateOptions();
            let page = this.data.page;
            if (page === undefined && this.options.page !== undefined) {
                page = this.options.page;
            }
            else {
                return null;
            }
            newOptions.page = page + 1;
            return yield this.client.getReplayPage(this.options);
        });
    }
}
exports.HotsAPIResult = HotsAPIResult;
const bluebird_1 = require("bluebird");
const req = require("request");
const fs_1 = require("fs");
let readFileAsync = bluebird_1.promisify(fs_1.readFile);
let request = bluebird_1.promisify(req);
class HotsAPIClient {
    generateQuery(options) {
        if (options == undefined) {
            options = {};
        }
        var strings = new Array();
        for (var key in options) {
            strings.push(encodeURIComponent(key) + "=" + encodeURIComponent(options[key]));
        }
        return "?" + strings.join("&");
    }
    post(url, replay) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield request({ url: url, method: 'POST', headers: { "User-Agent": this.UA() }, formData: { "replay": replay } });
            if (response.statusCode != 200) {
                return null;
            }
            return JSON.parse(response.body);
        });
    }
    ;
    get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield request({ url: url, method: 'GET', headers: { "User-Agent": this.UA() } });
            if (response.statusCode != 200) {
                return null;
            }
            return JSON.parse(response.body);
        });
    }
    ;
    getReplayPage(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options == undefined) {
                options = { page: 0 };
            }
            if (typeof (options.page) != "number") {
                options.page = 0;
            }
            var query = this.generateQuery(options);
            return new HotsAPIResult(yield this.get("https://hotsapi.net/api/v1/replays/paged" + query), options, this);
        });
    }
    getReplay(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options !== undefined && options.page !== undefined) {
                return yield this.getReplayPage(options);
            }
            if (options === undefined || options.id === undefined) {
                return null;
            }
            const query = this.generateQuery(options);
            return yield this.get("https://hotsapi.net/api/v1/replays/" + options.id + query);
        });
    }
    getReplays(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options !== undefined && options.page !== undefined) {
                return yield this.getReplayPage(options);
            }
            if (options !== undefined && options.id !== undefined) {
                return yield this.getReplay(options);
            }
            const query = this.generateQuery(options);
            return yield this.get("https://hotsapi.net/api/v1/replays" + query);
        });
    }
    getAbility(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options === undefined || options.ability === undefined || options.hero === undefined) {
                return null;
            }
            return yield this.get("https://hotsapi.net/api/v1/heroes/" + options.hero + "/abilities/" + options.ability);
        });
    }
    getHero(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options === undefined || options.hero === undefined) {
                return yield this.getHeroes(options);
            }
            if (options.ability !== undefined) {
                return yield this.getAbility(options);
            }
            return yield this.get("https://hotsapi.net/api/v1/heroes/" + options.hero);
        });
    }
    getHeroes(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options !== undefined) {
                if (options.hero !== undefined) {
                    if (options.ability !== undefined) {
                        return yield this.getAbility(options);
                    }
                    return yield this.getHero(options);
                }
            }
            return yield this.get("https://hotsapi.net/api/v1/heroes/");
        });
    }
    getTalent(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options === undefined || options.talent === undefined) {
                return null;
            }
            return yield this.get("https://hotsapi.net/api/v1/talents/" + options.talent);
        });
    }
    getMap(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options === undefined || options.map === undefined) {
                return yield this.getMaps(options);
            }
            return yield this.get("https://hotsapi.net/api/v1/maps/" + options.map);
        });
    }
    getMaps(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options !== undefined && options.map !== undefined) {
                return yield this.getMap(options);
            }
            return yield this.get("https://hotsapi.net/api/v1/maps/");
        });
    }
    fingerprint(data) {
        const bytes = crypto_1.createHash("md5").update(data, "ascii").digest();
        let result = "";
        for (let i = 0; i < 16; ++i) {
            result += ("0" + bytes.readUInt8(HotsAPIClient.GUIDByteOrder[i]).toString(16)).substr(-2);
            if (HotsAPIClient.GUIDDashPositions.includes(i)) {
                result += "-";
            }
        }
        return result;
    }
    getFingerprint(replayFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const Nydus = new nydus_1.Parser(nydus_1.GameType.HERO);
            yield Nydus.reload();
            try {
                const Replay = yield Nydus.loadReplay(replayFile);
                yield Replay.loadProtocol();
                let details = Replay.parseDetails();
                let initData = Replay.parseInitData();
                let ids = new Array();
                for (let i = 0; i < details.m_playerList.length; ++i) {
                    ids.push(details.m_playerList[i].m_toon.m_id);
                }
                ids = ids.sort((a, b) => a - b);
                return this.fingerprint(ids.join("") + initData.m_syncLobbyState.m_gameDescription.m_randomValue);
            }
            catch (err) {
                throw err;
            }
        });
    }
    replayFingerprintV3(replayFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fingerprint = yield this.getFingerprint(replayFile);
                return this.get("https://hotsapi.net/api/v1/replays/fingerprints/v3/" + fingerprint);
            }
            catch (err) {
                throw err;
            }
        });
    }
    uploadReplay(replayFile, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const existence = yield this.replayFingerprintV3(replayFile);
            if (existence === null) {
                return false;
            }
            if (existence.exists) {
                return true;
            }
            const file = yield readFileAsync(replayFile);
            const query = this.generateQuery(options);
            return yield this.post("https://hotsapi.net/api/v1/replays" + query, file);
        });
    }
    toString() {
        return "Adostra.v1 version 1.0.0";
    }
    UA() {
        return "adostra=1.0.0;node;request";
    }
}
HotsAPIClient.GUIDByteOrder = [3, 2, 1, 0, 5, 4, 7, 6, 8, 9, 10, 11, 12, 13, 14, 15];
HotsAPIClient.GUIDDashPositions = [3, 5, 7, 9];
exports.HotsAPIClient = HotsAPIClient;
exports.default = HotsAPIClient;
//# sourceMappingURL=lib.js.map