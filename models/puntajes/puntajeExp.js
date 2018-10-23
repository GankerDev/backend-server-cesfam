var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var puntajeExpSchema = new Schema({
    bienio: { type: Number },
    puntaje: { type: Number }
}, { collection: 'puntajeExp' });

module.exports = mongoose.model('puntajeExp', puntajeExpSchema);