let idLogged = -1;

async function existsUser(nombre, password, mail) {
    try {
        const respuesta = await fetch('http://localhost:4000/usuarioExiste', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({nombre: nombre, contraseña: password, mail:mail }),
        });
        //if (!respuesta.ok) {
        //    throw new Error(`Error HTTP: ${respuesta.status}`);
        //}
        let result = await respuesta.json()
        console.log(result)
        return result
    } catch (error) {
        alert("No se puede verificar el usuario");
        console.log(error);
        // return { ok: false, error: true };
    }
}

async function conseguirID(nombre) {
    try {
        const respuesta = await fetch('http://localhost:4000/conseguirID', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ usuario: nombre }),
        });
        //if (!respuesta.ok) {
        //    throw new Error(`Error HTTP: ${respuesta.status}`);
        //}
        return await respuesta.json();
    } catch (error) {
        alert("No se puede conseguir el ID");
        console.log(error);
        return null;
    }
}

async function esAdmin(mail) {
    try {
        const respuesta = await fetch('http://localhost:4000/esAdmin', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mail: mail }),
        });
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        let result = await respuesta.json();
        console.log("Resultado esAdmin:", result);
        if (result.length>0) {
            return result[0].es_admin == true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function ingresar() {
    try {
        let nombre = ui.getUser();
        let password = ui.getPassword();
        let mail = ui.getMail();
        if (!nombre || !password || !mail) {
            alert("Todos los campos son obligatorios");
            return;
        }
        let resultado = await existsUser(nombre, password, mail);
        console.log("Resultado login:", resultado);
        if (resultado.length > 0) {
            let idData = await conseguirID(nombre, mail);
            if (idData && idData.id) {
                idLogged = idData.id;
                
                let admin = await esAdmin(mail);
                console.log("Es admin:", admin);
                
                if (admin) {
                    ui.clearLoginInputs();
                    console.log("Soy admin");
                    ui.changeScreenAdmin();
                } else {
                    ui.clearLoginInputs();
                    console.log("No soy admin");
                    ui.changeScreen();
                }
            } else {
                alert("Error al obtener datos del usuario");
            }
        } else {
            console.log("No ha podido ingresar al juego");
            ui.clearLoginInputs();
            alert("Usuario, contraseña o mail incorrectos");
            idLogged = -1;
        }
    } catch (error) {
        console.log(error);
        alert("Error inesperado durante el ingreso");
    }
}

async function conseguirDatos(nombre, password, mail) {
    try {
        let datos = {
            nombre: nombre,
            contraseña: password,
            mail: mail,
            es_admin: 0
        }
        console.log(datos)
        return datos
    } catch (error) {
        console.log(error)
    }
}

async function nuevoUsuario(nombre, password, mail) {
    try {
        let resultado = await existsUser(nombre, password, mail)
        console.log(resultado)
        if (resultado.length == 0) {
                console.log("hola")
                let datos = await conseguirDatos(nombre, password, mail)
                const response = await fetch(`http://localhost:4000/insertarUsuario`, {
                    method: "POST", //GET, POST, PUT o DELETE
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(datos)
            })
            let result = await response.json()
            console.log(result)
            return 1
        } else {
                return -1;
            }
    } catch (error) {
        console.log(error)
    }
}

async function registrarse() {
    try {
        let nombre = ui.getUser();
        let password = ui.getPassword();
        let mail = ui.getMail();
        let created = await nuevoUsuario(nombre, password, mail)
        if (created>0) {
            ui.clearLoginInputs()
            alert("Registro exitoso, inicie sesión");
        } else {
            ui.clearLoginInputs()
            alert("Usuario existente, intente de nuevo");
        }
    } catch (error) {
        console.log(error);
    }
}

////////////////////////////////
//ADMIN HTML
////////////////////////////////

function mostrarInputs() { 
    let valor = document.getElementById("categorias").value;
    let div = ''
    switch(valor) {
        case "Historia":
            div += `
                <label>Agregue una pregunta</label>
                <input type="text" id="preguntaAgregar" placeholder="Escribe tu pregunta aquí">
                <div class="input-group">
                    <label>Agregue la opción 1</label>
                    <input type="text" id="opcion1" placeholder="Opción 1">
                    <input type="checkbox" id="check-opcion1">
                    <label for="check-opcion1">Activar</label>
                </div>
                <div class="input-group">
                    <label>Agregue la opción 2</label>
                    <input type="text" id="opcion2" placeholder="Opción 2">
                    <input type="checkbox" id="check-opcion2">
                    <label for="check-opcion2">Activar</label>
                </div>
                <div class="input-group">
                    <label>Agregue la opción 3</label>
                    <input type="text" id="opcion3" placeholder="Opción 1">
                    <input type="checkbox" id="check-opcion3">
                    <label for="check-opcion3">Activar</label>
                </div>
                <button onclick="postPregunta()">Agregar pregunta</button>
                <label>Elimine una pregunta</label>
                <input type="text" id="preguntaEliminar" placeholder="Escriba el ID de la pregunta aquí">
                <button onclick="deletePregunta()">Eliminar pregunta</button>
            `;
            break;
        case "Geografia":
            div += `
                <label>Agregue una pregunta</label>
                <input type="text" id="preguntaAgregar" placeholder="Escribe tu pregunta aquí">
                <div class="input-group">
                    <label>Agregue la opción 1</label>
                    <input type="text" id="opcion1" placeholder="Opción 1">
                    <input type="checkbox" id="check-opcion1">
                    <label for="check-opcion1">Activar</label>
                </div>
                <div class="input-group">
                    <label>Agregue la opción 2</label>
                    <input type="text" id="opcion2" placeholder="Opción 2">
                    <input type="checkbox" id="check-opcion2">
                    <label for="check-opcion2">Activar</label>
                </div>
                <div class="input-group">
                    <label>Agregue la opción 3</label>
                    <input type="text" id="opcion3" placeholder="Opción 1">
                    <input type="checkbox" id="check-opcion3">
                    <label for="check-opcion3">Activar</label>
                </div>
                <button onclick="postPregunta()">Agregar pregunta</button>
                <label>Elimine una pregunta</label>
                <input type="text" id="preguntaEliminar" placeholder="Escriba el ID de la pregunta aquí">
                <button onclick="deletePregunta()">Eliminar pregunta</button>
            `;
            break;
        case "Aplicacion":
            div += `
                <label>Agregue la URL de la imagen</label>
                <input type="text" id="preguntaAgregar" placeholder="Escribe la URL">
                <div class="input-group">
                    <label>Agregue la opción 1</label>
                    <input type="text" id="opcion1" placeholder="Opción 1">
                    <input type="checkbox" id="check-opcion1">
                    <label for="check-opcion1">Activar</label>
                </div>
                <div class="input-group">
                    <label>Agregue la opción 2</label>
                    <input type="text" id="opcion2" placeholder="Opción 2">
                    <input type="checkbox" id="check-opcion2">
                    <label for="check-opcion2">Activar</label>
                </div>
                <div class="input-group">
                    <label>Agregue la opción 3</label>
                    <input type="text" id="opcion3" placeholder="Opción 3">
                    <input type="checkbox" id="check-opcion3">
                    <label for="check-opcion3">Activar</label>
                </div>
                <button onclick="postAplicacion()">Agregar imagen</button>
                <label>Elimine una imagen</label>
                <input type="text" id="preguntaEliminar" placeholder="Escriba el ID de la imagen aquí">
                <button onclick="deletePregunta()">Eliminar imagen</button>
            `;
            break;
        case "logos":
        default:
            div += `
                <label>Agregue la URL de la imagen</label>
                <input type="text" id="preguntaAgregar">
                <label>Escriba cual será la respuesta correcta </label>
                <input type="text" id="respuestaLogos">
                <button onclick="postLogos()">Agregar imagen</button>
                <label>Elimine una imagen</label>
                <input type="text" id="preguntaEliminar" placeholder="Escriba el ID de la imagen aquí">
                <button onclick="deletePregunta()">Eliminar imagen</button>
            `;
        }

        document.getElementById("inputs").innerHTML = ""
        document.getElementById("inputs").innerHTML = div

}

async function conseguirIdPregunta(pregunta) {
    const response = await fetch(`http://localhost:4000/conseguirIdPregunta`, {
        method: "POST", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({contenido: pregunta})
    })
    let result = await response.json()
    console.log(result)
    if (result.length > 0) {
        console.log(result[0].id_pregunta)
        return result[0].id_pregunta; 
    } else {
        return -1; 
    }
}


async function datosPregunta() {
    let datos = {
        contenido: ui.getPregunta(),
        categoria: ui.getCategoria(),
    }
    return datos
}

async function datosRespuesta() {
    let pregunta = ui.getPregunta();
    let id_pregunta = await conseguirIdPregunta(pregunta);

    let respuestas = [];

    for (let i = 1; i <= 3; i++) {
        // ID del input de texto
        let inputTextoURL = document.getElementById(`opcion${i === 1 ? "1" : i === 2 ? "2" : "3"}`);
        let inputCheckbox = document.getElementById(`check-opcion${i}`);

        // Validamos que haya algo escrito
        if (inputTextoURL.value.trim() !== "") {
            respuestas.push({
                id_pregunta: id_pregunta,
                texto: null,
                es_correcta: inputCheckbox.checked,
                imagen: inputTextoURL.value.trim()
            });
        }
    }

    return respuestas;
}

async function postPregunta(){
    let datos = await datosPregunta()
    console.log(datos)
    const response = await fetch(`http://localhost:4000/subirPregunta`, {
        method: "POST", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos)
    })
    let result = await response.json()
    console.log(result)
    let respuestas = await datosRespuesta()
    for (let respuesta of respuestas) {
            const responde = await fetch("http://localhost:4000/subirRespuesta", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(respuesta)
            });
    
            let result = await responde.json();
            console.log("Respuesta subida:", result);

        }

}


          
async function deletePregunta(){
    let result = ui.getIdPreguntaEliminar()
    console.log(result)
    const response = await fetch(`http://localhost:4000/EliminarPregunta`, {
        method: "DELETE", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({id_pregunta: result})
    })
    let resultado = await response.json()
    console.log(resultado)
} 

async function conseguirPregunta(){
    const response = await fetch(`http://localhost:4000/preguntas`, {
        method: "GET", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
    })
    let result = await response.json()
    return result
}

/*async function llenarSelectPreguntaEliminar() {
    let preguntas = await conseguirPregunta()
    console.log(preguntas)
    let selectPregunta = ``
    for (let i = 0; i < preguntas.length; i++) {
    selectPregunta += `<option value="${preguntas[i].id_pregunta}">
        ${preguntas[i].id_pregunta} - ${preguntas[i].contenido}
    </option>`;
    }

    document.getElementById("selectEliminar").innerHTML += selectPregunta
}*/

function redirigirCategoria(categoria) {
    localStorage.setItem("categoria", categoria);
    location.href = categoria + ".html"
}


async function postAplicacion() {
    let datos = await datosPregunta()
    console.log(datos)
    const response = await fetch(`http://localhost:4000/subirPregunta`, {
        method: "POST", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos)
    })
    let result = await response.json()
    console.log(result)
    let respuestas = await datosRespuesta()
    for (let respuesta of respuestas) {
            const responde = await fetch("http://localhost:4000/subirRespuestaImagen", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(respuesta)
            });
    
            let result = await responde.json();
            console.log("Respuesta subida:", result);

        }
}

async function postLogos() {
    let datos = await datosPregunta()
    console.log(datos)
    const response = await fetch(`http://localhost:4000/subirPregunta`, {
        method: "POST", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos)
    })
    let result = await response.json()
    console.log(result)
    let pregunta = ui.getPregunta()
    let respuestaCorrecta = ui.getRespuestaCorrectaLogos()
    let id_pregunta = await conseguirIdPregunta(pregunta)
    let datosRespuesta = {
        texto: respuestaCorrecta,
        es_correcta: null,
        id_pregunta: id_pregunta,
        imagen: null
    }

    const responde = await fetch("http://localhost:4000/subirRespuestaLogos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosRespuesta)
            });
    
            let resultado = await responde.json();
            console.log("Respuesta subida:", resultado);

}