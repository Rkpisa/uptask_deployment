const Sequelize  = require('sequelize');
// Traemos la configuracióin de la DB
const db = require('../config/db');
// Traemos la tabla Cabecera para la relación
const Proyectos = require('./Proyectos');




// Definimos el modelo
const Tareas = db.define('tareas',{
    id:{
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement:true
    }   ,
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
}); 
// Crea la foreingKey
Tareas.belongsTo(Proyectos);
// otra forma
//Proyectos.hasMany(Tareas);

module.exports = Tareas;