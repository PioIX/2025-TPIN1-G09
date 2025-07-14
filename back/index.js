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
});

app.get('/partidas', async function (req, res) {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Partidas WHERE id_partida=${req.query.id_partida}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Partidas");
    }
    res.send(respuesta);
});

app.get('/preguntas', async function (req, res) {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Preguntas WHERE id_pregunta=${req.query.id_pregunta}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Preguntas");
    }
    res.send(respuesta);
});

app.get('/respuestasPartida', async function (req, res) {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM RespuestasPartida WHERE id_respuesta_partida=${req.query.id_respuesta_partida}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM RespuestasPartida");
    }
    res.send(respuesta);
});

app.get('/respuestas', async function (req, res) {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Respuestas WHERE id_respuesta=${req.query.id_respuesta}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Respuestas");
    }
    res.send(respuesta);
});

app.post('/usuarios',async function (req, res) {
    console.log(req.body);
    try {
        await realizarQuery(`
        INSERT INTO Usuarios (nombre_usuario, mail, contraseña, es_admin) VALUES
            ("${req.body.nombre_usuario}","${req.body.mail}","${req.body.contraseña}","false");
        `);
        res.send({res:"Usuario agregado"});
    } catch (error) {
        console.log("Error al agregar usuario:", error);
        res.status(500).send({res:"No se pudo agregar el usuario"});
    }
});

app.post('/partidas', async function (req, res) {
    console.log(req.body)
    try {
        await realizarQuery(`
        INSERT INTO Partidas (id_partida, fecha_inicio, fecha_fin, puntaje_total, id_usuario) VALUES
        (${req.body.id_partida},"${req.body.fecha_inicio}","${req.body.fecha_fin}",${req.body.puntaje_total},${req.body.id_usuario});
        `);
        res.send("Partida agregada");
    } catch (error) {
    console.log("Error al agregar partida:", error);
    res.status(500).send("Error al agregar partida");
    }
});

app.post('/preguntas', async function (req, res) {
    console.log(req.body)
    try{
        await realizarQuery (`INSERT INTO Preguntas ("id_pregunta","contenido","categoria") VALUES
        (${req.body.id_pregunta},"${req.body.contenido}","${req.body.categoria}");`);
        res.send("Pregunta agregada");
    } catch(error){
        console.log("Error al agregar pregunta:",error);
        res.status(500).send("Error al agregar pregunta");
    }
});

app.post('/respuestasPartida', async function (req, res) {
    console.log(req.body)
    try {
        await realizarQuery (`INSERT INTO RespuestasPartida ("id_respuesta_partida","fue_correcta","id_partida","id_pregunta","id_respuesta") VALUES
        (${req.body.id_respuesta_partida},${req.body.fue_correcta},${req.body.id_partida},${req.body.id_pregunta},${req.body.id_respuesta});`);
        res.send("Respuesta a Partida agregada");
    } catch (error){
        console.log("Error alagregar respuesta partida:", error);
        res.status(500).send("Error al agregar respuesta partida");
    }
});

app.post('/respuestas', async function (req, res) {
    console.log(req.body)
    try {
        await  realizarQuery(`INSERT INTO Respuestas ("id_respuesta","texto","es_correcta","id_pregunta") VALUES
        (${req.body.id_respuesta},"${req.body.texto}",${req.body.es_correcta},${req.body.id_pregunta});`);
        res.send("Respuesta agregada");
    } catch (error) {
        console.log("Error al agregar respuesta:", error);
        res.status(500).send("Error al agregar respuesta");
    } 
});

app.post('/usuarioExiste', async function(req,res){
    try {
        console.log("Recibido:", req.body.nombre, req.body.contraseña, req.body.mail);
        const usuario = await realizarQuery(`
            SELECT * FROM Usuarios WHERE nombre = '${req.body.nombre}' and contraseña = '${req.body.contraseña}' and mail = '${req.body.mail}'
        `)
        console.log(usuario)
        res.send(usuario)
    } catch (error) {
        console.log(error)
    }
})

app.post('/conseguirID', async function(req, res) {
    try {
        const respuesta = await realizarQuery(`SELECT id_usuario FROM Usuarios WHERE nombre = "${req.body.usuario}"`);
        if (respuesta.length > 0) {
            res.send({id: respuesta[0].id_usuario});
        } else {
            res.status(404).send({error: "Usuario no encontrado"});
        }
        } catch (error) {
            console.log("Error al conseguir ID:", error);
            res.status(500).send({error: "Error del servidor"});
    }
   });
    

app.post('/esAdmin', async function(req, res) {
    try {
        const respuesta = await realizarQuery(`SELECT es_admin FROM Usuarios WHERE mail = '${req.body.mail}'`);
        console.log("Resultado esAdmin:", respuesta);
        res.send(respuesta);
    } catch (error) {
        console.log("Error en esAdmin:", error);
        res.status(500).send({error: "Error del servidor"});
    }
});

app.post('/insertarUsuario', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            INSERT INTO Usuarios (nombre, mail, contraseña, es_admin)
            VALUES ('${req.body.nombre}','${req.body.mail}','${req.body.contraseña}','${req.body.es_admin}')
        `)
        res.send({mensaje: "Se inserto el Usuario, Haga el Login"})
    } catch (error) {
        console.log(error)
    }
});

app.post('/subirPregunta', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            INSERT INTO Preguntas (contenido, categoria)
            VALUES ('${req.body.contenido}','${req.body.categoria}')
        `)
        res.send({mensaje: "Se insertó la pregunta"})
    } catch (error) {
        console.log(error)
    }
});

app.post('/subirPreguntaGeografia', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            INSERT INTO Preguntas (contenido, categoria)
            VALUES ('${req.body.contenido}','Geografía')
        `)
        res.send({mensaje: "Se insertó la pregunta"})
    } catch (error) {
        console.log(error)
    }
});

app.post('/subirImagenAplicacion', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            INSERT INTO Preguntas (contenido, categoria)
            VALUES ('${req.body.contenido}','Aplicación')
        `)
        res.send({mensaje: "Se insertó la pregunta"})
    } catch (error) {
        console.log(error)
    }
});

app.post('/subirImagenAplicacion', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            INSERT INTO Preguntas (contenido, categoria)
            VALUES ('${req.body.contenido}','Aplicación')
        `)
        res.send({mensaje: "Se insertó la pregunta"})
    } catch (error) {
        console.log(error)
    }
});

app.post('/respuestas', async function (req, res) {
    console.log(req.body)
    try {
        await  realizarQuery(`INSERT INTO Respuestas ("id_respuesta","texto","es_correcta","id_pregunta") VALUES
        (${req.body.id_respuesta},"${req.body.texto}",${req.body.es_correcta},${req.body.id_pregunta});`);
        res.send("Respuesta agregada");
    } catch (error) {
        console.log("Error al agregar respuesta:", error);
        res.status(500).send("Error al agregar respuesta");
    } 
});

app.delete('/EliminarPregunta', async function(req,res){
    try {
        const result = await realizarQuery(`
            DELETE FROM Respuestas WHERE id_pregunta = ${req.body.id_pregunta}    
        `)
        const respuesta = await realizarQuery(`
            DELETE FROM Preguntas WHERE id_pregunta = ${req.body.id_pregunta}
        `)
        res.send({mensaje: "Se Elimino la pregunta"})
    } catch (error) {
        console.log(error)
    }
});


app.post('/conseguirIdPregunta', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            SELECT id_pregunta FROM Preguntas WHERE contenido = '${req.body.contenido}'    
        `)
        console.log(respuesta)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

app.post('/subirRespuesta', async function(req,res){
    try {
        const respuesta = await realizarQuery(`
            INSERT INTO Respuestas (texto, es_correcta, id_pregunta)
            VALUES ('${req.body.texto}',${req.body.es_correcta},${req.body.id_pregunta})
        `)
        res.send({mensaje: "Se insertó la respuesta"})
    } catch (error) {
        console.log(error)
    }
})

app.get('/preguntas', async function(req, res){
    try {
        console.log(req.query);
        const preguntas = await realizarQuery(`
        SELECT * FROM Preguntas;
        `)
        console.log({preguntas})
        res.send(preguntas)
    } catch (error) {
        console.log(error)
    }
})


app.get('/preguntasPorCategoria', async function(req,res) {
    try {
        const respuesta = await realizarQuery(`
            SELECT * FROM Preguntas WHERE categoria = '${req.query.categoria}' 
        `)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

app.get('/respuestasPorPregunta', async function(req,res) {
    try {
        const respuesta = await realizarQuery(`
            SELECT * FROM Respuestas WHERE id_pregunta = '${req.query.id_pregunta}' 
        `)
        res.send(respuesta)
    } catch (error) {
        console.log(error)
    }
})
