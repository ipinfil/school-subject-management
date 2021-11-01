const router = require('express').Router();
const mongo = require('../../db');

router.get('/status', (req, res) => {
    let user = req.session.user;

    res.status(200).json({
        status: user !== null && user !== undefined,
        user: user
    });
});

router.post('/login', async (req, res) => {
    let user = req.body.username;
    let status = false;
    let extra;

    var db = mongo.getDb();

    if (user && user !== null) {
        let fetchedUser = await db.collection("users").findOne({name: user});
        console.log(fetchedUser);

        if (!fetchedUser) {
            await db.collection("users").insertOne({name: user});
            extra = 'registered';
        }

        req.session.user = {name: user};
        status = true;
    }

    res.status(200).json({
        status: status,
        user: req.session.user,
        extra: extra
    });
})

router.post('/logout', (req, res) => {
    let user = req.session.user;
    let status = false;

    if (user && user !== null) {
        req.session.destroy();
        status = true;
    }

    res.status(200).json({
        status: status,
        user: null
    });
})

router.post('/program-choice', async (req, res) => {
    let user = req.session.user;
    if (!user) {
        return res.status(401);
    }

    req.session.user.program = req.body.program;
    req.session.user.year = req.body.year;

    res.status(200).json({status: true});
})

module.exports = router;