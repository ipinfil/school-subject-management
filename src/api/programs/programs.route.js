const router = require('express').Router();
const mongo = require('../../db');
const { getCache } = require('../../cache');
const { HTTP_STATUS } = require('../../constants');

// get list of available programs
router.get('/list', async (req, res) => {
    const cache = getCache();

    // first check cache
    let programs = cache.get('programs-list');

    if (!programs) {
        // fetch programs
        programs = await mongo.getDb().collection('programs').find().toArray();

        // cache it for quicker access
        cache.set('programs-list', programs);
    }

    res.status(HTTP_STATUS.OK).json({status: true, programs: programs});
});

// get list of program's subjects
router.get('/subjects', async (req, res) => {
    let user = req.session.user;

    if (!user) {
        return res.status(HTTP_STATUS.NOT_AUTHORIZED);
    }

    // user's program
    let program = await mongo.getDb().collection('programs').findOne({skratka: user.program});
    let subjects = [];
    let subjectCodes = [];

    for (studijnyPlan of program.studijnyPlan) {
        for (typVyucby of studijnyPlan.typyVyucby) {

            if (typVyucby.bloky === undefined || typVyucby.bloky === null) {
                continue;
            }

            let editedTyp = typVyucby;
            // if typVyucby variable is object
            if (Object.prototype.toString.call(typVyucby.bloky) === '[object Object]') {
                editedTyp.bloky = [typVyucby.bloky];
            }

            for (blok of editedTyp.bloky) {
                for (predmet of blok.predmety) {
                    let editedSubject = predmet;

                    // avoid duplicates
                    if (subjectCodes.includes(editedSubject.skratka)) {
                        continue;
                    }

                    // mark subjects according to their types
                    editedSubject.typ = typVyucby.nazov === "Povinné predmety" ? "p" : (typVyucby.nazov === "Povinne voliteľné predmety" ? 'pv' : 'p');

                    subjects.push(editedSubject);
                    subjectCodes.push(editedSubject.skratka);
                }
            }
        }
    }

    res.status(HTTP_STATUS.OK).json({
        status: true,
        subjects: subjects
    });
})

module.exports = router;