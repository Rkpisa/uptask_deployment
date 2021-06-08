const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al Modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// local Strategy - login con credenciales propias ( usuario - password)
passport.use(
    new LocalStrategy(
        // Por default passport espera usuario y password
        {
            usernameField:'email',
            passwordField:'password'
        },
        async(email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email,
                        activo: 1
                    }
                });
                
                // El usuario existe, passsword incorrecta
                if(!usuario.verificarPassword(password)){
                    // Password incorrecta
                    return done(null, false,{
                        message: 'La Password ingresada es incorrecta'
                    })
                }
                // El usuario existe, passsword correcta  
                return done(null, usuario);
            } catch (error) {
                // Usuario inexistente
                return done(null, false,{
                    message: 'NO existe esa Cuenta'
                })
            }
        }
    )
);

// Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

//Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// Exportar
module.exports = passport;




