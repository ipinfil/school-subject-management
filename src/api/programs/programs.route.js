const router = require('express').Router();
const mongo = require('../../db');
const { getCache } = require('../../cache');

var db = mongo.getDb();
var cache = getCache();

router.get('/list', async (req, res) => {
    if (!db) {
        db = mongo.getDb();
    }

    if (!cache) {
        cache = getCache();
    }

    let programs = cache.get('programs-list');

    if (!programs) {
        programs = await db.collection('programs').find().toArray();
        cache.set('programs-list', programs);
    }

    res.status(200).json({status: true, programs: programs});
});

module.exports = router;