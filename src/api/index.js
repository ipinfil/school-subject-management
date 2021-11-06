const router = require('express').Router();
const path = require('path');
const Downloader = require('nodejs-file-downloader');
const {parse} = require('node-html-parser');
const fs = require('fs').promises;
const _fs = require('fs');
const xml2js = require('xml2js');

const mongo = require('../db');
const users = require('./users/users.route');
const programs = require('./programs/programs.route');
const students = require('./students/students.route');


router.get('/', (req, res) => {
    res.status(200).json({
        message: (Math.random() + 1).toString(36).substring(7),
    });
});

router.post('/init', async (req, res) => {
    let status = true;
    var db = mongo.getDb();

    try{
        await db.collection('programs').drop();
    }
    catch (error) {
        console.error(error);
    }

    if (!_fs.existsSync(path.resolve(__dirname, '..', 'downloads', 'programs.html'))) {
        // download list of xml files containing programs
        var downloader = new Downloader({
            url: 'https://ais2.uniba.sk/repo2/repository/default/ais/web/studijnyPlan/2021-2022/FMFI/SK/',
            directory: path.resolve(__dirname, '..', 'downloads'),
            fileName: 'programs.html'
        })
        try {
            await downloader.download();
        } catch (error) {
            console.log('Download failed', error);
            return res.status(200).json({status : false, msg: 'Download failed!'});
        }
    }

    let data = await fs.readFile(path.resolve(__dirname, '..', 'downloads', 'programs.html'), 'utf8');
    var files = [];
    let parsed = parse(data);

    let list = parsed.querySelectorAll("a");
    for (child of list) {
        if (child.rawAttrs.includes('http://ais2.uniba.sk/repo2/repository/default/ais/web/studijnyPlan/2021-2022/FMFI/SK/')) {
            files.push(child.rawAttrs.substring(6, child.rawAttrs.length - 1));
        }
    }

    var parser = new xml2js.Parser({explicitRoot: false, explicitArray: false});
    let programs = [];

    for (file of files) {
        let fileName = file.replace('http://ais2.uniba.sk/repo2/repository/default/ais/web/studijnyPlan/2021-2022/FMFI/SK/', '');

        // download xml
        if (!_fs.existsSync(path.resolve(__dirname, '..', 'downloads', fileName))) {
            downloader = new Downloader({
                url: file,
                directory: path.resolve(__dirname, '..', 'downloads'),
                fileName: fileName
            })
            try {
                await downloader.download();
            } catch (error) {
                console.log('Download failed', error);
                return res.status(200).json({status : false, msg: 'Download failed!'});
            }
        }

        // read xml
        data = await fs.readFile(path.resolve(__dirname, '..', 'downloads', fileName), 'utf8');

        try {
            // parse to json
            data = await parser.parseStringPromise(data);
        } catch (error) {
            console.error("Could not parse " + fileName);
            continue;
        }

        delete data['$'];
        data.skratka = fileName.replace('.xml', '');
        programs.push(data);
    }

    let result = await db.collection('programs').insertMany(programs);

    res.status(200).json({status: true});
});

// routes registration
router.use('/users', users);
router.use('/programs', programs);
router.use('/students', students);

module.exports = router;