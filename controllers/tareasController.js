// Necesito ambos modelos para insertar en la DB
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async(req, res, next) => {
    //res.send('Enviado');
    //console.log(req.params.url); // referencia al proyecto donde nos encontramos
    // Para consultas de los datos que se obtienen
    //console.log(proyecto);
    //console.log(req.body); 
    // Obtenemos Proyecto actual
     const proyecto = await Proyectos.findOne(
                            { where: { url: req.params.url }});

    // Leer los valores de entrada
    const {tarea} = req.body;
    
    // estado 0 = incompletoy Id del Proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    // Insertar en la db
    const resultado = await Tareas.create({ tarea, estado, proyectoId});
    if(!resultado){
        return next();
    }

    // Redireccionar
    res.redirect(`/proyectos/${req.params.url}`);

}

exports.cambiarEstadoTarea = async(req, res, next) => {
    // traigo el id de la Tarea
    const { id } = req.params;
    const tarea = await Tareas.findOne({where: { id }});
    //console.log(tarea);
 
    // Cambiar el estado
    let estado = 0;
    if(tarea.estado === estado){
        estado = 1;
    }
    tarea.estado = estado;

    const resultado = await tarea.save();
    if(!resultado)return next();
    res.status(200).send('La tarea ha sido actualizada exitósamente');
}

exports.eliminarTarea = async(req, res, next) => {

    // Para taer el Id utilizamos ->.params
    const { id } = req.params;

    // Eliminar la tarea
    const resultado = await Tareas.destroy({where: {id}});
    if(!resultado) return next();
    res.status(200).send('La tarea ha sido eliminanda correctamente');
}