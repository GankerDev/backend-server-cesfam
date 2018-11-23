var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var duracionCAPSchema = new Schema({
    min: { type: Number },
    max: { type: Number },
    puntaje: { type: Number },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'duracionCAP' });

module.exports = mongoose.model('duracionCAP', duracionCAPSchema);