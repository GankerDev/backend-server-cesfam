var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var funcionarioSchema = new Schema({
    nombre: { type: String, required: true },
    rut: { type: String, unique: true, required: true },
    fecha_nacimiento: { type: Date, required: true },
    direccion: { type: String },
    email: { type: String, unique: true },
    telefono: { type: String, unique: true },
    fecha_inicio_laboral: { type: Date, required: true },
    fecha_cumple_bienio: { type: Date },
    puntaje_cap_acumulado: { type: Number },
    total_puntaje: { type: Number },
    nivel_actual: { type: String },
    img: { type: String, required: false },

    categoria_funcionario: { type: Schema.Types.ObjectId, ref: 'categoria', required: [true, 'El id tipo categoria es un campo obligatorio'] },
    capacitacion: { type: Schema.Types.ObjectId, ref: 'capacitacion' },
    tipo_contrato: { type: Schema.Types.ObjectId, ref: 'tipoContrato' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'funcionario' });

funcionarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });


module.exports = mongoose.model('funcionario', funcionarioSchema);