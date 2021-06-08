const express = require('express');// creamos servidor de express
const router = express.Router();// Para agregar una nueva ruta - Paso 0
const proyectosController = require('../controllers/proyectosController'); // Importamos el controlador para Proyectos
const tareasController = require('../controllers/tareasController'); // Importamos el controlador  para Tareas
const usuariosController = require('../controllers/usuariosController'); // Importamos el controlador  para Usuarios
const authController = require('../controllers/authController');

const { body } = require('express-validator/check');// Importar express validator

module.exports = function(){
    // ruta para el home 
    router.get('/', 
        authController.usuarioautenticado,
        proyectosController.proyectosHome
    ); 


    // Paso 1 - Para agregar una nueva ruta
    // Paso 2 - Definir partre del controlador .formularioProyecto
    // Paso 3 - Agragar la Vista
    router.get('/nuevo-proyecto',
        authController.usuarioautenticado,
        proyectosController.formularioProyecto
    );    
    router.post('/nuevo-proyecto',
        authController.usuarioautenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto);
    
    // Listar Proyecto
    router.get('/proyectos/:url',
        authController.usuarioautenticado,
        proyectosController.proyectoPorUrl
    );
        
    // Actualizar Proyecto
    router.get('/proyecto/editar/:id',
        authController.usuarioautenticado,
        proyectosController.formularioEditar
    );

    router.post('/nuevo-proyecto/:id',
        authController.usuarioautenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );
    
    // Eliminar Proyecto
    router.delete('/proyectos/:url', 
        authController.usuarioautenticado,
        proyectosController.eliminarProyecto
    );

    // Agregar Tarea
    router.post('/proyectos/:url', 
        authController.usuarioautenticado,
        tareasController.agregarTarea
    );
        
    // Actualizar Tarea
    router.patch('/tareas/:id', 
        authController.usuarioautenticado,
        tareasController.cambiarEstadoTarea
    );

    // Eliminar Tarea
    router.delete('/tareas/:id', 
        authController.usuarioautenticado,
        tareasController.eliminarTarea
    );

    // Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    // Iniciar sesión
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    // Cerrar sesión
    router.get('/cerrar-sesion', authController.cerrarSesion);
    
    // Restablecer contraseña
    router.get('/restablecer', usuariosController.formRestablecerPassword);
    router.post('/restablecer', authController.enviarToken);
    router.get('/restablecer/:token', authController.validarToken);
    router.post('/restablecer/:token', authController.actualizarPassword);

    return router;
}

