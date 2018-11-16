var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var licenciaMedicaSchema = new Schema({
    cant_licencias_pedidas: { type: Number, required: true },
    cant_dias_licencia: { type: Number, required: true },
    desde: { type: Date, required: true },
    hasta: { type: Date, required: true },
    numero_licencia: { type: Number, required: true },
    entidad_pagadora: { type: String, required: true },
    renta1: { type: Number, required: true },
    renta2: { type: Number, required: true },
    renta3: { type: Number, required: true },
    promedio: { type: Number, required: true },
    img: { type: String, required: false },
    funcionario: { type: Schema.Types.ObjectId, ref: 'funcionario' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

}, { collection: 'licenciaMedica' });

module.exports = mongoose.model('licenciaMedica', licenciaMedicaSchema);