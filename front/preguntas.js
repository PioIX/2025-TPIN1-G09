let preguntas = [];
let contadorPregunta = 0;

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
                //aca llamo a llenarPreguntaAplicacion
                break;
            case "logos":
                //aca llamo a llenarPreguntaLogos
                break;
        }
        return preguntas
    }
    else {
        return "Categoria vacia"
    }
}

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
    console.log(es_correcta)
}