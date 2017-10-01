"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Result {
    constructor(data, options, client) {
        this.options = options;
        this.data = data;
        this.client = client;
    }
    getPreviousPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.data.length == 0 || this.options.page == 0) {
                return null;
            }
            var newOptions = JSON.parse(JSON.stringify(this.options));
            newOptions.page -= 1;
            return yield this.client.getReplayPage(this.options);
        });
    }
    getNextPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.data.length == 0) {
                return null;
            }
            var newOptions = JSON.parse(JSON.stringify(this.options));
            newOptions.page += 1;
            return yield this.client.getReplayPage(this.options);
        });
    }
}
const bluebird = require("bluebird");
const request = require("request");
let requestAsync = bluebird.promisify(request);
class Client {
    generateQuery(options) {
        var strings = new Array();
        for (var key in options) {
            strings.push(encodeURIComponent(key) + "=" + encodeURIComponent(options[key]));
        }
        return "?" + strings.join("&");
    }
    get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = yield requestAsync({ url: url });
            if (response.statusCode != 200) {
                return null;
            }
            return JSON.parse(response.body);
        });
    }
    ;
    getReplayPage(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof (options.page) != "number") {
                options.page = 0;
            }
            var query = this.generateQuery(options);
            return new Result(yield this.get("https://hotsapi.net/api/v1/replays/paged" + query), options, this);
        });
    }
    getReplay(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = this.generateQuery(options);
            return yield this.get("https://hotsapi.net/api/v1/replays/" + id + query);
        });
    }
    getReplays(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var query = this.generateQuery(options);
            return yield this.get("https://hotsapi.net/api/v1/replays" + query);
        });
    }
}
module.exports = Client;
//# sourceMappingURL=lib.js.map