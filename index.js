const express = require('express');// creamos servidor de express
const routes = require('./routes');// importamos rutas (routes)
const path = require('path');// importamos el path para leer las carpetas
const bodyParser = require('body-parser');// importamos el bodyParser para leer datos del formulario
const expressValidator = require('express-validator');// importamos el express validator
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// Extraer variables de entorno -> .env
require('dotenv').config({ path: 'variables.env'});



const helpers = require('./helpers');// importamos Helpers con algunas funciones
const db = require('./config/db');// Crear la conexión a la DB

require('./models/Proyectos');// Importar el modelo de Proyectos
require('./models/Tareas');// Importar el modelo de Tareas
require('./models/Usuarios');// Importar el modelo de Usuarios

db.sync()
    .then(()=>console.log('Conectado al Servidor'))
    .catch(error=>console.log(error));

const app = express();// crear una app en express

app.use(express.static('public'));// donde cargar los archivvos estáticos

app.set('view engine', 'pug');// Habilitar Pug

app.use(bodyParser.urlencoded({extended: true}));// Habilitar bodyParser para leer datos del formulario.

//app.use(expressValidator());// Agregamos express validator a toda la Aplicación

app.set('views', path.join(__dirname, './views'));// Añadir la carpeta de las vistas

app.use(flash());//Agregar flash messages

app.use(cookieParser());

// sesión que nos permite navegar entre <> páginas sin volver a autenticar
app.use(session({
    secret: 'altosecreto',
    resave: false,
    saveUninitialized: false
    
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar var dump a la aplicación con .locals (las haces Variables locales) para que
// lo puedan consumir las variables en cualquier otro archivo
app.use((req,res,next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    // Lugar donde tenemos toda la info del usuario -> req.user
    // Guardo una copia completa en locals.usuario
    res.locals.usuario = {...req.user} || null;
    //console.log(res.locals.usuario);
    // Para asegurar que pase al siguiente Middle ware
    // y no regrese al comienzo del archivo-- next()
    next();
});

app.use('/', routes()); // Rutas 


// Servidor y Puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor está L I S T O!!!');
});

require('./handlers/email');


/*
// Idea de la ruta: patrón MVC
// 1- Se accede a la pagina principal ('/') en el index.js, por el router
//    define que controlador se va a mostrar (.proyectosHome)
// 2- Vamos a proyectosHome  en proyectoController.js., luego hace la consulta al modelo
//    exports.proyectosHome = async (req,res)=>{
//      const proyectos = await Proyectos.findAll(); -- por los datos  y el mismo controlador
//    le pasa los datos a la vista:
//      res.render('index',{
//          nombrePagina : 'Proyectos',
//          proyectos -- acá
//      });
//     } 
*/


//Agrego el año con otro middleware
/*  app.use((req,res,next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
    
}); 
 */

