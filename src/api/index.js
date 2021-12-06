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

// initialize database
router.post('/init', async (req, res) => {
    var db = mongo.getDb();

    // first drop existing collection
    try{
        await db.collection('programs').drop();
    }
    catch (error) {
        console.error(error);
    }

    // download only if the html list of programs is not already downloaded
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

            return res.status(HTTP_STATUS.OK).json({status : false, msg: 'Download failed!'});
        }
    }

    let data = await fs.readFile(path.resolve(__dirname, '..', 'downloads', 'programs.html'), 'utf8');
    var files = [];

    // parse html document
    let parsed = parse(data);

    // iterate through anchor tags
    let list = parsed.querySelectorAll("a");
    for (child of list) {

        // XML files should contain this string
        if (child.rawAttrs.includes('http://ais2.uniba.sk/repo2/repository/default/ais/web/studijnyPlan/2021-2022/FMFI/SK/')) {
            // remove href="
            files.push(child.rawAttrs.substring(6, child.rawAttrs.length - 1));
        }
    }

    // XML parser
    var parser = new xml2js.Parser({explicitRoot: false, explicitArray: false});
    let programs = [];

    for (file of files) {
        let fileName = file.replace('http://ais2.uniba.sk/repo2/repository/default/ais/web/studijnyPlan/2021-2022/FMFI/SK/', '');

        // download xmls
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
                return res.status(HTTP_STATUS.OK).json({status : false, msg: 'Download failed!'});
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

        // delete special object property added by parser
        delete data['$'];

        data.skratka = fileName.replace('.xml', '');
        programs.push(data);
    }

    // insert new programs into db
    let result = await db.collection('programs').insertMany(programs);

    res.status(200).json({status: true});
});

// routes registration
router.use('/users', users);
router.use('/programs', programs);
router.use('/students', students);

module.exports = router;