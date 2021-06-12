import Swal from 'sweetalert2';
import axios from 'axios';
import { defaults } from 'slug';

const btnEliminar = document.querySelector('#eliminar-proyecto');
if(btnEliminar){
    btnEliminar.addEventListener('click', e =>{
        const urlProyecto = e.target.dataset.proyectoUrl;
        // Ya tengo acceso a los datos de la base
        //console.log(urlProyecto);

      

        Swal.fire({
            title: 'Desea eliminar el proyecto?',
            text: "Una vez eliminado el proyecto no se podrá recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Enviar petición a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                axios.delete(url, { params: {urlProyecto}})
                    .then(function(respuesta){
                        console.log(respuesta);
                        
                            Swal.fire(
                                'Proyecto Eliminado!',
                                respuesta.data,
                                'success'
                            );
                            
                            //redireccionar al inicio
                            setTimeout(() => {
                                window.location.href = '/'
                            }, 2000);
                        })
                        .catch(() => {
                            Swal.fire({
                                icon: 'error',
                                //type: 'error',
                                title: 'Ocurrió un error',
                                text: 'No se ha podido eliminar el Proyecto' 
                            })
                        })
            }
        });
    })
}
export default btnEliminar;