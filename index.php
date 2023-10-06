<?php
    // Iniciar la sesión
    session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="gramola.css">
    <title>Gramola</title>
    <script src="gramola.js" defer></script>
    <script src="comun.js" defer></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400&family=Mukta&family=PT+Sans+Caption:wght@400;700&display=swap" rel="stylesheet">
</head>
    <body>
        <?php
            // Verificar si el formulario ha sido enviado
            if (isset($_POST['username'])) {
                // Obtener el nombre de usuario del formulario
                $nombre = $_POST['username'];

                // Guardar el nombre en la sesión
                $_SESSION['USUARIO'] = $nombre;

            }
        ?>

        <div class="login-box" style="display: 
            <?php 
                // Si el usuario ha iniciado sesión, ocultar el formulario de inicio de sesión
                if (isset($_SESSION['USUARIO'])) {
                    echo "none";
                } else {         
                    // Si el usuario no ha iniciado sesión, mostrar el formulario de inicio de sesión
                    echo "block";
                }
            ?>">
        <form  action="/" method="POST">
            <div class="user-box">
                <!-- Campo para ingresar el nombre -->
                <input type="text" name="username" id="username" required>
                <label for="username" required>Nombre</label>
                <br>
            </div>
            <div class="user-box">
                <!-- Campo para ingresar el apellido -->
                <input type="text" name="apellido" required="">
                <label>Apellido</label>
            </div>
            <!-- Botón para enviar el formulario -->
            <button id="submit" class="submit" type="submit">Enviar</button>
        </form>
    </div>
        <div class="container">
            <div class="plantilla">
                <header class="arriba">
                    <!-- Imagen de perfil del usuario -->
                    <img class="fotoperfil" src="fotos/usuario.png" alt="Foto de perfil">
                        <div class="usuario">
                            <?php 
                                if (isset($_POST['username'])) {
                                    // Obtener el nombre de usuario del formulario
                                    $nombre = $_POST['username'];
                                    // Guardar el nombre de usuario en la sesión
                                    $_SESSION['usuario'] = $nombre;
                                    // Comprobar si el usuario ha iniciado sesió
                                } if (isset($_SESSION['usuario'])) {
                                    // Mostrar un saludo al usuario
                                    echo "<h1 id='nomusuari'>Hola, ". $_SESSION['usuario']. "</h1>";
                                }
                            ?>
                            <!-- Botón para ir a la página de "Les meves playlists" -->
                            <button type="playl" id="irAPagina2">
                                <p> 
                                    Les meves playlists
                                </p>
                            </button>
                        </div>  
                </header>
                <main class="abajo_izq">
                    <h4>Cançons</h4>
                    <div class="canciones">
                        <?php
                            // Leer el contenido del archivo canciones.json y decodificarlo como un array asociativo
                            $songs = file_get_contents("canciones.json");
                            $songs = json_decode($songs, true);
                            // Obtener la lista de canciones del array
                            $can = $songs["songs"];
                        ?>
                        <?php
                            $can = []; // Inicializa $can como un array vacío
                            // Comprobar si el índice "songs" está definido en $songs
                            if (isset($songs["songs"])) {
                                $can = $songs["songs"];
                            }
                        ?>
                        <?php foreach ($can as $can): ?>
                            <div class="c1" >
                                <!-- Mostrar el título y el artista de la canción -->
                                <h5><?php echo $can["titulo"], " - ", $can["artista"] ?></h5>
                                <!-- Botón para reproducir la canción y pasar el título y la URL a la función "sonar" -->
                                <button type="play" class="canço" titulo="<?php echo $can['titulo'] ?>" url="<?php echo $can['url'] ?>" onclick="sonar('<?php echo $can['url'] ?>',  '<?php echo $can['titulo'] ?>')">
                                    <img src="fotos/play.png" alt="Ícono de reproducción">
                                </button>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <?php
                        if ($_SERVER["REQUEST_METHOD"] === "POST") {
                        // Verifica si los campos del formulario existen en $_POST antes de acceder a ellos
                            if (isset($_POST["titulo"]) && isset($_POST["url"]) && isset($_POST["artista"]) && isset($_POST["cover"])) {
                                // Obtener los valores del formulario
                                $titulo = $_POST["titulo"];
                                $url = $_POST["url"];
                                $artista = $_POST["artista"];
                                $cover = $_POST["cover"];
                        
                                // Carga el contenido actual del archivo JSON
                                $json = file_get_contents("canciones.json");
                                $data = json_decode($json, true);
        
                                // Genera un nuevo ID para la canción 
                                $newSongId = count($data["songs"]);
        
                                // Crea un nuevo arreglo para la canción
                                $newSong = [
                                    "id" => strval($newSongId),
                                    "titulo" => $titulo,
                                    "url" => $url,
                                    "artista" => $artista,
                                    "cover" => $cover
                                ];
        
                                // Agrega la nueva canción al arreglo "songs"
                                $data["songs"][] = $newSong;
        
                                // Guarda los datos actualizados en el archivo JSON
                                file_put_contents("canciones.json", json_encode($data, JSON_PRETTY_PRINT));
                            } 
                        }
                    ?>
                    <!-- El formulario HTML para agregar una nueva canción -->
                    <div class="Afegircançò">
                        <h3>Afegir cançò</h3>
                        <form method="post" action="" >
                            <div class="can_añadir">
                                <label>Títol:</label>
                                <input type="text" name="titulo" required>
                            </div>
                            <div class="can_añadir">
                                <label>Url de la cançò:</label>
                                <input type="text" name="url" required>
                            </div>
                            <div class="can_añadir">
                                <label>Nom de l'artista:</label>
                                <input type="text" name="artista" required>
                            </div>
                            <div class="can_añadir">
                                <label>Url del cover:</label>
                                <input type="text" name="cover" required>
                            </div>
                                <!-- Botón para enviar el formulario -->
                                <input type="submit" class="afegir" name="submit" value="Enviar">
                        </form>
                    </div>
                </main>
                <footer class="peu">
                    <div class="pie">
                        <!-- Contenedor para mostrar el nombre de la canción -->
                        <div class="nomcancion"> 
                            <p id="nomtitol"> </p>
                        </div>
                        <!-- Contenedor para la barra de progreso y la información de tiempo -->
                        <div class="barra">
                            <!-- Barra de progreso para la canción -->
                            <input type="range" id="barraProgreso" max="100" value="0"></progress> 
                            <!-- Contenedor para mostrar el tiempo actual y el tiempo total -->
                            <div class="tiempo">    
                                <p id="tiempoActual">00:00</p>    
                                <p id="tiempoTotal">00:00</p> 
                            </div>
                        </div>
                        <!-- Controles de reproducción de música -->
                        <div class="controls">
                            <!-- Botón para reproducir aleatoriamente -->
                            <button type="random">
                                <img src="fotos/random.png" alt="Reproducir aleatoriamente">
                            </button>
                            <!-- Botón para detener la reproducción -->
                            <button type="parar">
                                <img src="fotos/parar.png" onclick="parar()" alt="Parar">
                            </button>
                            <!-- Botón para retroceder a la canción anterior -->
                            <button type="atras" onclick="anterior(`<?= count($can) ?>`)">
                                <img src="fotos/atras.png" >
                            </button>
                            <!-- Botón para pausar o reanudar la reproducción -->
                            <button type="playy" onclick="pausar()">
                                <img id="playButtonImage" src="fotos/play.png" >
                            </button>
                            <!-- Botón para avanzar a la siguiente canción -->
                            <?php
                                $songs = file_get_contents("canciones.json");
                                $songs = json_decode($songs, true);
                                $can = $songs["songs"];
                            ?>
                            <button id="siguienteButton"  type="button" onclick="siguiente(`<?= count($can) ?>`)">
                                <img src="fotos/siguiente.png" />
                            </button>
                            <!-- Botón para ajustar el volumen -->
                            <button id="volumen" class="volumen" type="volumen">
                                <img src="fotos/volumen.png" >
                            </button>
                            <!-- Barra deslizante para controlar el volumen -->
                            <input type="range" class="barraVolumen" id="barraVolumen" max="200" value="100"></progress>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </body>
</html>