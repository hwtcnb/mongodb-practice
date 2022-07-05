const User = require('../models/schema')
const { Router } = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const dirPath = require('../dirPath')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.split('.')[0])
    }
})

const upload = multer({ storage: storage })

const router = Router()

router.get('/', async (req, res) => {
    const user = await User.findOne({ username: 'kakish' }).lean()
    if (user) {
        const data = user.picture.data.toString('base64')
        const contentType = user.pictures.contentType
        res.render('index', {
            data,
            contentType
        })
    } else {
        res.render('index')
    }
})

router.post('/', upload.single('image'), async (req, res) => {
    const user = await User.find({}).limit(1).lean()
    if (user) {
        const data = user.picture.data.toString('base64')
        const contentType = user.picture.contentType
        res.render('index', {
            data,
            contentType
        })
    } else {
        try {
            var obj = {
                username: req.body.name,
                picture: {
                    data: fs.readFileSync(path.join(dirPath + req.file.filename)),
                    contentType: 'png'
                }
            }
            User.create(obj, (err, item) => {
                if (err) {
                    console.log(err);
                } else {
                    item.save();
                    res.redirect('/');
                }
            });
        } catch (err){
            res.render('index', {
                miss: err.message
            })
        }
    }
    
})

module.exports = router