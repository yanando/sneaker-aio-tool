"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockxApplicationID = exports.stockxAPIKey = exports.proxyURL = exports.prefix = exports.token = void 0;
require('dotenv').config();
exports.token = process.env.TOKEN;
exports.prefix = '$';
exports.proxyURL = 'http://shayan:237057@155.254.37.151:3128';
exports.stockxAPIKey = '6b5e76b49705eb9f51a06d3c82f7acee';
exports.stockxApplicationID = 'XW7SBCT9V6';
