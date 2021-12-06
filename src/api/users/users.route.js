const router = require('express').Router();
const mongo = require('../../db');
const { HTTP_STATUS } = require('../../constants');

// get user info
router.get('/status', (req, res) => {
    let user = req.session.user;

    res.status(200).json({
        status: user !== null && user !== undefined,
        user: user
    });
});

// login user
router.post('/login', async (req, res) => {
    let user = req.body.username;
    let status = false;
    let extra;

    const db = mongo.getDb();

    if (user) {
        // find user
        let fetchedUser = await db.collection("users").findOne({name: user});

        // if user is not found, create him - this app does not support user authentication
        // that would be outside of the scope of this project :)
        if (!fetchedUser) {
            let createdUser = await db.collection("users").insertOne({name: user});

            // create student document as well
            let createdStudent = await db.collection("students").insertOne({name: user, user_id: createdUser.insertedId, study_years: []})
            extra = 'registered';
        }

        // inject user into session
        req.session.user = {name: user};
        status = true;
    }

    res.status(HTTP_STATUS.OK).json({
        status: status,
        user: req.session.user,
        extra: extra
    });
})

// logout user
router.post('/logout', (req, res) => {
    let user = req.session.user;
    let status = false;

    if (user) {
        req.session.destroy();
        status = true;
    }

    res.status(HTTP_STATUS.OK).json({
        status: status,
        user: null
    });
})

// user has made a study program choice
router.post('/program-choice', async (req, res) => {
    var db = mongo.getDb();
    let user = req.session.user;

    if (!user) {
        return res.status(HTTP_STATUS.NOT_AUTHORIZED);
    }

    let programSkr = req.body.program;
    let year = req.body.year;

    let program = await db.collection("programs").findOne({skratka: programSkr});
    let student = await db.collection("students").findOne({name: user.name});

    // update student document only if current year is not already in student's document
    if (!student || !student.study_years || !student.study_years.length || !student.study_years.filter(obj => obj.year === year)) {

        // automatically add compulsory subjects
        let studyPlans = await db.collection("programs").aggregate([
            {$match: {skratka: programSkr}},
            {$project: {subjects: "$studijnyPlan.typyVyucby"}},
        ]).toArray();

        studyPlans = studyPlans.shift().subjects;

        let programSubjects = [];
        let subjectCodes = [];

        for (studyPlan of studyPlans) {
            for (studyType of studyPlan) {
                // skip non-compulsory subjects
                if (!studyType.nazov || studyType.nazov !== "Povinné predmety") {
                    continue;
                }

                try {
                    let bloky = studyType.bloky;

                    // variable bloky is object
                    if (Object.prototype.toString.call(bloky) === '[object Object]') {
                        bloky = [bloky];
                    }

                    for (block of bloky) {
                        // skip block without subjects
                        if (!block.predmety) {
                            continue;
                        }

                        // add compulsory subjects from chosen year to student's attending subjects
                        for (predmet of block.predmety) {
                            if (predmet.rocnik == year && !subjectCodes.includes(predmet.skratka)) {
                                programSubjects.push(predmet);
                                subjectCodes.push(predmet.skratka);
                            }
                        }
                    }
                } catch (error) {
                    continue;
                }
            }
        }
        await db.collection("students").updateOne(
            {name: user.name},
            {$push: {
                study_years: {
                    program_id: program.id,
                    year: year,
                    program_skratka: program.skratka,
                    subjects: programSubjects,
                    taken_subjects: []
                    }
                }
            }
        );
    }

    req.session.user.program = req.body.program;
    req.session.user.year = req.body.year;

    res.status(HTTP_STATUS.OK).json({status: true});
})

module.exports = router;