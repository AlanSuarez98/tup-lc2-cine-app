// Obtener referencia a los elementos del DOM
const btn = document.getElementById('button');
const mostrar = document.getElementById('sec-cine-result');

// Agregar evento 'submit' al formulario
document.getElementById('form').addEventListener('submit', function(event) {
  // Evitar que se envíe el formulario por defecto
  event.preventDefault();

  // Limpiar el contenido mostrado
  mostrar.innerHTML = '';

  // Cambiar el valor del botón mientras se envía el formulario
  btn.value = 'Enviando...';

  // ID del servicio y plantilla de email
  const serviceID = 'default_service';
  const templateID = 'template_csaqh9i';

  // Obtener el valor del campo de email
  const email = document.getElementById('email_id').value;
  // Validar si el email es válido
  if (!validateEmail(email)) {
    // Mostrar mensaje de email inválido
    mostrar.innerHTML = `<p id="invalido">Ingrese un email válido</p>`;
    setTimeout(function(){
      mostrar.innerHTML='';
    }, 3000);
    btn.value = 'Enviar';
    return;
  }

  // Enviar el formulario utilizando el servicio de emailjs
  emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      // Mostrar mensaje de éxito al enviar el email
      btn.value = 'Enviar';
      mostrar.innerHTML = `<p id="enviado">Email enviado exitosamente</p>`;
      setTimeout(function(){
        mostrar.innerHTML='';
      }, 3000);
    }, (err) => {
      // Mostrar mensaje de error al enviar el email
      btn.value = 'Enviar';
      mostrar.innerHTML = `<p id="error">Ocurrió un error al enviar el email</p>`;
      setTimeout(function(){
        mostrar.innerHTML='';
      }, 3000);
    });
});

// Función para validar email
function validateEmail(email) {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}
