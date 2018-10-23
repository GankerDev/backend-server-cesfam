var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var capacitacionNotaSchema = new Schema({
    aprobacion_minima: { type: Number },
    aprobacion_maxima: { type: Number },
    factor: { type: Number }
}, { collection: 'capacitacionNota' });

module.exports = mongoose.model('capacitacionNota', capacitacionNotaSchema);