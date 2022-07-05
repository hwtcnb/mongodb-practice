const { Schema, model } = require('mongoose')

const schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    picture: {
        data: Buffer,
        contentType: String
    }
})

module.exports = model('User', schema)