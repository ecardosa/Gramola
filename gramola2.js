// Carga y decodifica el JSON
fetch('canciones.json')
  .then(response => response.json())
  .then(data => {
    // Asigna las playlists desde el JSON a nombresPlaylist
    nombresPlaylist = data.playlists;
  })
  .catch(error => console.error('Error cargando el JSON:', error));

// Declaración de variables
var audio;
var cancionactual = 0;
var playing = false;
var cancionesPlaylist = null;
var todasCanciones = [];
var fotocancion = [];
var nombrecancion = [];
var nombresPlaylist = [];
// Selección de elementos HTML por ID
var barraProgreso = document.getElementById('barraProgreso');
var tiempoActual = document.getElementById('tiempoActual');
var tiempoTotal = document.getElementById('tiempoTotal');
var tiempoTotal2 = document.getElementById('tiempoTotal2');

// Evento para cargar la canción al hacer clic en un botón de reproducción
document.querySelectorAll(".canço").forEach(canço => {
    // Almacena las URL, fotos y nombres de las canciones
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

// Función para cargar y reproducir una canción
function sonar(url = todasCanciones[cancionactual], nomtitol, cancionesPl) {
    
    // Verifica si se proporciona un objeto de cancionesPl (canciones de una playlist)
    if (cancionesPl) {
        // Parsea el objeto JSON y almacena la información en la variable cancionesPlaylist
        cancionesPlaylist = JSON.parse(cancionesPl);
        console.log(cancionesPlaylist.map(cancion => parseInt(cancion.id)));
    }

     // Obtén el nombre de la playlist de la canción actual
    const playlistActual = obtenerNombrePlaylist(url);

    // Guardar la última playlist y la fecha en una cookie
    const fechaEscucha = new Date().toUTCString();
    document.cookie = `lastPlaylist=${playlistActual}; expires=${fechaEscucha}; path=/`;

    // Obtiene el índice de la canción actual en el arreglo todasCanciones
    cancionactual = todasCanciones.indexOf(url);

    // Obtiene la URL de la portada de la canción actual
    coverUrl = fotocancion[cancionactual];

    // Obtiene el nombre de la canción actual
    nomtitol = nombrecancion[cancionactual];

    // Actualiza el título de la canción en la página web
    document.getElementById("nomtitol").innerHTML = nomtitol;

    // Crea un nuevo objeto de audio si aún no existe
    if (audio === undefined) {
        audio = new Audio();
    }
    
    // Carga la canción y la reproduce
    audio.src = url;
    audio.currentTime = 0;
    audio.play();
    // Cambia la imagen del botón de reproducción a "pausa"
    document.getElementById('playButtonImage').src = 'fotos/pausa.png';

    audio.addEventListener('loadedmetadata', function () {
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

    // Evento que se dispara durante la reproducción para actualizar la barra de progreso y el tiempo actual
    audio.addEventListener('timeupdate', function () {
        barraProgreso.value = audio.currentTime;
        tiempoActual.textContent = formatTime(audio.currentTime);

    });

    // Evento que se dispara cuando la portada de la canción se ha cargado
    const coverImage = document.getElementById('coverImage');
    coverImage.addEventListener('load', function () {
        // Establece la imagen de fondo del elemento con la portada
        document.getElementById('coverImage').style.backgroundImage = 'url(' + coverUrl + ')';
    });
    coverImage.src = coverUrl;

    // Evento que se dispara cuando la canción ha terminado, lo que provoca que pase a la siguiente canción
    audio.addEventListener('ended', function () {
        siguiente();
    });

   // Inicia la animación de las líneas negras
    iniciarAnimacion();

    // Actualiza la información de la última playlist
    actualizarInfoDiv(playlistActual, fechaEscucha);
}

// Función para pausar o reanudar la canción
function pausar() {
    // Verificar si el audio está en pausa
    if (audio.paused) {
        // Reanuda la canción
        audio.play();
        pausaplaying = true; // Establece la variable pausaplaying en verdadero
        document.getElementById('playButtonImage').src = 'fotos/pausa.png'; // Cambia la imagen del botón de reproducción a "pausa"
        iniciarAnimacion(); // Inicia la animación de las líneas negras

    } else {
        // Pausa la canción
        audio.pause();
        playing = false; // Establece la variable playing en falso
        document.getElementById('playButtonImage').src = 'fotos/play.png'; // Cambia la imagen del botón de reproducción a "reproducir"
        // Detener la animación de las líneas negras
        lines.forEach((line) => {
            line.style.animationName = 'none';
        });
    }  
}

// Función para detener la canción
 function parar() {
        if (audio) {
        audio.currentTime = 0; // Establece el tiempo actual de la canción en 0
        audio.pause(); // Pausa la canción
         playing = false;   // Establece la variable playing en falso
         document.getElementById('playButtonImage').src = 'fotos/play.png'; // Cambia la imagen del botón de reproducción a "reproducir"
        // Detener la animación de las líneas negras
         lines.forEach((line) => {
            line.style.animationName = 'none';
        });
     }
 }

// Función para saltar la siguiente canción
function siguiente(max) {
    if (cancionesPlaylist == null) {
        // Si no se está reproduciendo una playlist específica
        cancionactual++; // Incrementa el índice de la canción actual
        if (cancionactual > max) {
            cancionactual = 0; // Si el índice de la canción actual es mayor que el número máximo de canciones, establece el índice de la canción actual en 0
        }
    } else {
        // Si se está reproduciendo una playlist específica
        console.log(cancionactual)
        cancionactual = cancionesPlaylist.map(cancion => parseInt(cancion.id))[(cancionesPlaylist.map(cancion => parseInt(cancion.id)).indexOf(cancionactual)+1) % cancionesPlaylist.length];
        // Obtener el siguiente índice de canción dentro de la playlist
    }
    // reproducir la siguiente canción
    sonar(todasCanciones[cancionactual], undefined, JSON.stringify(cancionesPlaylist));
}

// Función para saltar a la canción anterior
function anterior(max) {
   if (cancionesPlaylist == null){
    // Si no se está reproduciendo una playlist específica
    cancionactual--; // Decrementa el índice de la canción actual
    if (cancionactual < 0) {
        cancionactual = max; // Si el índice de la canción actual es menor que 0, establece el índice de la canción actual en el número máximo de canciones
    }
   } else {
    // Si se está reproduciendo una playlist específica
    cancionactual = cancionesPlaylist.map(cancion => parseInt(cancion.id))[(cancionesPlaylist.map(cancion => parseInt(cancion.id)).indexOf(cancionactual)-1) % cancionesPlaylist.length];
    // Obtener el índice de canción anterior dentro de la playlist
}

// Asegúrate de que cancionesPlaylist y todasCanciones sean válidos
if (cancionesPlaylist && todasCanciones[cancionactual]) {
    // Reproduce la canción anterior
    sonar(todasCanciones[cancionactual], undefined, JSON.stringify(cancionesPlaylist));
} 
}

// Función para formatear el tiempo en segundos a formato 'mm:ss'
function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = Math.floor(seconds % 60);
    return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

// Agregar un evento de clic a la barra de progreso para saltar a una posición de reproducción específica
barraProgreso.addEventListener('click', function (event) {
    var newPosition = event.offsetX / barraProgreso.offsetWidth;
    audio.currentTime = newPosition * audio.duration;
});

// Función para seleccionar una canción aleatoria de la lista de reproducción
function seleccionarCancionAleatoria() {
    const playlist = todasCanciones;
    const indiceAleatorio = Math.floor(Math.random() * playlist.length);
    return playlist[indiceAleatorio];
}

// Obtener el botón "Reproducir canción aleatoria" y agregar un evento de clic
const randomButton = document.querySelector('button[type="random"]');
randomButton.addEventListener('click', function () {
    // Seleccionar una canción aleatoria y comenzar a reproducirla
    const cancionAleatoria = seleccionarCancionAleatoria();
    sonar(cancionAleatoria);
});

// Función para alternar la visibilidad del contenido (desplegable) de una playlist
function toggleContenido(elemento) {
    const contenido = elemento.nextElementSibling;
    if (contenido.style.display === 'none' || contenido.style.display === '') {
        contenido.style.display = 'block'; // Mostrar contenido

    } else {
        contenido.style.display = 'none'; // Ocultar contenido
    }
}

// Obtener el elemento de volumen y agregar un evento de clic para mostrar/ocultar la barra de volumen
const volumen = document.getElementById('volumen');
volumen.addEventListener("click", function () {
    mostrarBarraVolumen();
});

// Función para mostrar/ocultar la barra de volumen
function mostrarBarraVolumen() {
    const barraVolumen = document.getElementById('barraVolumen');
    if (barraVolumen.style.display === "block") {
        barraVolumen.style.display = "none"; // Ocultar barra de volumen
    } else {
        barraVolumen.style.display = "block"; // Mostrar barra de volumen
    }
}

// Obtener la barra de volumen y agregar un evento de entrada para ajustar el volumen del audio
const barraVolumen = document.getElementById('barraVolumen');
barraVolumen.addEventListener('input', function () {
    const volumen = barraVolumen.value / 100;
    audio.volume = volumen; // Establecer el volumen del audio
});

// Obtener el campo de entrada de búsqueda de playlist
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

// Obtener el elemento de reproducción y agregar un evento de clic para reproducir/pausar la canción
const playingElement = document.querySelector('.playing');
const lines = document.querySelectorAll('.greenline');

// Función para iniciar la animación
function iniciarAnimacion() {
    lines.forEach((line) => {
        const randomDelay = Math.random() * 2; // Ajusta el rango de retraso según tus necesidades
        line.style.animationDelay = `${randomDelay}s`; // Establece el retraso de la animación
        line.style.animationName = 'animacion-movimiento';  // Aplicar la animación de movimiento
    });
}

// Función para detener la animación    
function detenerAnimacion() {
    playingElement.classList.remove('animacion-activa'); // Elimina la clase de animación activa
}

// Iterar sobre las cabeceras de las playlists para obtener los nombres y almacenarlos en el array 'nombresPlaylist'
document.querySelectorAll('.cabecera').forEach(cabecera => {
    var nombrePlaylist = cabecera.textContent.trim(); // Obtén el contenido de texto y quita los espacios en blanco al principio y al final
    if (nombrePlaylist) {
        nombresPlaylist.push(nombrePlaylist); // Agrega el nombre de la playlist al array
    }
});

// Ahora, el array nombresPlaylist contendrá los nombres de las playlists
console.log(nombresPlaylist);


// Obtener el elemento de información y actualizarlo con la última playlist y la fecha de escucha
document.querySelectorAll(".canço").forEach(canço => {
    todasCanciones.push(canço.getAttribute("url")); // Almacena las URL, fotos y nombres de las canciones
    fotocancion.push(canço.getAttribute("cover")); // Almacena las URL, fotos y nombres de las canciones
    nombrecancion.push(canço.getAttribute("titulo")); // Almacena las URL, fotos y nombres de las canciones
});

// Función para actualizar la información en el elemento 'infoDiv
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

// Función para obtener el nombre de la playlist a partir de la URL de la canción
function obtenerNombrePlaylist(url) {
    for (const playlist of nombresPlaylist) {
        for (const cancion of playlist.canciones) {
            if (cancion.url === url) {
                return playlist.nombre; // Devuelve el nombre de la playlist
            }
        }
    }
    return "N/A"; // Si no se encuentra la playlist, usar "N/A"
}