/**
 * Created by zaenal on 16/11/15.
 */
process.env.NODE_ENV = 'test';
var studentCache = require('./student/cache');
studentCache.cache();