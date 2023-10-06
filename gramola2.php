<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gramola 2</title>
    <link rel="stylesheet" href="gramola2.css">
    <script src="gramola2.js" defer></script>
    <script src="comun.js" defer></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400&family=Mukta&family=PT+Sans+Caption:wght@400;700&display=swap" rel="stylesheet">
</head>
    <body>             
        <div class="plantilla">
            <header>
                <a href="index.php">
                     <!-- Para ir a la página principal -->
                    <div class="arrow">
                        <div class="arrow-top"></div>
                        <div class="arrow-bottom"></div>
                    </div> 
                </a>
                <div class="con">
                    <!-- Barra de búsqueda -->
                    <input checked="" class="checkbox" type="checkbox"> 
                    <div class="mainbox">
                        <div class="iconContainer">
                            <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg" class="search_icon"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg>
                        </div>
                        <input class="search_input" id="searchPlaylistInput" placeholder="Search Playlists" type="text">
                    </div>
                </div>  
            </header> 
            <div class="izq">
                <div class="vinilo-container">
                    <img id="coverImage" class="square" src="fotos/gris.jpeg" data-cover="" alt="Cuadrado">
                    <img class="round" src="fotos/vinilo.png" alt="Redonda" id="vinilo">
                </div>
                <?php
                    // Cargar información de canciones desde un archivo JSON
                    $songs = file_get_contents("canciones.json");
                    $songs = json_decode($songs, true);
                    $can = $songs["songs"];
                ?>
                <!-- Título de la canción actual -->
                <h3 id="nomtitol"> </h3>
                <!-- Controles de reproducción de música -->
                <div class="controls">
                    <!-- Icono de reproducción aleatoria -->
                    <button type="random">
                        <img src="fotos/random.png" alt="Reproducir aleatoriamente">
                    </button>
                    <!-- Icono de parar -->
                    <button type="parar">
                        <img src="fotos/parar.png" onclick="parar()" alt="Parar">
                    </button>
                    <!-- Icono de retroceso -->
                    <button type="atras" >
                        <img src="fotos/atras.png"  onclick="anterior(`<?= count($can) ?>`)">
                    </button>
                    <!-- Icono de pausar o reproducir -->
                    <button type="playy" onclick="pausar()">
                        <img id="playButtonImage" src="fotos/play.png" />
                    </button> 
                    <?php
                        // Cargar información de canciones desde un archivo JSON
                        $songs = file_get_contents("canciones.json");
                        $songs = json_decode($songs, true);
                    ?>
                    <!-- Icono de siguiente -->
                    <button id="siguienteButton" type="button" onclick="siguiente(<?= count($can) ?>)">
                        <img src="fotos/siguiente.png" />
                    </button>
                    <!-- Icono de volumen -->
                    <button id="volumen" class="volumen" type="volumen">
                        <img src="fotos/volumen.png">
                    </button>
                    <!-- Barra de volumen -->
                    <input type="range" class="barraVolumen" id="barraVolumen" max="200" value="100"></progress>
                    <div class="playing">
                        <!-- Barras de audio visualizer -->
                        <div class="greenline line-1"></div>
                        <div class="greenline line-2"></div>
                        <div class="greenline line-3"></div>
                        <div class="greenline line-4"></div>
                        <div class="greenline line-5"></div>
                    </div>
                </div>
                <!-- Barra de progreso y tiempo actual/total -->
                <div class="barra">
                    <p id="tiempoActual">00:00</p>
                    <input type="range" id="barraProgreso" max="100" value="0"></progress>         
                    <p id="tiempoTotal">00:00</p> 
                </div>
            </div>
            <div class="der">
                <?php
                // Cargar información de canciones y listas de reproducción desde un archivo JSON
                    $songs = file_get_contents("canciones.json");
                    $songs = json_decode($songs, true);
                    $playlists = $songs["playlists"];
                ?>
                <?php foreach ($playlists as $playlist): ?> 
                <?php $hola = $playlist["canciones"]; ?>

                <!-- Lista de reproducción desplegable -->
                <div class="playlists-desplegable">
                    <div class="cabecera" id="" data-nombre-playlist="" onclick="toggleContenido(this)" >
                        <!-- Nombre de la playlist -->
                        <?php echo $playlist["nombre"] ?> 
                    </div>
                    <div class="contenido">
                        <!-- Canciones de la playlist -->
                        <div class="canciones">
                            <?php
                                $canciones = $playlist["canciones"];
                                // Obtener canciones de la lista de reproducción actual
                                for ($i = 0; $i < count($canciones); $i++):
                            ?>
                            <div class="c1">
                                <h5><?php echo $canciones[$i]["titulo"] ?></h5>
                                <button type="play" class="canço" titulo="<?php echo $canciones[$i]['titulo'] ?>" cover="<?php echo $canciones[$i]['cover'] ?>" url="<?php echo $canciones[$i]['url'] ?>"
                                    onclick='sonar(`<?php echo $canciones[$i]["url"] ?>`,`<?php echo $canciones[$i]["titulo"] ?>`, `<?php echo json_encode($canciones) ?>` )'>
                                    <img src="fotos/play.png" alt="Ícono de reproducción">
                                </button>
                            </div>
                            <?php endfor; ?>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>  
                <div class="tecnic">
                    <h1>Informació Tècnica</h1>
                    <h3>Última playlist escoltada</h3> 
                    <div class="info" id="info">
                        <div class="lastplaylist"> Última playlist: </div>
                        <div class="lastplaylisttime">Data: </div>   
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>