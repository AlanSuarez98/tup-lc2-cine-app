// Clave de API para acceder a themoviedb.org
let apiKey = "3440642a701708292587a01aca89613e";

// Función asincrónica para verificar si una película existe
async function checkIfMovieExists(id) {
  // Realizar solicitud a la API para obtener los detalles de la película
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
  );

  // Devolver true si la respuesta es exitosa, false de lo contrario
  return response.ok;
}

// Función para agregar un ID de película al local storage
function addToLocalStorage(id) {
  // Obtener los IDs de películas almacenados en el local storage
  let savedIDs = JSON.parse(localStorage.getItem("movieIDs")) || [];

  if (savedIDs.includes(id)) {
    // Mostrar mensaje de advertencia si la película ya está almacenada
    const mensaje = document.getElementById("sec-messages");
    const contenedor = `<p id="warning">La Película ingresada ya se encuentra almacenada</p>`;
    mensaje.innerHTML = contenedor;
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Eliminar el mensaje
    setTimeout(function () {
      mensaje.innerHTML = "";
    }, 5000);
  } else {
    // Agregar el ID de la película al array de IDs almacenados
    savedIDs.push(id);
    localStorage.setItem("movieIDs", JSON.stringify(savedIDs));

    // Mostrar mensaje de éxito al agregar la película
    const mensaje = document.getElementById("sec-messages");
    const contenedor = `<p id="success">Película agregada con éxito</p>`;
    mensaje.innerHTML = contenedor;
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Eliminar el mensaje
    setTimeout(function () {
      mensaje.innerHTML = "";
    }, 5000);
  }
}

// Función asincrónica para obtener los detalles de una película
async function getMovieDetails(id) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=es-US`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los detalles de la película:", error);
    throw error;
  }
}
async function getMovieVideos(id) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=es-MX`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error al obtener los videos de la película:", error);
    throw error;
  }
}
