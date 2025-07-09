class UserInterface {
    constructor() {

    }

    getMail() {
        return document.getElementById("ingresoMail").value;
    }

    getUser() {
        return document.getElementById("ingresoNombreUsuario").value;
    }

    setUser(username) {
        const welcomeElement = document.getElementById("welcomeMessage");
        if (welcomeElement) {
            welcomeElement.innerHTML = `¡Bienvenido ${username}!`;
            return;
        }
    }

    getPassword() {
        return document.getElementById("ingresoContraseña").value;
    }

    clearLoginInputs() {
        document.getElementById("ingresoContraseña").value = "";
        document.getElementById("ingresoNombreUsuario").value = "";
        document.getElementById("ingresoMail").value = "";
    }

    changeScreen() {
        try {
            location.assign("./categorias.html");
            console.log("location.assign ejecutado");
        } catch (error) {
            console.error("Error con location.assign:", error);
            // Alternativa
            window.location.href = "html/categorias.html";
        }
    }

    changeScreenAdmin() {
        try {
            location.assign("./admin.html");
            console.log("location.assign ejecutado");
        } catch (error) {
            console.error("Error con location.assign:", error);
            // Alternativa
            window.location.href = "html/admin.html";
        }
    }

    
}

const ui = new UserInterface();
