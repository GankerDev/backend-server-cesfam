var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var puntajeCDEFSchema = new Schema({
    nivel: { type: String },
    rango_min: { type: Number },
    rango_max: { type: Number },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'puntajeCDEF' });

module.exports = mongoose.model('puntajeCDEF', puntajeCDEFSchema);