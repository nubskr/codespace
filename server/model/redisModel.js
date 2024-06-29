const redis = require('redis');
const redisClient = redis.createClient();

redisClient.on('ready', async function() {
    console.log('Connected to Redis');
});

redisClient.on('error', function (err) {
    console.error('Redis Error:', err);
});

module.exports = {redisClient};