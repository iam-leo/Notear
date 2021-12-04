//Variables
const form = document.querySelector('#formulario');
const listaNotas = document.querySelector('#lista-notas');

let notas = [];

//EventListeners
eventListeners();
function eventListeners(){
    //Cuando el usuario agrega una nota.
    form.addEventListener('submit', agregarNota);

    //Cuando el documento esta listo
    document.addEventListener('DOMContentLoaded', () => {
        notas = JSON.parse(localStorage.getItem('notas')) || [];
        crearHTML();
    })

}

//Funciones
function agregarNota(e){
    e.preventDefault();
    const nota = document.querySelector('#nota').value;

    if( nota === '' ){
        mostrarError('No puedes agregar una nota vacía');
        return;
    }

    const notaObj = {
        id: Date.now(),
        // nota: nota  //cuando llave y variable tienen el mismo nombre se puede colocar solo una vez y js lo tomará como llave y valor
        nota
    }
    notas = [...notas, notaObj];
    crearHTML();
    agregarAnimacion();
    form.reset();
}

//Mostrar errores
function mostrarError(error){
    const mensajeError = document.createElement('p');
    mensajeError.textContent = error;
    mensajeError.classList.add('error');
    form.appendChild(mensajeError, form.lastChild);

    //Eliminar mensaje de error despues de 3s
    setTimeout(()=>{
        mensajeError.remove();
    }, 3000);
}

//Mostrar listado de notas
function crearHTML(){
    limpiarHtml();

    if(notas.length > 0){
        notas.forEach( nota => {
            //Crear Boton de eliminar
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-nota');
            btnEliminar.innerHTML = '<i class="fas fa-trash-alt"></i>';

            btnEliminar.onclick = () => {
                borrarNota( nota.id );
            }

            //Crear HTML
            const li = document.createElement('li');
            li.classList.add('animate__animated', 'animate__fast');
            //Añadir el texto y boton
            li.innerText = nota.nota;
            li.appendChild(btnEliminar);

            //Insertar en el HTML
            listaNotas.appendChild(li);
        });

        if(notas.length > 1 && listaNotas.lastChild.getAttribute('id') !== 'btnBorrarTodo'){
        const btnEliminarTodo = document.createElement('a');
        btnEliminarTodo.setAttribute('id','btnBorrarTodo');
        btnEliminarTodo.classList.add('borrar-todo-btn','animate__animated', 'animate__fast');
        btnEliminarTodo.textContent = 'Borrar todo';
        listaNotas.appendChild(btnEliminarTodo);

        btnEliminarTodo.onclick = () => {
            borrarTodo();
        }
        }

    }

    sincronizarStorage();
}
//Animacion de los li y el boton borrar todo
function agregarAnimacion() {
    const notasAgregadas = document.querySelectorAll('.animate__animated');
    notasAgregadas.forEach( li => {
        li.classList.remove('animate__fadeIn');
    });
    if( notasAgregadas.length > 1){
        notasAgregadas[notasAgregadas.length - 2].classList.add('animate__fadeIn'); //Agregar la clase fadeIn a la ultima nota agregada
        listaNotas.lastChild.classList.add('animate__fadeIn'); //Agregar la clase fadeIn al boton borrar todo
        if( notasAgregadas.length > 3){
            //Quitar clase fadeIn al boton cuando hay mas de 2 notas en la lista para evitar parpadeo del boton borrar todo
            listaNotas.lastChild.classList.remove('animate__fadeIn');
        }
    } else{
        //agregar clase fadeIn a la primera nota agregada
        notasAgregadas[notasAgregadas.length - 1].classList.add('animate__fadeIn');
    }
}

//Agregar notas actuales al localStorage
function sincronizarStorage(){
    localStorage.setItem('notas', JSON.stringify( notas ) );
}

function borrarNota( id ){
    notas = notas.filter( nota => nota.id !== id );
    crearHTML();
}

function limpiarHtml() {
    while(listaNotas.firstChild){
        listaNotas.removeChild(listaNotas.firstChild);
    }
}

function borrarTodo(){
    notas = [];
    crearHTML();
}

