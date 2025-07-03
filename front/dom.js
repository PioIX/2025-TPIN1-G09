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
        const notepad = document.getElementById("notepad");
        const loginForm = document.getElementById("loginForm");
        if (notepad.style.display !== "none") {
            notepad.style.display = "none";
            loginForm.style.display = "";
            if (typeof this.clearAllNotes === 'function') {
                this.clearAllNotes();
            }
            if (typeof this.clearSelect === 'function') {
                this.clearSelect();
            }
        }
        else {
            notepad.style.display = "";
            loginForm.style.display = "none";
        }
    }

    changeScreenAdmin() {
        const admin = document.getElementById("admin");
        const loginForm = document.getElementById("loginForm");
        const notepad = document.getElementById("notepad");
        
        if (admin) {
            admin.style.display = "";
            loginForm.style.display = "none";
            if (notepad) {
                notepad.style.display = "none";
            }
        } else {
            // Si no existe panel de admin, usar la pantalla normal
            console.log("Panel de admin no encontrado, usando pantalla normal");
            this.changeScreen();
        }
    }

    
}

const ui = new UserInterface();
