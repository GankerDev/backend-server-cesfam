var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var puntajeCapABSchema = new Schema({
    rango_min: { type: Number },
    rango_max: { type: Number },
    puntaje: { type: Number }
}, { collection: 'puntajeCapAB' });

module.exports = mongoose.model('puntajeCapAB', puntajeCapABSchema);