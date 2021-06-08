const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');



exports.autenticarUsuario  = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Los campos son obligatorios'
});

// Función para revisar si el usuario está conectado o no
exports.usuarioautenticado = (req, res, next) => {

    // si el usuario está autenticado, seguir
    if(req.isAuthenticated()) {
        return next();
    }
    // sino redirigir al formulario
    return res.redirect('./iniciar-sesion');
}

//Función para el cierre de la sesión
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); // al cerrar sesión volvemos al Login 
    })
};

// Genera un token si el usuario es válido
exports.enviarToken = async(req, res) => {
    // Verificar que el usuario exista
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: {email}});
    
    // Si NO existe el Usuario
    if (!usuario){
        req.flash('error', 'No existe esa Cuenta');
        /* res.render('restablecer', {
            nombrePagina: 'Restablecer tu Contraseña',
            mensajes: req.flash()
        }) */
        res.redirect('/restablecer');
    }
 
    // Usuario existe
    usuario.token  = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    // Guardarlos en la DB
    await usuario.save();

    // url de reset
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;
    //console.log(resetUrl);

    // Enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject:  'Nueva contraseña',
        resetUrl,
        archivo: 'restablecer-password'
    });

    // Terminar
    req.flash('Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
    //res.json(req.params.token);
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    // sino hay usuario
    //console.log(usuario);
     if(!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/restablecer');
    }
    
    // Formulario para generar el password  --- Atenti -> validarPassword
    res.render('resetPassword', {
        nombrePagina: 'Restablecer Contraseña'
    })
}   
// Cambia la contraseña por una Nueva
exports.actualizarPassword = async(req, res) => {

    // Verifica el token válido y que no expire la fecha de creación
    const usuario = await Usuarios.findOne({
        where: {
            token : req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    // Verificar si el usuario existe
    if(!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/restablecer');
    }

    // hashear el password

    usuario.password =bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    // Guardamos la nueva password
    await usuario.save();

    req.flash('correcto', 'Tu contraseña se ha actualizado correctamente');
    res.redirect('/iniciar-sesion');

}

