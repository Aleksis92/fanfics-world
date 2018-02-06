const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports =
{
    uri: 'mongodb://Aleksis92:Zqswcdvr87@fanfics-db-shard-00-00-fu8wh.mongodb.net:27017,fanfics-db-shard-00-01-fu8wh.mongodb.net:27017,fanfics-db-shard-00-02-fu8wh.mongodb.net:27017/fanfics-db?ssl=true&replicaSet=fanfics-db-shard-0&authSource=admin',
    secret: crypto,
    db: 'fanfics-db'
};
