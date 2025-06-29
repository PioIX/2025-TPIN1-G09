class UserInterface {
    constructor() {}

    getMail() {
        return document.getElementById("ingresoMail").value;
    }

    getContraseña() {
        return document.getElementById("ingresoContraseña").value;
    }

    getNombreUsuario() {
        return document.getElementById("ingresoNombreUsuario").value;
    }

    setUser(username) {
        // Asegurate de tener un <span id="loggedUsername"></span> en tu HTML
        let target = document.getElementById("loggedUsername");
        if (target) {
            target.textContent = `¡Bienvenido ${username}!`;
        }
    }

    changeScreen() {
        const notepad = document.getElementById("notepad");
        const loginForm = document.getElementById("loginForm");
        if (!notepad || !loginForm) return;

        if (notepad.style.display !== "none") {
            notepad.style.display = "none";
            loginForm.style.display = "";
            this.clearAllNotes?.();
            this.clearSelect?.();
        } else {
            notepad.style.display = "";
            loginForm.style.display = "none";
        }
    }

    showModal(title, body = "") {
        document.getElementById("modalTitle").textContent = title;
        document.getElementById("modalBody").textContent = body;

        const modalElement = document.getElementById('modal');
        const modal = new bootstrap.Modal(modalElement, {
            keyboard: true,
            focus: true
        });
        modal.show();
    }
}

const ui = new UserInterface();
window.ui = ui;