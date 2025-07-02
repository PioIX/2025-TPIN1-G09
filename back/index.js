var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); //Inicializo express
var port = process.env.PORT || 4002; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

app.listen(port, function () {
    console.log(`Server running in http://localhost:${port}`);
});

app.get('/usuarios', async function (req, res) {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Usuarios WHERE id_usuario=${req.query.id_usuario}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Usuarios");
    }
    res.send(respuesta);
})

app.get('/partidas', async function (req, res) {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Partidas WHERE id_partida=${req.query.id_partida}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Partidas");
    }
    res.send(respuesta);
})

app.get('/preguntas', async function (req, res) {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Preguntas WHERE id_pregunta=${req.query.id_pregunta}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Preguntas");
    }
    res.send(respuesta);
})

app.get('/respuestasPartida', async function (req, res) {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM RespuestasPartida WHERE id_respuesta_partida=${req.query.id_respuesta_partida}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM RespuestasPartida");
    }
    res.send(respuesta);
})

app.get('/respuestas', async function (req, res) {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Respuestas WHERE id_respuesta=${req.query.id_respuesta}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Respuestas");
    }
    res.send(respuesta);
})

app.post('/usuarios',async function (req, res) {
    console.log(req.body)
    try {
        
        await realizarQuery(`
        INSERT INTO Usuarios (nombre_usuario,mail,contraseña,es_admin) VALUES
            ("${req.body.nombre_usuario}","${req.body.mail}","${req.body.contraseña}","false");
        `)
        res.send({res:"Usuario agregado"})
    } catch (error) {
        res.send({res:"No se pudo agregar el usuario"})
    }
})

app.post('/partidas', function (req, res) {
    console.log(req.body)
    realizarQuery(`
    INSERT INTO Partidas ("id_partida","fecha_inicio","fecha_fin","puntaje_total","id_usuario") VALUES
        (${req.body.id_partida},"${req.body.fecha_inicio}","${req.body.fecha_fin}",${req.body.puntaje_total},${req.body.id_usuario});
    `)
    res.send("Partida agregada")
})

app.post('/preguntas', function (req, res) {
    console.log(req.body)
    realizarQuery(`
    INSERT INTO Preguntas ("id_pregunta","contenido","categoria") VALUES
        (${req.body.id_pregunta},"${req.body.contenido}","${req.body.categoria}");
    `)
    res.send("Pregunta agregada")
})

app.post('/respuestasPartida', function (req, res) {
    console.log(req.body)
    realizarQuery(`
    INSERT INTO RespuestasPartida ("id_respuesta_partida","fue_correcta","id_partida","id_pregunta","id_respuesta") VALUES
        (${req.body.id_respuesta_partida},${req.body.fue_correcta},${req.body.id_partida},${req.body.id_pregunta},${req.body.id_respuesta});
    `)
    res.send("Respuesta a Partida agregada")
})

app.post('/respuestas', function (req, res) {
    console.log(req.body)
    realizarQuery(`
    INSERT INTO Respuestas ("id_respuesta","texto","es_correcta","id_pregunta") VALUES
        (${req.body.id_respuesta},"${req.body.texto}",${req.body.es_correcta},${req.body.id_pregunta});
    `)
    res.send("Respuesta agregada")
})


app.post('/usuarioExiste', async function(req,res){
    const response = await realizarQuery(
        `SELECT mail FROM Usuarios WHERE mail = "${req.body.mail}"`
    )
    if (response.length == 0){
        res.send({res: "El usuario no existe", ok:false})
    } else {
        res.send({res:"El mail ya fue usado", ok:true})
    }
})