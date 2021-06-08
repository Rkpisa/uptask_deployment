const Sequelize  = require('sequelize');
// Extraer variables de entorno -> .env
require('dotenv').config({ path: 'variables.env'});

// Configurando la base de datos (mysql)
const db = new Sequelize(
    process.env.BD_NOMBRE,
    process.env.BD_USER,
    process.env.BD_PASS,
    {
        //'localhost'    
        host: process.env.BD_HOST,
        port:process.env.BD_PORT,
        dialect: 'mysql',
        define: {
            timestamps:false
        },
        
        pool:{
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);


module.exports = db;
