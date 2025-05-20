// Variables globales
let vidasJugador = 3;
let vidasEnemigo = 3;
let juegoTerminado = false;
let mascotaJugador = '';
let mascotaEnemigo = '';
let rondasGanadas = 0;
let rondasPerdidas = 0;
let rondasEmpatadas = 0;
let historialCombates = [];
let jugadorId = null;

// Objeto con las rutas de las imágenes de las mascotas
const imagenesMascotas = {
    Hipodoge: './images/hipoN.png',
    Capipepo: './images/capipepoN.png',
    Ratigueya: './images/ratigueyaN.png'
};

// Función principal que inicia el juego
function iniciarJuego() {
    console.log("Juego iniciado");
    
    // Configurar botones
    document.getElementById('boton-mascota').addEventListener('click', seleccionarMascotaJugador);
    document.getElementById('boton-fuego').addEventListener('click', () => realizarAtaque('FUEGO'));
    document.getElementById('boton-agua').addEventListener('click', () => realizarAtaque('AGUA'));
    document.getElementById('boton-tierra').addEventListener('click', () => realizarAtaque('TIERRA'));
    document.getElementById('boton-si').addEventListener('click', reiniciarJuego);
    document.getElementById('boton-no').addEventListener('click', () => {
        document.getElementById('reiniciar').innerHTML = '<p>¡Gracias por jugar!</p>';
    });

    // Ocultar elementos inicialmente
    document.getElementById('boton-fuego').style.display = 'none';
    document.getElementById('boton-agua').style.display = 'none';
    document.getElementById('boton-tierra').style.display = 'none';
    document.getElementById('reiniciar').style.display = 'none';
    document.getElementById('seleccionar-ataque').style.display = 'none';
    
    // Inicializar contadores
    actualizarVidas();
    
    // Unirse al juego al cargar la página
    unirseAlJuego();
}

// Función para unirse al juego
function unirseAlJuego() {
    fetch("http://localhost:8080/unirse")
        .then(function (res) {
            if (res.ok) {
                res.text()
                    .then(function (respuesta) {
                        console.log("ID del jugador:", respuesta);
                        jugadorId = respuesta;
                    });
            }
        });
}

// Función para seleccionar mascota del jugador
function seleccionarMascotaJugador() {
    const inputHipodoge = document.getElementById('hipodoge');
    const inputCapipepo = document.getElementById('capipepo');
    const inputRatigueya = document.getElementById('ratigueya');

    if (inputHipodoge.checked) {
        mascotaJugador = 'Hipodoge';
    } else if (inputCapipepo.checked) {
        mascotaJugador = 'Capipepo';
    } else if (inputRatigueya.checked) {
        mascotaJugador = 'Ratigueya';
    } else {
        alert('¡Debes seleccionar una mascota!');
        return;
    }
    
    // Actualizar la visualización de la mascota del jugador
    document.getElementById('nombre-mascota-jugador').textContent = mascotaJugador;
    document.getElementById('imagen-mascota-jugador').src = imagenesMascotas[mascotaJugador];
    document.getElementById('imagen-mascota-jugador').alt = mascotaJugador;
    
    // Enviar la selección de Mokepon al servidor
    seleccionarMokepon(mascotaJugador);
    
    seleccionarMascotaEnemigo();
    
    // Mostrar sección de ataque y ocultar selección de mascota
    document.getElementById('seleccionar-mascota').style.display = 'none';
    document.getElementById('seleccionar-ataque').style.display = 'block';
    document.getElementById('boton-fuego').style.display = 'inline-block';
    document.getElementById('boton-agua').style.display = 'inline-block';
    document.getElementById('boton-tierra').style.display = 'inline-block';
    
    document.getElementById('mensajes').innerHTML = '<p>¡Comienza el combate! Elige tu ataque.</p>';
}

// Función para enviar la selección de Mokepon al servidor
function seleccionarMokepon(mascotaJugador) {
    fetch(`http://localhost:8080/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    });
}

// [El resto de tus funciones permanecen igual: seleccionarMascotaEnemigo, realizarAtaque, animarAtaque, 
//  determinarResultado, mostrarMensajeCombate, ataqueAleatorioEnemigo, actualizarVidas, 
//  revisarVidas, mostrarResultadoFinal, reiniciarJuego, aleatorio]

// Selección aleatoria de mascota del enemigo
function seleccionarMascotaEnemigo() {
    const opciones = ['Hipodoge', 'Capipepo', 'Ratigueya'];
    mascotaEnemigo = opciones[aleatorio(0, 2)];
    
    // Actualizar la visualización de la mascota del enemigo
    document.getElementById('nombre-mascota-enemigo').textContent = mascotaEnemigo;
    document.getElementById('imagen-mascota-enemigo').src = imagenesMascotas[mascotaEnemigo];
    document.getElementById('imagen-mascota-enemigo').alt = mascotaEnemigo;
}

// Función para realizar un ataque
function realizarAtaque(ataque) {
    if (juegoTerminado) return;
    
    const ataqueEnemigo = ataqueAleatorioEnemigo();
    const resultado = determinarResultado(ataque, ataqueEnemigo);
    
    // Animación de ataque
    animarAtaque(ataque, ataqueEnemigo);
    
    // Registrar el combate en el historial
    historialCombates.push({
        jugador: ataque,
        enemigo: ataqueEnemigo,
        resultado: resultado
    });
    
    // Actualizar contadores de rondas
    if (resultado === 'GANASTE') rondasGanadas++;
    else if (resultado === 'PERDISTE') rondasPerdidas++;
    else rondasEmpatadas++;
    
    // Mostrar mensaje del combate
    mostrarMensajeCombate(ataque, ataqueEnemigo, resultado);
    
    // Actualizar vidas y verificar si el juego terminó
    actualizarVidas();
    revisarVidas();
}

// Animación de ataque mejorada
function animarAtaque(ataqueJugador, ataqueEnemigo) {
    const imagenJugador = document.getElementById('imagen-mascota-jugador');
    const imagenEnemigo = document.getElementById('imagen-mascota-enemigo');
    
    // Color del efecto según el tipo de ataque
    let colorEfecto;
    if (ataqueJugador === 'FUEGO') colorEfecto = '#ff3300';
    else if (ataqueJugador === 'AGUA') colorEfecto = '#0099ff';
    else colorEfecto = '#33cc33';
    
    // Animación para el jugador (atacante)
    imagenJugador.style.position = 'relative';
    imagenJugador.style.zIndex = '10';
    
    // Crear aura dorada para el atacante
    const aura = document.createElement('div');
    aura.style.position = 'absolute';
    aura.style.width = '200px';
    aura.style.height = '200px';
    aura.style.background = 'radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,215,0,0) 70%)';
    aura.style.borderRadius = '50%';
    aura.style.top = '50%';
    aura.style.left = '50%';
    aura.style.transform = 'translate(-50%, -50%)';
    aura.style.opacity = '0';
    aura.style.transition = 'opacity 0.3s';
    
    imagenJugador.parentNode.appendChild(aura);
    
    // Animación de salto con aura
    const keyframes = [
        { transform: 'translateY(0)', boxShadow: '0 0 0 rgba(255,215,0,0)' },
        { transform: 'translateY(-30px)', boxShadow: '0 0 20px rgba(255,215,0,0.8)' },
        { transform: 'translateY(0)', boxShadow: '0 0 0 rgba(255,215,0,0)' }
    ];
    
    const options = {
        duration: 500,
        iterations: 3
    };
    
    imagenJugador.animate(keyframes, options);
    
    // Mostrar aura durante el ataque
    setTimeout(() => {
        aura.style.opacity = '1';
        setTimeout(() => {
            aura.style.opacity = '0';
            setTimeout(() => aura.remove(), 300);
        }, 800);
    }, 100);
    
    // Animación para el enemigo (receptor del ataque)
    setTimeout(() => {
        // Crear efecto de explosión
        const explosion = document.createElement('div');
        explosion.style.position = 'absolute';
        explosion.style.width = '200px';
        explosion.style.height = '200px';
        explosion.style.background = `radial-gradient(circle, ${colorEfecto} 0%, rgba(0,0,0,0) 70%)`;
        explosion.style.borderRadius = '50%';
        explosion.style.top = '50%';
        explosion.style.left = '50%';
        explosion.style.transform = 'translate(-50%, -50%) scale(0)';
        explosion.style.opacity = '0.8';
        explosion.style.transition = 'transform 0.5s, opacity 0.5s';
        
        imagenEnemigo.parentNode.appendChild(explosion);
        
        // Animación de deslizamiento y explosión
        imagenEnemigo.style.position = 'relative';
        
        const danoKeyframes = [
            { transform: 'translateX(0)' },
            { transform: 'translateX(20px)' },
            { transform: 'translateX(-20px)' },
            { transform: 'translateX(0)' }
        ];
        
        const danoOptions = {
            duration: 500,
            iterations: 1
        };
        
        imagenEnemigo.animate(danoKeyframes, danoOptions);
        
        // Animación de explosión
        setTimeout(() => {
            explosion.style.transform = 'translate(-50%, -50%) scale(1)';
            setTimeout(() => {
                explosion.style.opacity = '0';
                setTimeout(() => explosion.remove(), 500);
            }, 300);
        }, 100);
    }, 800);
}

// Determinar resultado del combate
function determinarResultado(ataqueJ, ataqueE) {
    if (ataqueJ === ataqueE) return 'EMPATE';
    
    const ganaFuegoTierra = ataqueJ === 'FUEGO' && ataqueE === 'TIERRA';
    const ganaAguaFuego = ataqueJ === 'AGUA' && ataqueE === 'FUEGO';
    const ganaTierraAgua = ataqueJ === 'TIERRA' && ataqueE === 'AGUA';
    
    if (ganaFuegoTierra || ganaAguaFuego || ganaTierraAgua) {
        vidasEnemigo = Math.max(0, vidasEnemigo - 1);
        return 'GANASTE';
    } else {
        vidasJugador = Math.max(0, vidasJugador - 1);
        return 'PERDISTE';
    }
}

// Mostrar mensaje del combate actual
function mostrarMensajeCombate(ataqueJ, ataqueE, resultado) {
    const sectionMensajes = document.getElementById('mensajes');
    
    // Clases CSS según el resultado
    const claseResultado = resultado.toLowerCase();
    const colorResultado = {
        'ganaste': '#2ecc71',
        'perdiste': '#e74c3c',
        'empate': '#f39c12'
    };
    
    sectionMensajes.innerHTML = 
        `<p class="mensaje-combate">
            <span class="mensaje-ataque">Tu ataque: ${ataqueJ} | Enemigo: ${ataqueE}</span><br>
            <span class="mensaje-resultado" style="background-color: ${colorResultado[claseResultado]}; color: white;">
                ${resultado}
            </span><br>
            <span class="mensaje-vidas">Vidas: Tú (${vidasJugador}) vs Enemigo (${vidasEnemigo})</span>
        </p>`;
    
    // Animación de aparición
    sectionMensajes.style.animation = 'none';
    setTimeout(() => {
        sectionMensajes.style.animation = 'fadeIn 0.5s ease';
    }, 10);
}

// Ataque aleatorio del enemigo
function ataqueAleatorioEnemigo() {
    const ataques = ['FUEGO', 'AGUA', 'TIERRA'];
    return ataques[aleatorio(0, 2)];
}

// Actualizar contadores de vida en la UI
function actualizarVidas() {
    document.getElementById('vidas-jugador').textContent = vidasJugador;
    document.getElementById('vidas-enemigo').textContent = vidasEnemigo;
}

// Verificar si el juego terminó
function revisarVidas() {
    if (vidasJugador <= 0 || vidasEnemigo <= 0) {
        juegoTerminado = true;
        mostrarResultadoFinal();
    }
}

// Mostrar resultado final del juego
function mostrarResultadoFinal() {
    const ganador = vidasJugador > vidasEnemigo ? 'GANASTE' : 'PERDISTE';
    const mensajeGanador = ganador === 'GANASTE' 
        ? `¡Felicidades! Ganaste con ${mascotaJugador} contra ${mascotaEnemigo}!` 
        : `¡Lo siento! Perdiste con ${mascotaJugador} contra ${mascotaEnemigo}.`;
    
    // Efecto de confeti si gana
    if (ganador === 'GANASTE') {
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
                confetti.style.width = Math.random() * 10 + 5 + 'px';
                confetti.style.height = confetti.style.width;
                confetti.style.zIndex = '1000';
                confetti.style.position = 'fixed';
                document.body.appendChild(confetti);
                
                // Eliminar después de la animación
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 5000);
            }, Math.random() * 2000);
        }
    }

    // Ocultar la sección de ataque
    document.getElementById('seleccionar-ataque').style.display = 'none';
    
    // Mostrar resultados
    const resultadoFinal = document.getElementById('resultado-final');
    resultadoFinal.innerHTML = 
        `<h2 class="${ganador.toLowerCase()}">${mensajeGanador}</h2>
        <div class="resumen-juego">
            <h3>Resumen del juego:</h3>
            <p>Rondas ganadas: <strong>${rondasGanadas}</strong></p>
            <p>Rondas perdidas: <strong>${rondasPerdidas}</strong></p>
            <p>Empates: <strong>${rondasEmpatadas}</strong></p>
        </div>
        <h3>¿Quieres jugar de nuevo?</h3>`;
    
    // Mostrar sección de reinicio
    document.getElementById('reiniciar').style.display = 'block';
    
    // Agregar clase al body para estilos especiales
    document.body.classList.add('juego-terminado');
}

// Modifica la función reiniciarJuego() para asegurar que todo se reinicie correctamente
function reiniciarJuego() {
    // Restablecer todas las variables del juego
    vidasJugador = 3;
    vidasEnemigo = 3;
    juegoTerminado = false;
    mascotaJugador = '';
    mascotaEnemigo = '';
    rondasGanadas = 0;
    rondasPerdidas = 0;
    rondasEmpatadas = 0;
    historialCombates = [];
    
    // Restablecer la interfaz
    document.getElementById('seleccionar-mascota').style.display = 'block';
    document.getElementById('seleccionar-ataque').style.display = 'none';
    document.getElementById('reiniciar').style.display = 'none';
    
    // Restablecer selección de mascotas
    const radios = document.querySelectorAll('input[name="mascota"]');
    radios.forEach(radio => radio.checked = false);
    
    // Restablecer mensajes
    document.getElementById('mensajes').innerHTML = '<p>Selecciona tu mascota y comienza el juego!</p>';
    
    // Restablecer contadores
    actualizarVidas();
    
    // Remover clase de juego terminado
    document.body.classList.remove('juego-terminado');
}

// Función para generar números aleatorios
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


// Iniciar el juego cuando se carga la página
window.addEventListener('load', iniciarJuego);