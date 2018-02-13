const express = require('express');
const session = require('express-session');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const fanfic = require('./routes/fanfic')(router);
const bodyParser = require('body-parser');
const passport = require('passport');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoose.uri, (err) => {
    if(err) {
        console.log('Fail to connect the database: ', err)
    } else {
        console.log('Connected to database: ' + config.mongoose.db);
    }
});
app.use(session({ resave: false,
    saveUninitialized: true,
    secret: 'Secret'  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);
app.use('/fanfic', fanfic);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(3000, () => {
    console.log('listening on port 3000')
});