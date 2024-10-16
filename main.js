// Variables
const tableroJuego = document.getElementById('tablero-juego');
const botonReiniciar = document.getElementById('reiniciar');
const contadorIntentos = document.getElementById('contador-intentos');



let cartasVolteadas = [];
let cartasEmparejadas = [];
let intentos = 0;
let cronometroIntervalo;
let segundos = 0;
let minutos = 0;
const cronometroElemento = document.getElementById('cronometro');



let arrayCartas = [
    'img/img1.jpg', 'img/img1.jpg',
    'img/img2.jpg', 'img/img2.jpg',
    'img/img3.jpg', 'img/img3.jpg',
    'img/img4.jpg', 'img/img4.jpg',
    'img/img5.jpg', 'img/img5.jpg',
    'img/img6.jpg', 'img/img6.jpg',
    'img/img7.jpg', 'img/img7.jpg',
    'img/img8.jpg', 'img/img8.jpg'
];

function mezclar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    
    return array;
}

function crearTablero() {
    tableroJuego.innerHTML = ''; 
    mezclar(arrayCartas);
    arrayCartas.forEach((carta, indice) => {
        const elementoCarta = document.createElement('div');
        elementoCarta.classList.add('carta');
        elementoCarta.dataset.valorCarta = carta;
        elementoCarta.dataset.indice = indice;

        const imagen = document.createElement('img');
        imagen.src = carta;
        imagen.onerror = () => console.error(`No se pudo cargar la imagen: ${carta}`); 
        console.log(`Cargando imagen: ${carta}`);
        elementoCarta.appendChild(imagen);

        elementoCarta.addEventListener('click', voltearCarta);
        tableroJuego.appendChild(elementoCarta);
    });

    reiniciarCronometro(); 
    iniciarCronometro(); 
    actualizarIntentos();
}

function voltearCarta() {
    const carta = this;
    
    if (cartasVolteadas.length < 2 && !carta.classList.contains('volteada') && !cartasEmparejadas.includes(carta.dataset.indice)) {
        carta.classList.add('volteada');
        cartasVolteadas.push(carta);
        
        if (cartasVolteadas.length === 2) {
            intentos++;
            actualizarIntentos();
            verificarEmparejamiento();
        }
    }
}

function verificarEmparejamiento() {
    const [carta1, carta2] = cartasVolteadas;
    
    if (carta1.dataset.valorCarta === carta2.dataset.valorCarta) {
        cartasEmparejadas.push(carta1.dataset.indice, carta2.dataset.indice);
        cartasVolteadas = [];
        guardarJuego();
        verificarJuegoGanado();
        Toastify({
            text: "BIEN, SI ES PAREJA",
            className: "info",
            position: "center",
            offset: {
                x: 0,
                y: 420
              },
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
          }).showToast();
    } else {
        setTimeout(() => {
            carta1.classList.remove('volteada');
            carta2.classList.remove('volteada');
            cartasVolteadas = [];
        }, 500);
        Toastify({

            text: "NO ES PAREJA",
            gravity: "top",
            position: "center",
            offset: {
                x: 400, 
                y: 90 
              },
            duration: 3000
            
            }).showToast();
    }
    Toastify({

        text: "NO ES PAREJA",
        gravity: "top",
        position: "right",
        offset: {
            x: 600,
            y: 140
          },
        duration: 3000
        
        }).showToast();
    
}

function guardarJuego() {
    const estadoJuego = {
        cartasEmparejadas,
        arrayCartas,
        intentos
    };
    localStorage.setItem('juegoMemoria', JSON.stringify(estadoJuego));
}

function cargarJuego() {
    const juegoGuardado = localStorage.getItem('juegoMemoria');
    if (juegoGuardado) {
        const { cartasEmparejadas: cartasGuardadas, arrayCartas: cartasGuardadasArray, intentos: intentosGuardados } = JSON.parse(juegoGuardado);
        cartasEmparejadas = cartasGuardadas;
        arrayCartas = cartasGuardadasArray;
        intentos = intentosGuardados;

        crearTablero();
        cartasEmparejadas.forEach(indice => {
            const carta = tableroJuego.querySelector(`.carta[data-indice='${indice}']`);
            carta.classList.add('volteada');
        });
    } else {
        crearTablero();
    }
}

function verificarJuegoGanado() {
    if (cartasEmparejadas.length === arrayCartas.length) {
        detenerCronometro(); 
        setTimeout(() => {
            Swal.fire({
                title: "¡Ganaste la partida!",
                text: "Has click en el botón",
                icon: "success"
            });
        }, 500);
    }
}

function reiniciarJuego() {
    localStorage.removeItem('juegoMemoria');
    cartasEmparejadas = [];
    cartasVolteadas = [];
    intentos = 0;
    reiniciarCronometro(); 
    crearTablero();
}

function actualizarIntentos() {
    contadorIntentos.textContent = `Intentos: ${intentos}`;
}

function iniciarCronometro() {
    cronometroIntervalo = setInterval(() => {
        segundos++;
        if (segundos === 60) {
            minutos++;
            segundos = 0;
        }
        actualizarCronometro();
    }, 1000); 
}

function detenerCronometro() {
    clearInterval(cronometroIntervalo);
}

function reiniciarCronometro() {
    clearInterval(cronometroIntervalo);
    segundos = 0;
    minutos = 0;
    actualizarCronometro();
}

function actualizarCronometro() {
    const segundosFormateados = segundos < 10 ? `0${segundos}` : segundos;
    const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;
    cronometroElemento.textContent = `Tiempo: ${minutosFormateados}:${segundosFormateados}`;
}

botonReiniciar.addEventListener('click', reiniciarJuego);

cargarJuego();





