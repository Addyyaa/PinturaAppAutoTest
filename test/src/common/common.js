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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateScreenInfo = generateScreenInfo;
var serverConfig_json_1 = require("../../data/serverConfig.json");
var api_json_1 = require("../../data/api.json");
var globals_1 = require("@wdio/globals");
function generateScreenInfo(token) {
    return __awaiter(this, void 0, void 0, function () {
        function getScreenStorage(screenId) {
            return __awaiter(this, void 0, void 0, function () {
                var storageUrl, response, data, fetchError_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            storageUrl = serverConfig_json_1.default.protocal.http + '://' + serverConfig_json_1.default.host.test_cn + ':' + serverConfig_json_1.default.port + api_json_1.default.screenApi.getScreenStorage + '/' + screenId;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, fetch(storageUrl, {
                                    method: "GET",
                                    headers: {
                                        'X-TOKEN': token,
                                        'Accept': 'application/json'
                                    }
                                })];
                        case 2:
                            response = _a.sent();
                            if (!response.ok) {
                                throw new Error("HTTP error! status: ".concat(response.status));
                            }
                            return [4 /*yield*/, response.json()];
                        case 3:
                            data = _a.sent();
                            if (data.data.totalStorage > 0) {
                                return [2 /*return*/, true];
                            }
                            else {
                                return [2 /*return*/, false];
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            fetchError_1 = _a.sent();
                            console.error('Fetch 请求失败:', fetchError_1);
                            return [2 /*return*/, false];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        var screenDetails, screenInfo, screenInfoUrl, screenIn, screenDetail, promises;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    screenDetails = [];
                    screenInfoUrl = "".concat(serverConfig_json_1.default.protocal.http, "://").concat(serverConfig_json_1.default.host.test_cn, ":").concat(serverConfig_json_1.default.port).concat(api_json_1.default.OTARecord);
                    return [4 /*yield*/, fetch(screenInfoUrl, {
                            method: "GET",
                            headers: {
                                'X-TOKEN': token
                            }
                        })];
                case 1:
                    screenIn = _a.sent();
                    return [4 /*yield*/, screenIn.json()];
                case 2:
                    screenDetail = _a.sent();
                    if (screenIn.status === 200) {
                        if (screenDetail.code === 20) {
                            screenInfo = screenDetail.data;
                        }
                        else {
                            console.log("未能获取到屏幕信息1");
                            (0, globals_1.expect)(true).toBe(false);
                        }
                    }
                    else {
                        console.log("未能获取到屏幕信息2");
                        (0, globals_1.expect)(true).toBe(false);
                    }
                    promises = screenInfo.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                        var innerPromises;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    innerPromises = item.screenList.map(function (screen) { return __awaiter(_this, void 0, void 0, function () {
                                        var screenId, hasStorage;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    screenId = screen.screenId;
                                                    return [4 /*yield*/, getScreenStorage(screenId)];
                                                case 1:
                                                    hasStorage = _a.sent();
                                                    screenDetails.push({
                                                        screenId: screenId,
                                                        groupId: item.id,
                                                        hasStorage: hasStorage
                                                    });
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    return [4 /*yield*/, Promise.all(innerPromises)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, screenDetails];
            }
        });
    });
}
// 全局挂载
globalThis.generateScreenInfo = generateScreenInfo;
