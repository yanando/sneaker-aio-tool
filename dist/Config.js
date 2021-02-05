"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyURL = exports.prefix = exports.token = void 0;
require('dotenv').config();
exports.token = process.env.TOKEN;
exports.prefix = '$';
exports.proxyURL = 'http://shayan:237057@155.254.37.151:3128';
