const {Schema, model} = require('mongoose')


const roleSchema = new Schema({
    name: {type: String, unique: true, default: "User"},
    level: {type: Number, default: 0}
})

module.exports = model('Role', roleSchema)