
// Configuración de babel
// Para acceder al File system
// En el public, una salida de archivos
const path = require('path');
const webpack = require('webpack');

module.exports = {
    //Entrypoint, archivo de entrada
    // lo pasa por webpack y crea una salida
    entry:'./public/js/app.js',
    output: {
        // nos que da este archivo de salida
        filename: 'bundle.js',
        // crear una nueva carpeta dist en  public
        path: path.join(__dirname,'./public/dist')
    },
    // utilizamos módulos de babel
    module: {
        rules:[
            {
                // para js
                // va a ir en el Entrypoint y buscar archivos js
                test: /\.m?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}