let preguntas = [];
let contadorPregunta = 0;
let contadorPreguntaAplicacion = 0;
let contadorPreguntaLogos = 0;
let puntaje = 0;
let idPreguntaLogos = 0;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function obtenerPreguntasPorCategoria() {
    let categoria = localStorage.getItem("categoria")
    console.log(categoria)
    if (categoria != undefined) {
        const response = await fetch(`http://localhost:4002/preguntasPorCategoria?categoria=` + categoria, {
            method: "GET", //GET, POST, PUT o DELETE
            headers: {
                "Content-Type": "application/json",
            },
        })
        preguntas = await response.json()
        //SI ES GEOGRAFIA O HISTORIA LLAMAR LLENARPREGUNTA
        switch(categoria) {
            case "geografia":
            case "historia":
                llenarPregunta()
                break;
            case "aplicacion":
                llenarPreguntaAplicacion()    
                break;
            case "logos":
                llenarPreguntaLogos()
                break;
        }
        return preguntas
    }
    else {
        return "Categoria vacia"
    }
}

async function llenarPreguntaAplicacion() {
    const response = await fetch(`http://localhost:4002/respuestasPorPregunta?id_pregunta=` + preguntas[contadorPreguntaAplicacion].id_pregunta, {
            method: "GET", //GET, POST, PUT o DELETE
            headers: {
                "Content-Type": "application/json",
            },
    })
    let respuestas = await response.json()
    //desordenarPreguntas(preguntas)
    console.log(respuestas)

    document.getElementById("preguntasAplicacion").innerHTML = `
        ${preguntas[contadorPreguntaAplicacion].contenido}
    `
    contadorPreguntaAplicacion++;
    document.getElementById("respuestasAplicacion").innerHTML = `
        <button id="opcion1" onclick="enviarRespuestaAplicacion(${respuestas[0].es_correcta})">
            <img src="../img_opciones/Pregunta_${contadorPreguntaAplicacion}A.JPEG" alt="">
        </button>
        <button id="opcion2" onclick="enviarRespuestaAplicacion(${respuestas[1].es_correcta})">
            <img src="../img_opciones/Pregunta_${contadorPreguntaAplicacion}B.JPEG" alt="">
        </button>
        <button id="opcion3" onclick="enviarRespuestaAplicacion(${respuestas[2].es_correcta})">
            <img src="../img_opciones/Pregunta_${contadorPreguntaAplicacion}C.JPEG" alt="">
        </button>
    `
}

async function llenarPreguntaLogos() {
    const response = await fetch(`http://localhost:4002/respuestasPorPregunta?id_pregunta=` + preguntas.id_pregunta, {
        method: "GET", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
    })
    let respuestas = await response.json()
    //desordenarPreguntas(preguntas)
    console.log(respuestas)

    document.getElementById("preguntaLogos").innerHTML = `
    ${preguntas[0].contenido}
`
    let res = await fetch(`http://localhost:4002/preguntasLogos` , {
        method: "GET", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
    })
    let rtas = await res.json()
    rtas.splice(0, 1)
    console.log(rtas)
    document.getElementById("imagenLogos").src = ".." + rtas[contadorPreguntaLogos].contenido
    idPreguntaLogos = rtas[contadorPreguntaLogos].id_pregunta
    contadorPreguntaLogos ++;
}

/**
 *  Tarea: Hacer funcion para la respuestade logos
 * Al presionar el boton 
 * Mandar un fetch con el id_pregunta y ver cual es la respuesta correcta (fetch(`http://localhost:4002/respuestasPorPregunta?id_pregunta=` + idPreguntaLogos)
 * Hacer un if quecompare la respuesta del back con lo q puso el usuario en el input
 * Hacer un alert si esta bien o mal
 * Avanzar de pregunta, que seria llamar otra vez a llenarPreguntaLogos()
 */

async function llenarPregunta() {
    const response = await fetch(`http://localhost:4002/respuestasPorPregunta?id_pregunta=` + preguntas[contadorPregunta].id_pregunta, {
            method: "GET", //GET, POST, PUT o DELETE
            headers: {
                "Content-Type": "application/json",
            },
    })
    let respuestas = await response.json()
    //desordenarPreguntas(preguntas)
    console.log(respuestas)
    
    document.getElementById("preguntas").innerHTML = `
        ${preguntas[contadorPregunta].contenido}
    `

    document.getElementById("respuestas").innerHTML = `
        <button id="opcion1" onclick="enviarRespuesta(${respuestas[0].es_correcta})">${respuestas[0].texto}</button>
        <button id="opcion2" onclick="enviarRespuesta(${respuestas[1].es_correcta})">${respuestas[1].texto}</button>
        <button id="opcion3" onclick="enviarRespuesta(${respuestas[2].es_correcta})">${respuestas[2].texto}</button>
    `
    contadorPregunta++;
}

function enviarRespuesta(es_correcta) {
    if (es_correcta){
        document.getElementById("seccionJuego").innerHTML = `
            <h3 id="preguntas"></h3>
            <div class="multiple-choice" id="respuestas">

            </div>
            
            <a href="categorias.html"><button class="boton-escape">Escape</button></a>
        `
        llenarPregunta()
        puntaje += 1
        console.log(puntaje)
    } else {
        alert("Respuesta Incorrecta")
        document.getElementById("seccionJuego").innerHTML = `
            <h3 id="preguntas"></h3>
            <div class="multiple-choice" id="respuestas">

            </div>
            
            <a href="categorias.html"><button class="boton-escape">Escape</button></a>
        `
        llenarPregunta()
        console.log(puntaje)
    }
}

