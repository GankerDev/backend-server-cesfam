var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var tipoPermisos = {
    values: ['VIATICO', 'ADMINISTRATIVO'],
    message: '{VALUE} no es un tipo de permiso permitido'
}

var tipoPermisosSchema = new Schema({
    nombre: { type: String, unique: true, required: true, enum: tipoPermisos },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'tipoPermisos' });

tipoPermisosSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('tipoPermisos', tipoPermisosSchema);