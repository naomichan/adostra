"use strict";
/// <reference types="node" />
/// <reference types="request" />
/// <reference types="bluebird" />
/// <reference path="d/hotsapiclient.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Result = /** @class */ (function () {
    function Result(data, options, client) {
        this.options = options;
        this.data = data;
        this.client = client;
    }
    Result.prototype.getPreviousPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.data.length == 0 || this.options.page == 0) {
                            return [2 /*return*/, null];
                        }
                        newOptions = JSON.parse(JSON.stringify(this.options));
                        newOptions.page -= 1;
                        return [4 /*yield*/, this.client.getReplayPage(this.options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Result.prototype.getNextPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.data.length == 0) {
                            return [2 /*return*/, null];
                        }
                        newOptions = JSON.parse(JSON.stringify(this.options));
                        newOptions.page += 1;
                        return [4 /*yield*/, this.client.getReplayPage(this.options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Result;
}());
var bluebird = require("bluebird");
var request = require("request");
var requestAsync = bluebird.promisify(request);
var Client = /** @class */ (function () {
    function Client() {
    }
    Client.prototype.generateQuery = function (options) {
        var strings = new Array();
        for (var key in options) {
            strings.push(encodeURIComponent(key) + "=" + encodeURIComponent(options[key]));
        }
        return "?" + strings.join("&");
    };
    Client.prototype.get = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, requestAsync({ url: url })];
                    case 1:
                        response = _a.sent();
                        if (response.statusCode != 200) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, JSON.parse(response.body)];
                }
            });
        });
    };
    ;
    Client.prototype.getReplayPage = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (options == undefined) {
                            options = { page: 0 };
                        }
                        if (typeof (options.page) != "number") {
                            options.page = 0;
                        }
                        query = this.generateQuery(options);
                        _a = Result.bind;
                        return [4 /*yield*/, this.get("https://hotsapi.net/api/v1/replays/paged" + query)];
                    case 1: return [2 /*return*/, new (_a.apply(Result, [void 0, _b.sent(), options, this]))()];
                }
            });
        });
    };
    Client.prototype.getReplay = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.generateQuery(options);
                        return [4 /*yield*/, this.get("https://hotsapi.net/api/v1/replays/" + id + query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.getReplays = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.generateQuery(options);
                        return [4 /*yield*/, this.get("https://hotsapi.net/api/v1/replays" + query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Client;
}());
module.exports = Client;
