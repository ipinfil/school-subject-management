const { HTTP_STATUS } =  require('../../constants');
const router = require('express').Router();
const mongo = require('../../db');

// get student's subjects with prerequisites checked
router.get('/subjects', async (req, res) => {
    let user = req.session.user;

    if (!user) {
        return res.status(HTTP_STATUS.NOT_AUTHORIZED);
    }

    let student = await mongo.getDb().collection("students").findOne({name: user.name});

    let studyYear = student.study_years.filter(study_year => study_year.year === user.year)[0];

    if (studyYear) { // if student has chosen year of study
        let takenSubjectCodes = studyYear.taken_subjects.map((subject) => subject.skratka);

        // subject prerequisites check
        for (let i = 0; i < studyYear.subjects.length; i++) {
            let subject = studyYear.subjects[i];
            studyYear.subjects[i].prerequisites_control = [{level: 0, value: '✓'}];

            if (!subject.prerekvizity) {
                continue;
            }

            if (subject.podmienujuce) {
                let podmienujuce = subject.podmienujuce;

                // if type of variable podmienujuce is object
                if (Object.prototype.toString.call(podmienujuce) === '[object Object]') {
                    podmienujuce = [podmienujuce];
                }

                // add prerequisites to subject's prerequisites array
                for (podm of podmienujuce) {
                    if (!takenSubjectCodes.includes(podm.skratkaPredmet)) {
                        studyYear.subjects[i].prerequisites_control.push({level: 2, value: '✗', reason: "Neabsolvovali ste podmieňujúci predmet " + podm.skratkaPredmet + '!'});
                    }
                }
            }

            let prerequisites = subject.prerekvizity;

            // if type of variable prerequisites is object
            if (Object.prototype.toString.call(prerequisites) === '[object Object]') {
                prerequisites = [prerequisites];
            }

            // add prerequisites to subject's prerequisites array
            for (prerequisite of prerequisites) {
                if (prerequisite.kod === 'P' && !takenSubjectCodes.includes(prerequisite.podmienka) && !prerequisite.podmienka.includes(' a ') && !prerequisite.podmienka.includes(' alebo ')) { // compulsory prerequisite
                    studyYear.subjects[i].prerequisites_control.push({level: 2, value: '✗', reason: "Neabsolvovali ste podmieňujúci predmet " + prerequisite.podmienka + '!'});
                } else if (prerequisite.kod === 'V' && takenSubjectCodes.includes(prerequisite.podmienka)) {
                    studyYear.subjects[i].prerequisites_control.push({level: 2, value: '✗', reason: "Absolvovali ste vylučujúci predmet " + prerequisite.podmienka + '!'});
                }
            }

            // filter positive value from prerequisites_control, because student does not meat the criteria
            // to attend tis subject
            if (studyYear.subjects[i].prerequisites_control.length > 1) {
                studyYear.subjects[i].prerequisites_control.filter((record) => record.value !== '✓');
            }
        }
    }

    res.status(HTTP_STATUS.OK).json({
        status: true,
        subjects: studyYear ? studyYear.subjects : [],
        taken_subjects: studyYear ? studyYear.taken_subjects : []
    })
})

// update student's subjects
router.post('/update-subjects', async (req, res) => {
    let user = req.session.user;

    if (!user) {
        return res.status(HTTP_STATUS.NOT_AUTHORIZED);
    }

    // find student
    let student = await mongo.getDb().collection('students').findOne(
        { name: user.name }
    );

    let index = null;
    let studyYear = null;

    // find correct study year
    for (let i = 0; i < student.study_years.length; i++) {
        studyYear = student.study_years[i];
        if (studyYear.year === req.session.user.year && studyYear.program_skratka === req.session.user.program) {
            index = i;
            break;
        }
    }

    if (index !== null) {
        studyYear.subjects = req.body.subjects;
        student.study_years[index] = studyYear;

        // update student's subjects
        let result = await mongo.getDb().collection('students').updateOne(
            {name: user.name},
            {$set: {'study_years': student.study_years}}
        );

    }

    res.status(HTTP_STATUS.OK).json({
        status: true
    });
})

// update student's taken subjects
router.post('/update-taken-subjects', async (req, res) => {
    var db = mongo.getDb();
    let user = req.session.user;

    if (!user) {
        return res.status(HTTP_STATUS.NOT_AUTHORIZED);
    }

    // find student
    let student = await db.collection('students').findOne(
        { name: user.name }
    );

    let index = null;
    let studyYear = null;

    // find student's study year
    for (let i = 0; i < student.study_years.length; i++) {
        studyYear = student.study_years[i];
        if (studyYear.year === req.session.user.year && studyYear.program_skratka === req.session.user.program) {
            index = i;
            break;
        }
    }

    if (index !== null) {
        studyYear.taken_subjects = req.body.subjects;
        student.study_years[index] = studyYear;

        // update student's taken subjects
        let result = await db.collection('students').updateOne(
            {name: user.name},
            {$set: {'study_years': student.study_years}}
        );

    }

    res.status(HTTP_STATUS.OK).json({
        status: true
    });
})

module.exports = router;