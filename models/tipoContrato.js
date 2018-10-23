var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var tipoContratoSchema = new Schema({
    nombre_tipo_contrato: { type: String, required: true },
    descripcion_tipo_contrato: { type: String },
}, { collection: 'tipoContrato' });

module.exports = mongoose.model('tipoContrato', tipoContratoSchema);