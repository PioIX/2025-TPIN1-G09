let idLogged = -1;

async function existsUser(nombre, password) {
    try {
        const respuesta = await fetch('http://localhost:4002/usuarioExiste', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ usuario: nombre, contraseña: password }),
        });
        return await respuesta.json();
    } catch (error) {
        alert("No se puede verificar el usuario");
        console.log(error);
    }
}

async function conseguirID(nombre) {
    try {
        const respuesta = await fetch('http://localhost:4002/conseguirId', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ usuario: nombre }),
        });
        return await respuesta.json();
    } catch (error) {
        alert("No se puede conseguir el ID");
        console.log(error);
    }
}

async function esAdmin(nombre) {
    try {
        const respuesta = await fetch('http://localhost:4002/esAdmin', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ usuario: nombre }),
        });
        let result = await respuesta.json()
        return result;
        if (result.length>0) {
            return result[0].es_admin;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
    }
}

async function ingresar() {
    try {
        let nombre = ui.getUser();
        let password = ui.getPassword();
        let resultado = await existsUser(nombre, password);
        if (resultado.length > 0) {
            idLogged = await conseguirID(nombre);
            let admin = await esAdmin(nombre);
            if (admin > 0) {
                ui.clearLoginInputs()
                console.log("Soy admin");
                ui.showModal("Ingreso");
                ui.setUser(nombre);
                ui.changeScreenAdmin();
            } else {
                ui.clearLoginInputs()
                console.log("No soy admin");
                ui.showModal("Ingreso");
                ui.changeScreen();
            }
        } else {
            console.log("No ha podido ingresar al juego")
            ui.clearLoginInputs();
            ui.showModal("Usuario o contraseña incorrectos");
            idLogged = -1;
        }
    } catch (error) {
        console.log(error);
    }
}

async function encontrarDatos(nombre, password) {
    try {
        let datos = {
            nombre_usuario: nombre,
            contraseña: password,
            mail: mail,
        }
        console.log(datos)
        return datos
    } catch(error){
        console.log(error);
    }
}

async function nuevoUsuario(nombre, password) {
    try{
        let result = await existsUser(nombre,password)
        console.log(result)
        if(result.length==0){
            console.log("Hola")
            let datos = await encontrarDatos(nombre, password)
            const response = await fetch('http://localhost:4002/insertarUsuario', {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(datos)
            })
            let result = await response.json()
            console.log(result)
            return 1;
        } else {
            return -1;
        }
    } catch(error) {
        console.log(error)
    }
}

async function registrarse() {
    try {
        let nombre = ui.getUser();
        let password = ui.getPassword();
        let created = await nuevoUsuario(nombre, password)
        if (created>0) {
            ui.clearLoginInputs()
            ui.showModal("Registro exitoso", "Ya podés iniciar sesión");
        } else {
            ui.clearLoginInputs()
            ui.showModal("Error", "Usuario existente");
        }
    } catch (error) {
        console.log(error);
    }
}
