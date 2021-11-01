const { MongoClient } = require('mongodb');
var _db;
var _client;

module.exports = {

    connectToServer: async function (url, db, callback) {
        await MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
            _db = client.db(db);
            _client = client;
            return callback(err, _db);
        });
    },

    getDb: function () {
        return _db;
    },

    close: function () {
        client.close();
    }
};