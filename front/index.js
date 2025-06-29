let idLogged = -1;

async function existsUser(nombre, password) {
    try {
        const respuesta = await fetch('http://localhost:4001/usuarioExiste', {
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
        const respuesta = await fetch('http://localhost:4001/conseguirId', {
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
        const respuesta = await fetch('http://localhost:4001/esAdmin', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ usuario: nombre }),
        });
        return await respuesta.json();
    } catch (error) {
        console.log("No se pudo verificar si es admin");
        return 0;
    }
}

async function ingresar() {
    let nombre = ui.getNombreUsuario();
    let password = ui.getContraseña();
    let resultado = await existsUser(nombre, password);

    if (resultado && resultado.length > 0) {
        idLogged = await conseguirID(nombre);
        let admin = await esAdmin(nombre);

        if (admin > 0) {
            console.log("Soy admin");
            // ui.setUser(nombre);
            // ui.changeScreenAdmin();
        } else {
            console.log("No soy admin");
            // ui.setUser(nombre);
            // ui.changeScreen();
        }
    } else {
        ui.showModal("Usuario o contraseña incorrectos");
        idLogged = -1;
    }
}

async function registrarse() {
    let mail = ui.getMail();
    let nombre = ui.getNombreUsuario();
    let password = ui.getContraseña();

    try {
        const respuesta = await fetch("http://localhost:4001/registrarUsuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mail: mail, usuario: nombre, contraseña: password }),
        });
        const result = await respuesta.json();
        if (result.success) {
            ui.showModal("Registro exitoso", "Ya podés iniciar sesión");
        } else {
            ui.showModal("Error", "No se pudo registrar el usuario");
        }
    } catch (error) {
        console.log(error);
        ui.showModal("Error", "Falló el registro");
    }
}
