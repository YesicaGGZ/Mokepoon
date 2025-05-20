const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const jugadores = [];

class Jugador {
    constructor(id) {
        this.id = id;
        this.mokepon = null;
    }

    asignarMokepon(mokepon) {
        this.mokepon = mokepon;
    }
}

class Mokepon {
    constructor(nombre) {
        this.nombre = nombre;
    }
}

// Endpoint para unirse al juego
app.get('/unirse', (req, res) => {
    const id = `${Math.random()}`;
    const jugador = new Jugador(id);
    jugadores.push(jugador);
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.send(id);
});

// Endpoint para seleccionar Mokepon
app.post("/mokepon/:jugadorId", (req, res) => {
    const jugadorId = req.params.jugadorId || "";
    const nombre = req.body.mokepon || "";
    const mokepon = new Mokepon(nombre);

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id);

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarMokepon(mokepon);
    }

    console.log("Servidor Funcionando");

    console.log("Jugadores:", jugadores);
    console.log("Jugador ID:", jugadorId);
    res.end();
});

// Iniciar servidor
app.listen(8080, () => {
    console.log('Servidor corriendo en el puerto 8080');
});