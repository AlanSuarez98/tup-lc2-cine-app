// Función para eliminar una película de favoritas
async function removeMovieFromFavorites(id) {
  try {
    // Obtener las películas favoritas almacenadas en el local storage
    let savedIDs = JSON.parse(localStorage.getItem("movieIDs")) || [];

    // Filtrar los IDs de las películas y eliminar el ID correspondiente
    const updatedIDs = savedIDs.filter((movieIDs) => movieIDs !== id);

    // Actualizar las películas favoritas en el local storage
    localStorage.setItem("movieIDs", JSON.stringify(updatedIDs));

    // Eliminar el elemento HTML correspondiente
    const movieElement = document.getElementById(`contenedorPeliculasFavoritas${id}`);
    if (movieElement) {
      movieElement.remove();
    }

    // Mostrar mensaje si no hay películas favoritas
    if (updatedIDs.length === 0) {
      let mensaje = document.getElementById("sec-message");
      mensaje.innerHTML = `<img src="img/IconoCine.png" alt="popcorn">
        <p id="mensaje">No tiene películas seleccionadas en sus favoritos</p>`;
    }

    // Actualizar la lista de películas favoritas
    showFavorites();
  } catch (error) {
    console.error("Error al remover película de favoritos:", error);
  }
}

// Función para mostrar las películas favoritas
async function showFavorites() {
  try {
    // Obtener los IDs de las películas favoritas almacenadas en el local storage
    const savedIDs = JSON.parse(localStorage.getItem("movieIDs")) || [];

    // Obtener el elemento HTML para mostrar las películas favoritas
    const cardFavoritas = document.getElementById("cardPeliculas");
    let mensaje = document.getElementById("sec-message");

    cardFavoritas.innerHTML = "";

    if (savedIDs.length === 0) {
      // Mostrar mensaje si no hay películas favoritas
      mensaje.innerHTML = `<img src="img/IconoCine.png" alt="popcorn">
        <p id="mensaje">No tiene películas seleccionadas en sus favoritos</p>`;
      return;
    }

    // Obtener y mostrar cada película favorita
    for (const id of savedIDs) {
      // Realizar solicitudes a la API para obtener los detalles de la película y sus videos
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=es-US`
      );
      const videosResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=es-MX`
      );

      // Verificar si las solicitudes son exitosas
      if (response.ok && videosResponse.ok) {
        // Obtener los datos de la respuesta
        const movie = await response.json();
        const videos = await videosResponse.json();

        // Crear y mostrar el elemento HTML de la película favorita
        const movieElement = document.createElement("div");
        movieElement.setAttribute("class", "contenedorPeliculasFavoritas");
        movieElement.setAttribute("id", `contenedorPeliculasFavoritas${id}`);
        movieElement.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          <h3>${movie.title}</h3>
          <p class="code">Código: <span>${movie.id}</span></p>
          <p>Título original: <span>${movie.original_title}</span></p>
          <p>Idioma original: <span>${movie.original_language}</span></p>
          <p>Resumen: <span>${movie.overview}</span></p>
          <button onclick="removeMovieFromFavorites(${movie.id})">Quitar de favoritas</button>
          <div>
          ${generateVideoEmbed(videos.results)}
          </div>
        `;

        cardFavoritas.appendChild(movieElement);
      }
    }
  } catch (error) {
    console.error("Error al mostrar las películas favoritas:", error);
  }
}
//Función que genera el elemento video de cada película
function generateVideoEmbed(videos) {
  let embed = "";

  for (const video of videos) {
    embed = `
      <iframe width="auto" height="auto" src="https://www.youtube.com/embed/${video.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
  }

  return embed;
}

// Función para eliminar una película de favoritas sin necesidad de actualizar la página
async function removeFromFavorites(id) {
  try {
    // Obtener las películas favoritas almacenadas en el local storage
    let savedIDs = JSON.parse(localStorage.getItem("movieIDs")) || [];

    // Obtener el índice del ID de la película a remover
    const index = savedIDs.indexOf(id);

    // Remover el ID de la película si se encuentra en la lista
    if (index !== -1) {
      savedIDs.splice(index, 1);
      localStorage.setItem("movieIDs", JSON.stringify(savedIDs));
    }

    // Remover el elemento HTML correspondiente a la película favorita
    removeMovieFromFavorites(id);

    // Mostrar mensaje si no hay películas favoritas
    if (savedIDs.length === 0) {
      const emptyMessage = document.getElementById("sec-message");
      emptyMessage.innerHTML = `<img src="img/IconoCine.png" alt="popcorn">
        <p id="mensaje">No tiene películas seleccionadas en sus favoritos</p>`;
    }

    // Actualizar la lista de películas favoritas
    showFavorites();
  } catch (error) {
    console.error("Error al remover película de favoritos:", error);
  }
}

// Obtener el elemento del mensaje de carga
const mensajeCargando = document.getElementById("loading");

// Mostrar el mensaje de carga
mensajeCargando.style.visibility = "visible";


setTimeout(async function () {
  try {
    // Ocultar el mensaje de carga
    mensajeCargando.style.visibility = "hidden";

    // Mostrar las películas favoritas
    await showFavorites();
  } catch (error) {
    console.error("Error al cargar las películas favoritas:", error);
  }
}, 2500);
