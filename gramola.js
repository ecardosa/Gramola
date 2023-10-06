// Declaración de variables
var audio;
var cancionactual = 0;
var playing = false;
var todasCanciones = [];
var fotocancion = [];
var nombrecancion = [];
var barraProgreso = document.getElementById('barraProgreso');
var tiempoActual = document.getElementById('tiempoActual');
var tiempoTotal = document.getElementById('tiempoTotal' );
var tiempoTotal2 = document.getElementById('tiempoTotal2' );


// Recopilación de URLs y nombres de canciones desde elementos HTML con la clase "canço"
document.querySelectorAll(".canço").forEach(canço => {
    todasCanciones.push(canço.getAttribute("url"));
    nombrecancion.push(canço.getAttribute("titulo"));
});


// Función para cargar y reproducir una canción
function sonar(url = todasCanciones[cancionactual], nomtitol) {
   
    // Actualiza la variable cancionactual con el índice de la canción actual
    cancionactual = todasCanciones.indexOf(url);
    // Obtiene el nombre de la canción actual
    nomtitol = nombrecancion[cancionactual];
    // Actualiza el título de la canción en la página web
    document.getElementById("nomtitol").innerHTML = nomtitol;
   
    // Crea un nuevo objeto de audio si aún no existe
    if (audio === undefined){
        audio = new Audio();
    }

    // Carga la canción y la reproduce
    audio.src = url;
    audio.currentTime = 0;
    audio.play();
    // Cambia la imagen del botón de reproducción a "pausa"
    document.getElementById('playButtonImage').src = 'fotos/pausa.png';


    audio.addEventListener('loadedmetadata', function() {
    // Configura el valor máximo de la barra de progreso como la duración de la canción
    barraProgreso.max = audio.duration;
    // Actualiza el tiempo total de la canción en la página
    tiempoTotal.textContent = formatTime(audio.duration);

    // Actualiza el tiempo de duración de la canción en algún elemento HTML (si existe)
    var duracionElement = document.getElementById('duracion-cancion');
    if (duracionElement) {
        duracionElement.textContent = formatTime(audio.duration);
    }
  
});
    audio.addEventListener('timeupdate', function() {
        barraProgreso.value = audio.currentTime;
        tiempoActual.textContent = formatTime(audio.currentTime);
        
    });
    //Cuando termina la canción, pasa a la siguiente
    audio.addEventListener('ended', function () {
        siguiente();
    });
   
}

// Función para pausar o reanudar la canción
function pausar() {
    // Verificar si el audio está en pausa
    if (audio.paused) {
        audio.play();
        pausaplaying = true; // Establece la variable pausaplaying en verdadero
        document.getElementById('playButtonImage').src = 'fotos/pausa.png';// Cambia la imagen del botón de reproducción a "pausa"
       
    }else{
        // Pausa la canción
        audio.pause();
        playing = false; // Establece la variable playing en falso
        document.getElementById('playButtonImage').src = 'fotos/play.png'; // Cambia la imagen del botón de reproducción a "play"

    }
   
}

// Función para detener la canción
function parar() {
    if (audio) {
    audio.currentTime = 0;  // Establece el tiempo de reproducción en 0
    audio.pause(); // Pausa la canción
     playing = false; // Establece la variable playing en falso
     document.getElementById('playButtonImage').src = 'fotos/play.png'; // Cambia la imagen del botón de reproducción a "play"

 }
}

// Función para saltar a una posición específica de la canción
function siguiente(max) {   
    cancionactual++; // Incrementa el índice de la canción actual
    if (cancionactual > max) { // Si el índice de la canción actual es mayor que el número máximo de canciones
        cancionactual = 0; // Establece el índice de la canción actual en 0
    } else{
    }
    // reproducir la siguiente canción
    sonar(todasCanciones[cancionactual]);
}


// Función para saltar a una posición específica de la canción
function anterior(max) {
    cancionactual--; // Decrementa el índice de la canción actual
    if (cancionactual < 0) { // Si el índice de la canción actual es menor que 0
        cancionactual = max; // Establece el índice de la canción actual en el número máximo de canciones
    }else {
    }
    // Reproduce la canción anterior
    sonar();
}

// Función para formatear el tiempo en segundos a formato 'mm:ss'
function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = Math.floor(seconds % 60);
    return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

// Función para saltar a una posición específica de la canción
barraProgreso.addEventListener('click', function(event) {
    var newPosition = event.offsetX / barraProgreso.offsetWidth;
    audio.currentTime = newPosition * audio.duration;
});

// Función para seleccionar una canción aleatoria de la lista de reproducción
function seleccionarCancionAleatoria() {
    const playlist = todasCanciones; 
    const indiceAleatorio = Math.floor(Math.random() * playlist.length);
    return playlist[indiceAleatorio];
}

// Selecciona un botón en el documento HTML que tenga el atributo 'type' igual a 'random'.
const randomButton = document.querySelector('button[type="random"]'); 
randomButton.addEventListener('click', function () { 
    // Llama a la función 'seleccionarCancionAleatoria()' para obtener una canción aleatoria.
    const cancionAleatoria = seleccionarCancionAleatoria(); 
     // Llama a la función 'sonar()' y le pasa la canción aleatoria como argumento.
    sonar(cancionAleatoria);
});

// Per anar a un altre pagina php
document.getElementById("irAPagina2").addEventListener("click", function() {
    window.location.href = "gramola2.php";

});


// function toggleContenido(elemento) {
//     const contenido = elemento.nextElementSibling;
//     if (contenido.style.display === 'none' || contenido.style.display === '') {
//         contenido.style.display = 'block';
//     } else {
//         contenido.style.display = 'none';
//     }
// }

// 

// Obtener el elemento de volumen y agregar un evento de clic para mostrar/ocultar la barra de volumen
const volumen = document.getElementById('volumen');
volumen.addEventListener("click", function() {
    mostrarBarraVolumen();
});

// Función para mostrar/ocultar la barra de volumen
function mostrarBarraVolumen() {
    const barraVolumen = document.getElementById('barraVolumen');
    if (barraVolumen.style.display === "block") {
        barraVolumen.style.display = "none";  // Ocultar barra de volumen
    } else {
        barraVolumen.style.display = "block"; // Mostrar barra de volumen
    }
}

// Obtener la barra de volumen y agregar un evento de entrada para ajustar el volumen del audio
const barraVolumen = document.getElementById('barraVolumen');
barraVolumen.addEventListener('input', function() {
    const volumen = barraVolumen.value / 100;
    audio.volume = volumen; // Establecer el volumen del audio
});

// Obtener el campo de entrada de búsqueda de playlist
const sendButton = document.getElementById('send-button');

// Agrega un evento de clic al botón SEND
sendButton.addEventListener('click', function (e) {
  e.preventDefault(); // Evita que el enlace navegue a una nueva página
  
  // Obtiene una referencia a la caja de inicio de sesión
  const loginBox = document.querySelector('.login-box');
  
  // Agrega la clase "hidden" para ocultar la caja de inicio de sesión
  loginBox.classList.add('hidden');
});


document.querySelectorAll(".canço").forEach(canço => {
    todasCanciones.push(canço.getAttribute("url"));
    fotocancion.push(canço.getAttribute("cover"));
    nombrecancion.push(canço.getAttribute("titulo"));
});

