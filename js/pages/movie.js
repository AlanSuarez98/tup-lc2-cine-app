// Obtener el ID de la película de los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

// Función para cargar y mostrar los detalles de la película
async function loadMovieDetails() {
  try {
    const movieDetails = await getMovieDetails(movieId);

    // Mostrar los detalles de la película en la página
    const movieDetailsContainer = document.getElementById("movieDetails");
    movieDetailsContainer.innerHTML = `
      <section id="contenedorMovies">
        <div id="imagen">
            <img src="https://image.tmdb.org/t/p/w500${movieDetails.poster_path}" alt="${movieDetails.title} Poster">
        </div>
        <div id="descriMovies">
            <h2>${movieDetails.title}</h2>
            <p><span>Código:</span> ${movieDetails.id}</p>
            <p><span>Título original:</span> ${movieDetails.original_title}</p>
            <p><span>Idioma original:</span> ${movieDetails.original_language}</p>
            <p><span>Año:</span> ${movieDetails.release_date}</p>
            <p id="resumen"><span>Resumen:</span> ${movieDetails.overview}</p>
            <div id="icons">
            <button onclick="guardarFavoritos(${movieDetails.id});" id="corazon1"><i class="fa-regular fa-heart"></i></button>
            <button onclick="guardarFavoritos(${movieDetails.id});" id="corazon2"><i class="fa-solid fa-heart"></i></button>
        </div>
        </div>
      </section>
    `;

    // Cambiar el título del head al nombre de la película
    document.title = movieDetails.title;

    // Obtener los videos relacionados con la película
    const movieVideos = await getMovieVideos(movieId);

    // Encontrar el trailer entre los videos
    const trailer = movieVideos.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    if (trailer) {
      // Mostrar el trailer en un iframe
      const trailerContainer = document.getElementById("trailer");
      trailerContainer.innerHTML = `
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      `;
    }

    const savedIDs = JSON.parse(localStorage.getItem("movieIDs")) || [];
    if (savedIDs.includes(movieDetails.id)) {
      document.getElementById("corazon1").style.display = "none";
      document.getElementById("corazon2").style.display = "block";
    } else {
      document.getElementById("corazon1").style.display = "block";
      document.getElementById("corazon2").style.display = "none";
    }
  } catch (error) {
    console.error("Error al cargar los detalles de la película:", error);
  }
}

function guardarFavoritos(id) {
  try {
    // Obtener los IDs de las películas favoritas almacenadas en el localStorage
    let savedIDs = JSON.parse(localStorage.getItem("movieIDs")) || [];

    // Verificar si la película ya está en favoritos
    if (savedIDs.includes(id)) {
      // Remover la película del array de favoritos
      savedIDs = savedIDs.filter((savedId) => savedId !== id);

      // Cambiar la visualización de los corazones
      document.getElementById("corazon1").style.display = "block";
      document.getElementById("corazon2").style.display = "none";
    } else {
      // Agregar la película al array de favoritos
      savedIDs.push(id);

      // Cambiar la visualización de los corazones
      document.getElementById("corazon1").style.display = "none";
      document.getElementById("corazon2").style.display = "block";
    }

    // Guardar el array actualizado en el localStorage
    localStorage.setItem("movieIDs", JSON.stringify(savedIDs));
  } catch (error) {
    console.error("Error al gestionar favoritos:", error);
  }
}

// Cargar los detalles de la película al cargar la página
window.onload = loadMovieDetails;
