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

router.get('/subjects', async (req, res) => {
    var db = mongo.getDb();
    let user = req.session.user;
    if (!user) {
        return res.status(401);
    }

    let program = await db.collection('programs').findOne({skratka: user.program});
    let subjects = [];
    let subjectCodes = [];

    for (studijnyPlan of program.studijnyPlan) {
        for (typVyucby of studijnyPlan.typyVyucby) {

            if (typVyucby.bloky === undefined || typVyucby.bloky === null) {
                continue;
            }

            let editedTyp = typVyucby;
            if (Object.prototype.toString.call(typVyucby.bloky) === '[object Object]') {
                editedTyp.bloky = [typVyucby.bloky];
            }

            for (blok of editedTyp.bloky) {
                for (predmet of blok.predmety) {
                    let editedSubject = predmet;

                    if (subjectCodes.includes(editedSubject.skratka)) {
                        continue;
                    }

                    editedSubject.typ = typVyucby.nazov === "Povinné predmety" ? "p" : (typVyucby.nazov === "Povinne voliteľné predmety" ? 'pv' : 'p');

                    subjects.push(editedSubject);
                    subjectCodes.push(editedSubject.skratka);
                }
            }
        }
    }

    res.status(200).json({
        status: true,
        subjects: subjects
    });
})

module.exports = router;