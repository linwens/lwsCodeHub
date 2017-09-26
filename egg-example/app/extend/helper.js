const moment = require('moment');//模块没下载下载
exports.relativeTime = time => moment(new Date(time * 1000)).fromNow();