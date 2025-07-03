let idLogged = -1;

async function existsUser(nombre, password, mail) {
    try {
        const respuesta = await fetch('http://localhost:4000/usuarioExiste', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ usuario: nombre, contraseña: password, mail:mail }),
        });
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        return await respuesta.json();
    } catch (error) {
        alert("No se puede verificar el usuario");
        console.log(error);
        return { ok: false, error: true };
    }
}

async function conseguirID(nombre) {
    try {
        const respuesta = await fetch('http://localhost:4000/usuarioExiste', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ usuario: nombre }),
        });
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
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
        if (resultado.ok) {
            let idData = await conseguirID(nombre, mail);
            if (idData && idData.id) {
                idLogged = idData.id;
                
                let admin = await esAdmin(mail);
                console.log("Es admin:", admin);
                
                if (admin) {
                    ui.clearLoginInputs();
                    console.log("Soy admin");
                    ui.setUser(nombre);
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

async function nuevoUsuario(nombre, password, mail) {
    try{
        if (!nombre || !password || !mail) {
            alert("Todos los campos son obligatorios");
            return 0;
        }
        let result = await existsUser(nombre,password, mail);
        console.log("Verificación usuario:", result);
        if(result.ok==false && !result.error){//Esto significa q no existe el usuario
            console.log("Creando nuevo usuario");
            let datos = {
                nombre_usuario: nombre,
                contraseña: password,
                mail: mail,
            };
            const response = await fetch('http://localhost:4000/usuarios', {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(datos)
            })
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            let resultado = await response.json();
            console.log("Resultado creación: ", resultado);
            return 1;
        } else if (result.ok === true){
            return -1; //Usuario ya existe
        } else {
            return 0;
        }
    } catch(error) {
        console.log(error);
        return 0;
    }
}

async function registrarse() {
    try {
        let nombre = ui.getUser();
        let password = ui.getPassword();
        let mail = ui.getMail();
        let created = await nuevoUsuario(nombre, password, mail);
        if (created>0) {
            ui.clearLoginInputs()
            alert("Registro exitoso, inicie sesión");
        } else if (created === -1){
            ui.clearLoginInputs();
            alert("Usuario existente, intente de nuevo");
        } else {
            ui.clearLoginInputs();
            alert("Error en el registro, intente de nuevo");
        }
    } catch (error) {
        console.log(error);
        alert("Error inesperado durante el registro");
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
            div += `<label>Agregue una pregunta</label>`
            div += `<input type="text">` 
            div += `<label>Agregue la opción 1</label>`
            div += `<input type="text">` 
            div += `<label>Agregue la opción 2</label>`
            div += `<input type="text">` 
            div += `<label>Agregue la opción 3</label>`
            div += `<input type="text">`  
            break;
        case "geografia":
            div += `<label>Agregue una pregunta</label>`
            div += `<input type="text">` 
            div += `<label>Agregue la opción 1</label>`
            div += `<input type="text">` 
            div += `<label>Agregue la opción 2</label>`
            div += `<input type="text">` 
            div += `<label>Agregue la opción 3</label>`
            div += `<input type="text">` 
            break;
        case "aplicacion":
            div += `<label>Agregue la URL de la imagen</label>`
            div += `<input type="text">` 
            div += `<label>Agregue la opción 1</label>`
            div += `<input type="text">` 
            div += `<label>Agregue la opción 2</label>`
            div += `<input type="text">` 
            div += `<label>Agregue la opción 3</label>`
            div += `<input type="text">` 
            break;
        case "logos":
        default:
            div += `<label>Agregue la URL de la imagen</label>`
            div += `<input type="text">`  
        }

        document.getElementById("inputs").innerHTML = ""
        document.getElementById("inputs").innerHTML = div

}