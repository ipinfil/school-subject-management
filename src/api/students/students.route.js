const router = require('express').Router();
const db = require('../../db');
const mongo = require('../../db');

router.get('/subjects', async (req, res) => {
    var db = mongo.getDb();
    let user = req.session.user;
    if (!user) {
        return res.status(401);
    }

    let student = await db.collection("students").findOne({name: user.name});

    let studyYear = student.study_years.filter(study_year => study_year.year === user.year)[0];

    if (studyYear) {
        let takenSubjectCodes = studyYear.taken_subjects.map((subject) => subject.skratka);

        for (let i = 0; i < studyYear.subjects.length; i++) {
            let subject = studyYear.subjects[i];
            studyYear.subjects[i].prerequisites_control = [{level: 0, value: '✓'}];

            if (!subject.prerekvizity) {
                continue;
            }

            if (subject.podmienujuce) {
                let podmienujuce = subject.podmienujuce;

                if (Object.prototype.toString.call(podmienujuce) === '[object Object]') {
                    podmienujuce = [podmienujuce];
                }

                for (podm of podmienujuce) {
                    if (!takenSubjectCodes.includes(podm.skratkaPredmet)) {
                        studyYear.subjects[i].prerequisites_control.push({level: 2, value: '✗', reason: "Neabsolvovali ste podmieňujúci predmet " + podm.skratkaPredmet + '!'});
                    }
                }
            }

            let prerequisites = subject.prerekvizity;
            if (Object.prototype.toString.call(prerequisites) === '[object Object]') {
                prerequisites = [prerequisites];
            }

            for (prerequisite of prerequisites) {
                if (prerequisite.kod === 'P' && !takenSubjectCodes.includes(prerequisite.podmienka) && !prerequisite.podmienka.includes(' a ') && !prerequisite.podmienka.includes(' alebo ')) { // compulsory prerequisite
                    studyYear.subjects[i].prerequisites_control.push({level: 2, value: '✗', reason: "Neabsolvovali ste podmieňujúci predmet " + prerequisite.podmienka + '!'});
                } else if (prerequisite.kod === 'V' && takenSubjectCodes.includes(prerequisite.podmienka)) {
                    studyYear.subjects[i].prerequisites_control.push({level: 2, value: '✗', reason: "Absolvovali ste vylučujúci predmet " + prerequisite.podmienka + '!'});
                }
            }

            if (studyYear.subjects[i].prerequisites_control.length > 1) {
                studyYear.subjects[i].prerequisites_control.filter((record) => record.value !== '✓');
            }
        }
    }

    res.status(200).json({
        status: true,
        subjects: studyYear ? studyYear.subjects : [],
        taken_subjects: studyYear ? studyYear.taken_subjects : []
    })
})

router.post('/update-subjects', async (req, res) => {
    var db = mongo.getDb();
    let user = req.session.user;
    if (!user) {
        return res.status(401);
    }

    let student = await db.collection('students').findOne(
        { name: user.name }
    );

    let index = null;
    let studyYear = null;

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

        let result = await db.collection('students').updateOne(
            {name: user.name},
            {$set: {'study_years': student.study_years}}
        );

    }

    res.status(200).json({
        status: true
    });
})

router.post('/update-taken-subjects', async (req, res) => {
    var db = mongo.getDb();
    let user = req.session.user;
    if (!user) {
        return res.status(401);
    }

    let student = await db.collection('students').findOne(
        { name: user.name }
    );

    let index = null;
    let studyYear = null;

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

        let result = await db.collection('students').updateOne(
            {name: user.name},
            {$set: {'study_years': student.study_years}}
        );

    }

    res.status(200).json({
        status: true
    });
})

module.exports = router;