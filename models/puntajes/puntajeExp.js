var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var puntajeExpSchema = new Schema({
    bienio: { type: Number },
    puntaje: { type: Number },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'puntajeExp' });

module.exports = mongoose.model('puntajeExp', puntajeExpSchema);