var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var puntajeCapCDEFSchema = new Schema({
    rango_min: { type: Number },
    rango_max: { type: Number },
    puntaje: { type: Number },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'puntajeCapCDEF' });

module.exports = mongoose.model('puntajeCapCDEF', puntajeCapCDEFSchema);