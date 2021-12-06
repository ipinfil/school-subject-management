const express = require('express');
const cors = require('cors');
const path = require('path');
const sessions = require('express-session');
const api = require('./api');
const mongo = require('./db');
const cache = require('./cache');
const { HTTP_STATUS, SESSION_SECRET } = require('./constants');
var MongoDBStore = require('connect-mongodb-session')(sessions);

const app = express();
const mongoUrl = require('./db.config').mongoUrl;

mongo.connectToServer(mongoUrl, 'dd', (err, _db) => {
    console.log("Connected to mongoDB.");

    var store = new MongoDBStore({
        uri: mongoUrl,
        collection: 'sessions',
        databaseName: 'dd'
    });

    store.on('error', function (error) {
        console.log(error);
    });

    const { notFound, errorHandler } = require('./middlewares/errors.middleware');

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static('client/public'));
        app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
        });
    }

    app.use(express.json());
    app.use(cors({ credentials: true, origin: 'http://localhost:3400' }));

    //session middleware
    app.use(sessions({
        secret: SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        },
        store: store,
        resave: true,
        saveUninitialized: true
    }));

    cache.initCache();

    app.get('/', (req, res) => {
        res.status(HTTP_STATUS.OK).json({
            message: '📦 Svelte Express API 📦'
        });
    });
    app.use('/api', api);


    app.use(notFound);
    app.use(errorHandler);

    const port = process.env.PORT || 5678;

    app.listen(port, () => {
        console.log(`Server is up at port http://localhost:${port}`);
    });

    process.on('exit', function() {
        mongo.close();
    });
});
