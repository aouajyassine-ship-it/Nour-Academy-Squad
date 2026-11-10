import { courses } from "./courses.js";
import {
    afficherErreurChamp,
    effacerErreurChamp,
    normaliserTelephone,
    validerNom,
    validerTelephone
} from "./validation.js";
import {
    chargerInscriptions,
    genererNumero,
    sauvegarderInscriptions,
    verifierInscription
} from "./inscriptions.js";

const niveauSelect = document.querySelector("#level");
const coursSelect = document.querySelector("#course");
const nomInput = document.querySelector("#student-name");
const telephoneInput = document.querySelector("#parent-phone");
const dateInput = document.querySelector("#registration-date");
const statutSelect = document.querySelector("#status");
const formulaire = document.querySelector("#form-inscription");
const messageFormulaire = document.querySelector("#form-message");
const boutonAnnuler = document.querySelector("#cancel-button");

function remplirCours(niveau) {
    coursSelect.innerHTML = '<option value="">Choisir un cours</option>';

    if (niveau === "") {
        coursSelect.innerHTML = '<option value="">Choisir d\'abord un niveau</option>';
        coursSelect.disabled = true;
        return;
    }

    const coursFiltres = courses.filter(function (cours) {
        return cours.level === niveau && cours.places > 0;
    });

    coursFiltres.forEach(function (cours) {
        const option = document.createElement("option");
        option.value = cours.id;
        option.textContent = cours.title;
        coursSelect.appendChild(option);
    });

    if (coursFiltres.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Aucun cours disponible";
        coursSelect.appendChild(option);
    }

    coursSelect.disabled = coursFiltres.length === 0;
}

function afficherMessage(message, type = "") {
    messageFormulaire.textContent = message;
    messageFormulaire.className = message
        ? `form-message ${type}`
        : "form-message";
    messageFormulaire.setAttribute("role", type === "error" ? "alert" : "status");
}

function effacerMessageErreur() {
    if (messageFormulaire.classList.contains("error")) {
        afficherMessage("");
    }
}

function effacerErreurs() {
    formulaire.querySelectorAll(".field-error").forEach(function (element) {
        element.textContent = "";
    });

    formulaire.querySelectorAll("input, select").forEach(function (champ) {
        champ.classList.remove("input-invalid");
        champ.removeAttribute("aria-invalid");
    });
}

function reinitialiserFormulaire() {
    formulaire.reset();
    coursSelect.innerHTML = '<option value="">Choisir d\'abord un niveau</option>';
    coursSelect.disabled = true;
    effacerErreurs();
    afficherMessage("");
}

niveauSelect.addEventListener("change", function () {
    remplirCours(niveauSelect.value);
    effacerErreurChamp(coursSelect);
    effacerMessageErreur();
});

coursSelect.addEventListener("change", function () {
    effacerErreurChamp(coursSelect);
});

nomInput.addEventListener("input", function () {
    effacerErreurChamp(nomInput);
    effacerMessageErreur();
});

telephoneInput.addEventListener("input", function () {
    effacerErreurChamp(telephoneInput);
    effacerMessageErreur();
});

boutonAnnuler.addEventListener("click", function () {
    reinitialiserFormulaire();
});

formulaire.addEventListener("submit", function (event) {
    event.preventDefault();

    const eleve = nomInput.value.trim().replace(/\s+/g, " ");
    const telephone = normaliserTelephone(telephoneInput.value);
    const niveau = niveauSelect.value;
    const coursSelectionne = coursSelect.options[coursSelect.selectedIndex];
    const cours = coursSelectionne && coursSelectionne.value !== ""
        ? coursSelectionne.textContent
        : "";
    const date = dateInput.value;
    const statut = statutSelect.value;

    effacerErreurs();

    let formulaireValide = true;

    const resultatNom = validerNom(eleve);

    if (!resultatNom.valide) {
        afficherErreurChamp(nomInput, resultatNom.message);
        formulaireValide = false;
    }

    const resultatTelephone = validerTelephone(telephone);

    if (!resultatTelephone.valide) {
        afficherErreurChamp(telephoneInput, resultatTelephone.message);
        formulaireValide = false;
    }

    if (niveau === "") {
        afficherErreurChamp(coursSelect, "Choisissez d'abord un niveau.");
        formulaireValide = false;
    } else if (coursSelect.disabled) {
        afficherErreurChamp(coursSelect, "Aucun cours n'est disponible pour ce niveau.");
        formulaireValide = false;
    } else if (!cours) {
        afficherErreurChamp(coursSelect, "Choisissez un cours.");
        formulaireValide = false;
    }

    if (!niveau || !date || !statut) {
        afficherMessage("Veuillez remplir tous les champs obligatoires.", "error");
        formulaireValide = false;
    }

    if (!formulaireValide) {
        const premierChampInvalide = formulaire.querySelector(".input-invalid");

        if (premierChampInvalide) {
            premierChampInvalide.focus();
        }

        return;
    }

    const inscriptions = chargerInscriptions();
    const erreur = verifierInscription(inscriptions, {
        eleve: eleve,
        cours: cours,
        niveau: niveau
    });

    if (erreur) {
        afficherErreurChamp(coursSelect, erreur);
        coursSelect.focus();
        return;
    }

    const nouvelleInscription = {
        numero: genererNumero(),
        eleve: eleve,
        niveau: niveau,
        cours: cours,
        telephone: resultatTelephone.valeur,
        statut: statut,
        date: date
    };

    inscriptions.push(nouvelleInscription);
    sauvegarderInscriptions(inscriptions);

    reinitialiserFormulaire();
    afficherMessage("Inscription enregistrée avec succès !", "success");
});

remplirCours("");
