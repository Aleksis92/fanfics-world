const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports =
{
    mongoose: {
    uri: 'mongodb://Aleksis92:Zqswcdvr87@fanfics-db-shard-00-00-fu8wh.mongodb.net:27017,' +
    'fanfics-db-shard-00-01-fu8wh.mongodb.net:27017,fanfics-db-shard-00-02-fu8wh.mongodb.net:27017/' +
    'fanfics-db?ssl=true&replicaSet=fanfics-db-shard-0&authSource=admin',
    secret: crypto,
    db: 'fanfics-db'
    },
    domain: 'http://localhost:3000',
    port: 3000,
    facebook: {
        clientID: "420171288418017",
        clientSecret: "380a8a0c1cf1c7c0f7c9062c8aa9bf64",
        callbackURL: "http://localhost:3000/authentication/social/facebook/callback"
    },
    vkontakte: {
        clientID: "6363321",
        clientSecret: "6I3hbdhvlbCVujIgvuPd",
        callbackURL: "http://localhost:3000/authentication/social/vkontakte/callback"
    },
    twitter: {
        consumerKey: "H4W2U7aeztGRfYsC0NmyJvC9I",
        consumerSecret: "JBhzdqyQ2vQRbR7Mm89vmd2ztNh01MPmglUemwvPGQ0XbpWreW",
        callbackURL: "http://localhost:3000/authentication/social/twitter/callback"
    }
};
