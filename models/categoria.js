var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var categoriaSchema = new Schema({
    nombre_cargo_funcionario: { type: String, unique: true, required: true },
    descripcion_cargo_funcionario: { type: String },
    tipoCategoria: { type: Schema.Types.ObjectId, ref: 'tipoCategoria', required: [true, 'El id tipo categoria es un campo obligatorio'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'categoria' });

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });


module.exports = mongoose.model('categoria', categoriaSchema);