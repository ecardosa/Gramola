// Carga y decodifica el JSON
fetch('canciones.json')
  .then(response => response.json())
  .then(data => {
    // Asigna las playlists desde el JSON a nombresPlaylist
    nombresPlaylist = data.playlists;
  })
  .catch(error => console.error('Error cargando el JSON:', error));

var audio;
var cancionactual = 0;
var playing = false;
var cancionesPlaylist = null;
var todasCanciones = [];
var fotocancion = [];
var nombrecancion = [];
var nombresPlaylist = [];
var barraProgreso = document.getElementById('barraProgreso');
var tiempoActual = document.getElementById('tiempoActual');
var tiempoTotal = document.getElementById('tiempoTotal');
var tiempoTotal2 = document.getElementById('tiempoTotal2');

document.querySelectorAll(".canço").forEach(canço => {
    todasCanciones.push(canço.getAttribute("url"));
    fotocancion.push(canço.getAttribute("cover"));
    nombrecancion.push(canço.getAttribute("titulo"));

});

function UnaC (hola) {
    if (audio === undefined) {
        audio = new Audio();
    }
    audio.src = hola;
};

function sonar(url = todasCanciones[cancionactual], nomtitol, cancionesPl) {

    if (cancionesPl) {
        cancionesPlaylist = JSON.parse(cancionesPl);
        console.log(cancionesPlaylist.map(cancion => parseInt(cancion.id)));
    }
        // Obtén el nombre de la playlist de la canción actual
        const playlistActual = obtenerNombrePlaylist(url);

        // Guardar la última playlist y la fecha en una cookie
        const fechaEscucha = new Date().toUTCString();
        document.cookie = `lastPlaylist=${playlistActual}; expires=${fechaEscucha}; path=/`;

    // Función para obtener el nombre de la playlist a partir de sus datos

    cancionactual = todasCanciones.indexOf(url);
    coverUrl = fotocancion[cancionactual];

    nomtitol = nombrecancion[cancionactual];

    document.getElementById("nomtitol").innerHTML = nomtitol;
    if (audio === undefined) {
        audio = new Audio();
    }
    

    audio.src = url;
    audio.currentTime = 0;
    audio.play();
    document.getElementById('playButtonImage').src = 'fotos/pausa.png';



    audio.addEventListener('loadedmetadata', function () {
        barraProgreso.max = audio.duration;
        tiempoTotal.textContent = formatTime(audio.duration);

        var duracionElement = document.getElementById('duracion-cancion');
        if (duracionElement) {
            duracionElement.textContent = formatTime(audio.duration);
        }

    });
    audio.addEventListener('timeupdate', function () {
        barraProgreso.value = audio.currentTime;
        tiempoActual.textContent = formatTime(audio.currentTime);

    });

    const coverImage = document.getElementById('coverImage');
    coverImage.addEventListener('load', function () {
        document.getElementById('coverImage').style.backgroundImage = 'url(' + coverUrl + ')';
    });
    coverImage.src = coverUrl;

    audio.addEventListener('ended', function () {
        siguiente();
    });

   
    iniciarAnimacion();
    actualizarInfoDiv(playlistActual, fechaEscucha);


}





function pausar() {
    if (audio.paused) {
        audio.play();
        pausaplaying = true;
        document.getElementById('playButtonImage').src = 'fotos/pausa.png';
        iniciarAnimacion();

    } else {
        audio.pause();
        playing = false;
        document.getElementById('playButtonImage').src = 'fotos/play.png';
        lines.forEach((line) => {
            line.style.animationName = 'none';
        });
    }
    
}
 function parar() {
        if (audio) {
        audio.currentTime = 0;
        audio.pause();
         playing = false;
         document.getElementById('playButtonImage').src = 'fotos/play.png';
         lines.forEach((line) => {
            line.style.animationName = 'none';
        });
     }
 }
function siguiente(max) {
    if (cancionesPlaylist == null) {
        console.log("aaa")
        cancionactual++;
        if (cancionactual > max) {
            cancionactual = 0;
        }
    } else {
        console.log("bbb")
        console.log(cancionactual)
        cancionactual = cancionesPlaylist.map(cancion => parseInt(cancion.id))[(cancionesPlaylist.map(cancion => parseInt(cancion.id)).indexOf(cancionactual)+1) % cancionesPlaylist.length];

    
    }

    sonar(todasCanciones[cancionactual], undefined, JSON.stringify(cancionesPlaylist));
}


function anterior(max) {
   if (cancionesPlaylist == null){
    cancionactual--;
    if (cancionactual < 0) {
        cancionactual = max;
    }
   } else {
    console.log("ccc")
    cancionactual = cancionesPlaylist.map(cancion => parseInt(cancion.id))[(cancionesPlaylist.map(cancion => parseInt(cancion.id)).indexOf(cancionactual)-1) % cancionesPlaylist.length];
}

// Asegúrate de que cancionesPlaylist y todasCanciones sean válidos
if (cancionesPlaylist && todasCanciones[cancionactual]) {
    sonar(todasCanciones[cancionactual], undefined, JSON.stringify(cancionesPlaylist));
} 
}

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = Math.floor(seconds % 60);
    return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

barraProgreso.addEventListener('click', function (event) {
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

function toggleContenido(elemento) {
    const contenido = elemento.nextElementSibling;
    if (contenido.style.display === 'none' || contenido.style.display === '') {
        contenido.style.display = 'block';

    } else {
        contenido.style.display = 'none';
    }


}

const volumen = document.getElementById('volumen');
volumen.addEventListener("click", function () {
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
barraVolumen.addEventListener('input', function () {
    const volumen = barraVolumen.value / 100;
    audio.volume = volumen;
});
const searchInput = document.getElementById('searchPlaylistInput');

// Agrega un evento de escucha al campo de entrada de búsqueda
searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase(); // Obtén el término de búsqueda en minúsculas

    // Obtén todas las cabeceras de las playlists
    const playlistHeaders = document.querySelectorAll('.cabecera');

    // Itera sobre las cabeceras de las playlists para mostrar/ocultar según el término de búsqueda
    playlistHeaders.forEach(header => {
        const playlistName = header.textContent.toLowerCase(); // Obtén el nombre de la playlist en minúsculas

        // Comprueba si el término de búsqueda está contenido en el nombre de la playlist
        if (playlistName.includes(searchTerm)) {
            header.style.display = 'block'; // Muestra la cabecera
        } else {
            header.style.display = 'none'; // Oculta la cabecera
        }
    });
});
const playingElement = document.querySelector('.playing');

const lines = document.querySelectorAll('.greenline');

function iniciarAnimacion() {
    lines.forEach((line) => {
        const randomDelay = Math.random() * 2; // Ajusta el rango de retraso según tus necesidades
        line.style.animationDelay = `${randomDelay}s`;
        line.style.animationName = 'animacion-movimiento';
    });
}

function detenerAnimacion() {
    playingElement.classList.remove('animacion-activa');
}

document.querySelectorAll('.cabecera').forEach(cabecera => {
    var nombrePlaylist = cabecera.textContent.trim(); // Obtén el contenido de texto y quita los espacios en blanco al principio y al final
    if (nombrePlaylist) {
        nombresPlaylist.push(nombrePlaylist);
    }
});

// Ahora, el array nombresPlaylist contendrá los nombres de las playlists
console.log(nombresPlaylist);

document.querySelectorAll(".canço").forEach(canço => {
    todasCanciones.push(canço.getAttribute("url"));
    fotocancion.push(canço.getAttribute("cover"));
    nombrecancion.push(canço.getAttribute("titulo"));
});

function actualizarInfoDiv(playlistActual, fechaEscucha) {
    const infoDiv = document.getElementById('info');

    if (playlistActual !== "N/A") {
        infoDiv.innerHTML = `
            <div class="lastplaylist">Última playlist: ${playlistActual}</div>
            <div class="lastplaylisttime">Fecha de escucha: ${fechaEscucha}</div>
        `;
    } else {
        infoDiv.innerHTML = `
            <div class="lastplaylist">No se ha escuchado ninguna playlist recientemente.</div>
            <div class="lastplaylisttime"></div>
        `;
    }
}
function obtenerNombrePlaylist(url) {
    for (const playlist of nombresPlaylist) {
        for (const cancion of playlist.canciones) {
            if (cancion.url === url) {
                return playlist.nombre;
            }
        }
    }
    return "N/A"; // Si no se encuentra la playlist, usar "N/A"
}