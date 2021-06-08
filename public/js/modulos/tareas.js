import axios from "axios";
import Swal from "sweetalert2";

import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');
if(tareas){

    tareas.addEventListener('click',e => {
        if(e.target.classList.contains('fa-check-circle')){
           // luego necesitamos saber el id de la tarea
           const icono = e.target;
           const tareaId= icono.parentElement.parentElement.dataset.tarea;
 
           // Request hacia /tareas/:id
            const url = `${location.origin}/tareas/${tareaId}`;
 
            axios.patch(url,{ tareaId })
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                });
        }

        if(e.target.classList.contains('fa-trash')){
           
            // Traemos el html de la tarea
            const tareaHTML = e.target.parentElement.parentElement,
                  tareaId = tareaHTML.dataset.tarea;  
            Swal.fire({
                title: 'Desea eliminar la Tarea?',
                text: "Una vez eliminada la Tarea NO se podrá recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Eliminar',
                cancelButtonText: 'No, Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                   //console.log('Eliminado...');   
                   const url = `${location.origin}/tareas/${tareaId}`;
 
                   // Enviar el delete por medio de axios
                   axios.delete(url, {params: { tareaId }})
                    .then(function(respuesta){
                        //console.log(respuesta);
                        if(respuesta.status === 200){
                            // Eliminar Nodo
                            tareaHTML.parentElement.removeChild(tareaHTML);

                            // Opcional un alerta
                            Swal.fire(
                                'Tarea Eliminada',
                                respuesta.data,
                                'success'
                            )
                            actualizarAvance();
                        }
                    })
                }
            })       
        }
    });
}

export default tareas;