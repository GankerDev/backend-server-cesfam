var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var capacitacionNivelTecnicoSchema = new Schema({
    nivel_tecnico: { type: String, required: true },
    factor: { type: Number },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'capacitacionNivelTecnico' });

module.exports = mongoose.model('capacitacionNivelTecnico', capacitacionNivelTecnicoSchema);