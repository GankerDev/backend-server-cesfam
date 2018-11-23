var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var puntajeABSchema = new Schema({
    nivel: { type: String, required: true },
    rango_min: { type: Number },
    rango_max: { type: Number },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'puntajeAB' });

module.exports = mongoose.model('puntajeAB', puntajeABSchema);