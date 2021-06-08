const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs');


const Usuarios = db.define('usuarios',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email:{
        type: Sequelize.STRING(60),
        allowNull : false,
        validate: {
            isEmail: {
                msg: 'Debe ingresar un Correo válido'
            },
            notEmpty: {
                msg: 'El Correo NO debe estar vacío'
            }    
        },
        unique: {
            args: true,
            msg: 'El Usuario ya ha sido Registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull : false,
        validate: {
            notEmpty: {
                msg: 'Debe ingresar una Password'
            }
        }    
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
},{
    hooks: {
        beforeCreate(usuario) {
            //Con esto accedemos antes a la base
            //Luego necesitamos acceder sólo al password para hashearlo
            usuario.password =bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
            //console.log('Creando nuevo usuario');
            //console.log(usuario);
        }
    }
});

// Métodos personalizados
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;

