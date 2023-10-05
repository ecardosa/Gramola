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



document.querySelectorAll(".canço").forEach(canço => {
    todasCanciones.push(canço.getAttribute("url"));
    nombrecancion.push(canço.getAttribute("titulo"));
});



function sonar(url = todasCanciones[cancionactual], nomtitol) {
   
    cancionactual = todasCanciones.indexOf(url);
    nomtitol = nombrecancion[cancionactual];
    document.getElementById("nomtitol").innerHTML = nomtitol;
   
    if (audio === undefined){
        audio = new Audio();
    }

    
    audio.src = url;
    audio.currentTime = 0;
    audio.play();
    document.getElementById('playButtonImage').src = 'fotos/pausa.png';



    audio.addEventListener('loadedmetadata', function() {
    barraProgreso.max = audio.duration;
    tiempoTotal.textContent = formatTime(audio.duration);

    var duracionElement = document.getElementById('duracion-cancion');
    if (duracionElement) {
        duracionElement.textContent = formatTime(audio.duration);
    }
  
});
    audio.addEventListener('timeupdate', function() {
        barraProgreso.value = audio.currentTime;
        tiempoActual.textContent = formatTime(audio.currentTime);
        
    });

    audio.addEventListener('ended', function () {
        siguiente(todasCanciones.length - 1);
    });
   
}



function pausar() {
    if (audio.paused) {
        audio.play();
        pausaplaying = true;
        document.getElementById('playButtonImage').src = 'fotos/pausa.png';
       
    }else{
        audio.pause();
        playing = false;
        document.getElementById('playButtonImage').src = 'fotos/play.png';

    }
   
}

function parar() {
    if (audio) {
    audio.currentTime = 0;
    audio.pause();
     playing = false;
     document.getElementById('playButtonImage').src = 'fotos/play.png';

 }
}

function siguiente(max) {   
  
    cancionactual++;
    if (cancionactual > max) {
        cancionactual = 0;
    } else{
    }
    sonar(todasCanciones[cancionactual]);
}


function anterior(max) {
    cancionactual--;
    if (cancionactual < 0) {
        cancionactual = max;
    }else {
    }
    sonar();
}

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = Math.floor(seconds % 60);
    return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

barraProgreso.addEventListener('click', function(event) {
    var newPosition = event.offsetX / barraProgreso.offsetWidth;
    audio.currentTime = newPosition * audio.duration;
});



function seleccionarCancionAleatoria() {
    const playlist = todasCanciones; 
    const indiceAleatorio = Math.floor(Math.random() * playlist.length);
    return playlist[indiceAleatorio];
}

const randomButton = document.querySelector('button[type="random"]');
randomButton.addEventListener('click', function () {
    const cancionAleatoria = seleccionarCancionAleatoria();
    sonar(cancionAleatoria);
});

document.getElementById("irAPagina2").addEventListener("click", function() {
    window.location.href = "gramola2.php";

});

function toggleContenido(elemento) {
    const contenido = elemento.nextElementSibling;
    if (contenido.style.display === 'none' || contenido.style.display === '') {
        contenido.style.display = 'block';
    } else {
        contenido.style.display = 'none';
    }
}
const volumen = document.getElementById('volumen');
volumen.addEventListener("click", function() {
    mostrarBarraVolumen();
});

function mostrarBarraVolumen() {
    const barraVolumen = document.getElementById('barraVolumen');
    if (barraVolumen.style.display === "block") {
        barraVolumen.style.display = "none";
    } else {
        barraVolumen.style.display = "block";
    }
}

const barraVolumen = document.getElementById('barraVolumen');
barraVolumen.addEventListener('input', function() {
    const volumen = barraVolumen.value / 100;
    audio.volume = volumen;
});

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

