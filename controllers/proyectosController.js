const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


//const slug = require('slug');

exports.proyectosHome = async (req,res) => {
 
    // Accion del controlador
    // Se conecta la Modelo (Proyectos) mediante interacciones (.findAll)-- Datos de la DB
    // Luego se lo pasa a la Vista (proyectos) --- como se van a mostrar los datos
    //console.log(res.locals.usuario);
    const usuarioId = res.locals.usuario.id;   
    const proyectos = await Proyectos.findAll({where: { usuarioId }});
    
    res.render('index',{
        nombrePagina : 'Proyectos',  //   '+ res.locals.year,
        proyectos
    });
}

exports.formularioProyecto = async(req,res)=>{

    const usuarioId = res.locals.usuario.id;   
    const proyectos = await Proyectos.findAll({where: { usuarioId }});
    
    res.render('nuevoProyecto',{
        nombrePagina : 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req,res)=>{
    // Enviar a la consola lo que el usuario escriba.
    // Validar que tengamos algo en el input
    //const {nombre} = req.body;

    const usuarioId = res.locals.usuario.id;   
    const proyectos = await Proyectos.findAll({where: { usuarioId }});
    
    const nombre = req.body.nombre;
     
    let errores = [];
    if(!nombre){
        errores.push({'texto' : 'Agregar Nombre de Proyecto'})
    }

    // si hay errores y le pasamos los errores a la vista
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina:'Nuevo Proyecto',
            errores,
            proyectos 
        })
    } else {
        // NO hay errores, luego Insertar en la BD.
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/'); // me redirige al home
    }
}


exports.proyectoPorUrl = async (req, res, next) => {

    const usuarioId = res.locals.usuario.id;   
    const proyectosPromise = Proyectos.findAll({where: { usuarioId }});
    //const proyectosPromise =  Proyectos.findAll();
    const proyectoPromise =  Proyectos.findOne({
        where :{
            url: req.params.url,
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // Consultar tareas del Proyecto actual
    //console.log(proyecto);
    // Traer todas las tareas de l proyecto
    // También se puede incluir el objeto completo ->include:
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }/* ,
        include:[
            { model: Proyectos }
        ] */
    });

    //console.log(tareas);

    if(!proyecto) return next();
    
    //res.send('Listo');

    // Render a la vista
    res.render('tareas',{
        nombrePagina : 'Tareas del Proyecto',
        proyecto,
        proyectos,tareas
    })
}

exports.formularioEditar= async(req, res)=>{
    const usuarioId = res.locals.usuario.id;   
    const proyectosPromise = Proyectos.findAll({where: { usuarioId }});
   
    //const proyectosPromise =  Proyectos.findAll();
    const proyectoPromise =  Proyectos.findOne({
        where :{
            id: req.params.id,
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // render a la vista
    res.render('nuevoProyecto', {
        nombrePagina : 'Editar Proyecto',
        proyecto,
        proyectos
    })
}

exports.actualizarProyecto= async (req,res)=>{
    // Enviar a la consola lo que el usuario escriba.
    // Validar que tengamos algo en el input
    //const {nombre} = req.body;

    const usuarioId = res.locals.usuario.id;   
    const proyectos = await Proyectos.findAll({where: { usuarioId }});
    //const proyectos = await Proyectos.findAll();
    const nombre = req.body.nombre;
     
    let errores = [];
    if(!nombre){
        errores.push({'texto' : 'Actualizar Nombre de Proyecto'})
    }

    // si hay errores y le pasamos los errores a la vista
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina:'Nuevo Proyecto',
            errores,
            proyectos 
        })
    } else {
        // NO hay errores, luego Insertar en la BD.
        await Proyectos.update(
            { nombre: nombre },
            {where: { id: req.params.id }}
            );
            res.redirect('/');
    }
}

exports.eliminarProyecto = async (req,res,next) => {
    // Para req, se puede usar query o params... para recuparar la url 
    //console.log(req.params);
   // console.log(req.query);

   const {urlProyecto} = req.query;

   const resultado = await Proyectos.destroy({where: { url: urlProyecto }});

    if(!resultado){
        return next();
    }

   res.status(200).send('Proyecto eliminado correctamente');
}