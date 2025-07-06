let idLogged = -1;

async function existsUser(nombre, password, mail) {
    try {
        const respuesta = await fetch('http://localhost:4002/usuarioExiste', {
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
        const respuesta = await fetch('http://localhost:4002/conseguirID', {
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
        const respuesta = await fetch('http://localhost:4002/esAdmin', {
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
                    ui.setUser(nombre);
                    // ui.changeScreenAdmin();
                } else {
                    ui.clearLoginInputs();
                    console.log("No soy admin");
                    // ui.changeScreen();
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
                const response = await fetch(`http://localhost:4002/insertarUsuario`, {
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
        case "historia":
            div += `
                <label>Agregue una pregunta</label>
                <input type="text" placeholder="Escribe tu pregunta aquí">
                <div class="input-group">
                    <label>Agregue la opción 1</label>
                    <input type="text" placeholder="Opción 1">
                    <input type="checkbox" id="check-opcion1-historia">
                    <label for="check-opcion1-historia">Activar</label>
                </div>
                <div class="input-group">
                    <label>Agregue la opción 2</label>
                    <input type="text" placeholder="Opción 2">
                    <input type="checkbox" id="check-opcion2-historia">
                    <label for="check-opcion2-historia">Activar</label>
                </div>
                <div class="input-group">
                    <label>Agregue la opción 3</label>
                    <input type="text" placeholder="Opción 1">
                    <input type="checkbox" id="check-opcion3-historia">
                    <label for="check-opcion3-historia">Activar</label>
                </div>
            `;
            break;
        case "geografia":
            div += `
                <label>Agregue una pregunta</label>
                <input type="text" placeholder="Escribe tu pregunta aquí">
                <div class="input-group">
                    <label>Agregue la opción 1</label>
                    <input type="text" placeholder="Opción 1">
                    <input type="checkbox" id="check-opcion1-geografia">
                    <label for="check-opcion1-geografia">Activar</label>
                </div>
                <div class="input-group">
                    <label>Agregue la opción 2</label>
                    <input type="text" placeholder="Opción 2">
                    <input type="checkbox" id="check-opcion2-geografia">
                    <label for="check-opcion2-geografia">Activar</label>
                </div>
                <div class="input-group">
                    <label>Agregue la opción 3</label>
                    <input type="text" placeholder="Opción 1">
                    <input type="checkbox" id="check-opcion3-geografia">
                    <label for="check-opcion3-geografia">Activar</label>
                </div>
            `;
            break;
        case "aplicacion":
            div += `
                <label>Agregue la URL de la imagen</label>
                <input type="text" placeholder="Escribe la URL">
                <div class="input-group">
                    <label>Agregue la opción 1</label>
                    <input type="text" placeholder="Opción 1">
                    <input type="checkbox" id="check-opcion1-aplicacion">
                    <label for="check-opcion1-aplicacion">Activar</label>
                </div>
                <div class="input-group">
                    <label>Agregue la opción 2</label>
                    <input type="text" placeholder="Opción 2">
                    <input type="checkbox" id="check-opcion2-aplicacion">
                    <label for="check-opcion2-aplicacion">Activar</label>
                </div>
                <div class="input-group">
                    <label>Agregue la opción 3</label>
                    <input type="text" placeholder="Opción 3">
                    <input type="checkbox" id="check-opcion3-aplicacion">
                    <label for="check-opcion3-aplicacion">Activar</label>
                </div>
            `;
            break;
        case "logos":
        default:
            div += `<label>Agregue la URL de la imagen</label>`
            div += `<input type="text">`  
        }

        document.getElementById("inputs").innerHTML = ""
        document.getElementById("inputs").innerHTML = div

}