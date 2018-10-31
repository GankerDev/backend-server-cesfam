var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var tipoCategoriaSchema = new Schema({
    nivel: { type: String, unique: true, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'tipoCategoria' });

tipoCategoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('tipoCategoria', tipoCategoriaSchema);