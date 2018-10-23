var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var capacitacionNivelTecnicoSchema = new Schema({
    nivel_tecnico: { type: String, required: true },
    factor: { type: Number },
}, { collection: 'capacitacionNivelTecnico' });

module.exports = mongoose.model('capacitacionNivelTecnico', capacitacionNivelTecnicoSchema);