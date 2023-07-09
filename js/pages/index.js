// Variable para almacenar la página actual
let currentPage = 1;

// Obtener el elemento del mensaje
const mensaje = document.getElementById("sec-messages");

// Función para cargar y mostrar las películas
async function appMovies(page) {
  try {
    // Realizar la solicitud a la API para obtener las películas
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?language=es-US&page=${page}&api_key=${apiKey}`
    );

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      // Mostrar mensaje de error
      mensaje.innerHTML = `<p id="error">Error al cargar las películas. Por favor, inténtelo nuevamente.</p>`;
      setTimeout(function () {
        mensaje.innerHTML = "";
      }, 5000);
      throw new Error("Error al cargar las películas");
    }

    // Obtener los datos de la respuesta
    const data = await response.json();

    // Obtener el contenedor para las películas
    const card = document.getElementById("cardPeliculas");
    card.innerHTML = "";

    // Iterar sobre las películas y agregarlas al contenedor
    data.results.forEach((movie) => {
      card.innerHTML += `<div class="contenedorPeliculas" id="contenedorPeliculas">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path} " alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>Código: <span value"${movie.id}">${movie.id}</span></p>
        <p>Título original: <span>${movie.original_title}</span></p>
        <p>Idioma original: <span>${movie.original_language}</span></p>
        <p>Año: <span>${movie.release_date}</span></p>
        <button onclick="addFavoritas(${movie.id})">Agregar a favoritos</button>
    </div>`;
    });

    // Obtener los botones de página anterior y siguiente
    const btnAnterior = document.getElementById("btnAnterior");
    const btnSiguiente = document.getElementById("btnSiguiente");

    // Mostrar u ocultar los botones de página según corresponda
    btnAnterior.style.visibility = page === 1 ? "hidden" : "visible";
    btnAnterior.style.cursor = page === 1 ? "default" : "pointer";

    btnSiguiente.style.visibility =
      page === data.total_pages ? "hidden" : "visible";
    btnSiguiente.style.cursor = page === data.total_pages ? "default" : "pointer";
  } catch (error) {
    console.error("Error al cargar las películas:", error);

    // Mostrar mensaje de error
    mensaje.innerHTML = `<p id="error">Error al cargar las películas. Por favor, inténtelo nuevamente.</p>`;
    setTimeout(function () {
      mensaje.innerHTML = "";
    }, 5000);
  }
}

// Función para cargar la página anterior
async function loadPreviousPage() {
  try {
    if (currentPage > 1) {
      // Decrementar la página actual
      currentPage--;

      // Cargar y mostrar las películas en la página actualizada
      await appMovies(currentPage);

      // Desplazarse al inicio de la página de forma suave
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error) {
    console.error("Error al cargar la página anterior:", error);
  }
}

// Función para cargar la página siguiente
async function loadNextPage() {
  try {
    // Incrementar la página actual
    currentPage++;

    // Cargar y mostrar las películas en la página actualizada
    await appMovies(currentPage);

    // Desplazarse al inicio de la página de forma suave
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("Error al cargar la página siguiente:", error);
  }
}

// Función para agregar una película a favoritos
async function addFavoritas(id) {
  try {
    // Obtener los IDs de las películas favoritas almacenadas en el local storage
    let savedIDs = JSON.parse(localStorage.getItem("movieIDs")) || [];

    // Obtener el elemento del mensaje
    const mensaje = document.getElementById("sec-messages");

    if (savedIDs.includes(id)) {
      // Mostrar mensaje de advertencia si la película ya está en favoritos
      const contenedor = `<p id="warning">La película ingresada ya se encuentra almacenada</p>`;
      mensaje.innerHTML = contenedor;
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Limpiar el mensaje
      setTimeout(function () {
        mensaje.innerHTML = "";
      }, 5000);
    } else {
      // Agregar el ID de la película a favoritos
      savedIDs.push(id);
      localStorage.setItem("movieIDs", JSON.stringify(savedIDs));

      // Mostrar mensaje de éxito
      const contenedor = `<p id="succes">Película agregada con éxito</p>`;
      mensaje.innerHTML = contenedor;
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(function () {
        mensaje.innerHTML = "";
      }, 5000);
    }
  } catch (error) {
    console.error("Error al agregar película a favoritos:", error);

    // Mostrar mensaje de error
    mensaje.innerHTML = `<p id="error">Error al cargar las películas. Por favor, inténtelo nuevamente.</p>`;
    setTimeout(function () {
      mensaje.innerHTML = "";
    }, 5000);
  }
}

// Función para agregar una película por código
async function addMovieCode() {
  try {
    // Obtener el valor del código de la película ingresado
    const movieCodeInput = document.getElementById("addCode");
    const movieCode = parseInt(movieCodeInput.value);

    // Variables para el mensaje y el contenedor del mensaje
    let contenedor = `<p id="error">Error: La película seleccionada no se encuentra en la API o se produjo un error al consultar</p>`;
    let mensaje = document.getElementById("sec-messages");
    mensaje.innerHTML = "";

    if (movieCode) {
      // Verificar si la película ya está en el local storage
      let savedIDs = JSON.parse(localStorage.getItem("movieIDs")) || [];
      if (savedIDs.includes(movieCode)) {
        // Mostrar mensaje de advertencia si la película ya está en favoritos
        mensaje.innerHTML = `<p id="warning">La película ingresada ya se encuentra almacenada</p>`;
        setTimeout(function () {
          mensaje.innerHTML = "";
        }, 5000);
      } else {
        // Verificar si la película existe en la API
        const exists = await checkIfMovieExists(movieCode);
        if (exists) {
          // Agregar el código de la película al local storage y mostrar mensaje de éxito
          addToLocalStorage(movieCode);
          mensaje.innerHTML = `<p id="succes">Película agregada con éxito</p>`;

          // Actualizar la lista de favoritas después de agregar una película
          showFavorites();

          // Limpiar el campo de entrada
          movieCodeInput.value = "";
        } else {
          mensaje.innerHTML = contenedor;
        }
      }
    } else {
      mensaje.innerHTML = contenedor;
    }

    // Limpiar el mensaje
    setTimeout(function () {
      mensaje.innerHTML = "";
    }, 5000);
  } catch (error) {
    console.error("Error al agregar película por código:", error);
  }
}

// Función para verificar si una película existe en la API
async function checkIfMovieExists(code) {
  try {
    // Realizar la solicitud a la API para verificar la existencia de la película
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${code}?api_key=${apiKey}`
    );

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error("Error al verificar la existencia de la película");
    }

    // Obtener los datos de la respuesta
    const data = await response.json();

    // Verificar si el estado de la respuesta es diferente a 34 (código de película no encontrado)
    return data.status_code !== 34;
  } catch (error) {
    console.error("Error al verificar la existencia de la película:", error);
    return false;
  }
}

// Función para verificar y guardar el código de una película
async function checkAndSaveMovieCode(code) {
  try {
    // Verificar si la película existe en la API
    const exists = await checkIfMovieExists(code);

    // Obtener el elemento del mensaje
    const mensaje = document.getElementById("sec-messages");

    if (!exists) {
      // Mostrar mensaje de error si la película no existe
      const contenedor = `<p id="error">Error: La película seleccionada no se encuentra en la API o se produjo un error al consultar</p>`;
      mensaje.innerHTML = contenedor;
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(function () {
        mensaje.innerHTML = "";
      }, 5000);
    } else {
      // Agregar el código de la película al local storage
      addToLocalStorage(code);
    }
  } catch (error) {
    console.error(
      "Error al verificar y guardar el código de la película:",
      error
    );
  }
}

// Obtener el elemento del mensaje de carga
const mensajeCargando = document.getElementById("loading");

// Mostrar el mensaje de carga
mensajeCargando.style.visibility = "visible";

// Simular una carga o realizar operaciones asíncronas
setTimeout(async function () {
  try {
    // Llamar a la función para cargar y mostrar las películas
    await appMovies(currentPage);

    // Ocultar el mensaje de carga
    mensajeCargando.style.visibility = "hidden";
  } catch (error) {
    console.error("Error al cargar la aplicación:", error);
  }
}, 2000);
