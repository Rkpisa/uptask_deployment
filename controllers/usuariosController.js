const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta',{
        nombrePagina: 'Crear Cuenta en  Uptask'
    });
}

exports.formIniciarSesion = (req,res) => {
    //console.log(res.locals.mensajes);
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion',{
        nombrePagina: 'Iniciar Sesión en  Uptask',
        error
    });
}

exports.crearCuenta = async(req, res) => {
    // Leer los Datos
    const {email, password } = req.body;

    try {
        // Crear el Usuario
        await Usuarios.create({
            email,
            password
        });

        // Crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
    
        // Crear el objeto usuario
        const usuario = {
            email
        }

        // Enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu Cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        // Redirigir al usuario
        req.flash('correcto', 'Envíanos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        //console.log(error);
        // Genero un objeto con todos los errores que tengo
        // Luego los paso a la vista en mensajes.
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en Uptask',
            email,
            password
        })
    }
}

exports.formRestablecerPassword = (req, res) => {
    res.render('restablecer', {
        nombrePagina:'Restablecer Contraseña'
    })
}

// Cambia el estado de una Cuenta
exports.confirmarCuenta = async(req, res) => {
    //res.json(req.params.correo);
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // Si NO existe el usuario
    if(!usuario){
        req.flash('error', 'No válido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'La cuenta ha sido activada correctamente');
    res.redirect('/iniciar-sesion');


}