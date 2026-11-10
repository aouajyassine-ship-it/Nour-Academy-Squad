import { courses } from "./courses.js";
import {
    afficherErreurChamp,
    effacerErreurChamp,
    normaliserTelephone,
    validerNom,
    validerTelephone
} from "./validation.js";
import {
    lireInscriptionsStockees,
    sauvegarderInscriptions,
    trouverIndexInscription,
    verifierInscription
} from "./inscriptions.js";

const noms = [
    "Sara El Amrani",
    "Adam Bennis",
    "Imane Alaoui",
    "Youssef Karim",
    "Salma Naji",
    "Hamza Idrissi",
    "Aya Mansouri",
    "Anas Tazi",
    "Meryem Fassi",
    "Omar Chraibi",
    "Nour Benali",
    "Mehdi Saidi",
    "Lina Haddad",
    "Rayan Amine",
    "Hiba Othmani",
    "Ilyas Boulahya",
    "Malak Rami",
    "Amine Ziani",
    "Ghita Saad",
    "Bilal Azzouzi"
];

const coursDisponibles = courses.filter(function (cours) {
    return cours.places > 0;
});

const inscriptionsInitiales = [];
for (let i = 0; i < 20; i++) {
    const cours = coursDisponibles[i % coursDisponibles.length];
    inscriptionsInitiales.push({
        numero: "NOUR-" + String(i + 1).padStart(3, "0"),
        eleve: noms[i],
        niveau: cours.level,
        cours: cours.title,
        telephone: "06000000" + String(i + 1).padStart(2, "0"),
        statut: ["En attente", "Validée", "Payée"][i % 3],
        date: "2026-10-" + String((i % 28) + 1).padStart(2, "0")
    });
}

// Charger les inscriptions sauvegardées. Les données de démonstration
// ne sont créées qu'à la première visite (et non après une liste vidée).
let inscriptions = lireInscriptionsStockees();

if (inscriptions === null) {
    inscriptions = inscriptionsInitiales;
    sauvegarderInscriptions(inscriptions);
}

const filtreStatut = document.querySelector("#Status");
const filtreTri = document.querySelector("#Date-Nom");
const tableau = document.querySelector("#liste-inscriptions");
const messageGlobal = document.querySelector("#message-inscriptions");

const modalModification = document.querySelector("#modal-modification");
const formulaireModification = document.querySelector("#form-modification");
const nomModification = document.querySelector("#edit-student-name");
const niveauModification = document.querySelector("#edit-level");
const coursModification = document.querySelector("#edit-course");
const telephoneModification = document.querySelector("#edit-parent-phone");
const dateModification = document.querySelector("#edit-registration-date");
const statutModification = document.querySelector("#edit-status");
const erreurModification = document.querySelector("#edit-form-error");
const boutonAnnulerModification = document.querySelector("#edit-cancel");
const boutonFermerModification = document.querySelector("#edit-close");

let inscriptionEnModification = null;
let minuterieMessage = null;

function echapperHtml(valeur) {
    return String(valeur).replace(/[&<>"']/g, function (caractere) {
        const correspondances = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        return correspondances[caractere];
    });
}

function filtrerEtTrierInscriptions() {
    const statutChoisi = filtreStatut.value;
    const triChoisi = filtreTri.value;

    const resultat = inscriptions.filter(function (inscription) {
        if (statutChoisi === "") {
            return true;
        }
        return inscription.statut === statutChoisi;
    });

    if (triChoisi === "date-recent") {
        resultat.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
    } else if (triChoisi === "date-ancien") {
        resultat.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        });
    } else if (triChoisi === "nom-az") {
        resultat.sort(function (a, b) {
            return a.eleve.localeCompare(b.eleve);
        });
    } else if (triChoisi === "nom-za") {
        resultat.sort(function (a, b) {
            return b.eleve.localeCompare(a.eleve);
        });
    }

    return resultat;
}

// Afficher les inscriptions
function afficherInscriptions() {
    tableau.innerHTML = "";

    const inscriptionsAffichees = filtrerEtTrierInscriptions();

    if (inscriptionsAffichees.length === 0) {
        tableau.innerHTML = `
            <tr>
                <td colspan="8" class="empty-row">Aucune inscription trouvée.</td>
            </tr>
        `;
        return;
    }

    tableau.innerHTML = inscriptionsAffichees.map(function (inscription) {
        return `
            <tr>
                <td>${echapperHtml(inscription.numero)}</td>
                <td>${echapperHtml(inscription.eleve)}</td>
                <td>${echapperHtml(inscription.niveau)}</td>
                <td>${echapperHtml(inscription.cours)}</td>
                <td>${echapperHtml(inscription.telephone)}</td>
                <td>${echapperHtml(inscription.statut)}</td>
                <td>${echapperHtml(inscription.date)}</td>
                <td>
                    <button type="button" class="table-action modifier" data-action="modifier" data-numero="${echapperHtml(inscription.numero)}">
                        Modifier
                    </button>
                    <button type="button" class="table-action supprimer" data-action="supprimer" data-numero="${echapperHtml(inscription.numero)}">
                        Supprimer
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function afficherMessageGlobal(message, type) {
    if (!messageGlobal) {
        return;
    }

    messageGlobal.textContent = message;
    messageGlobal.className = `message-global ${type}`;

    clearTimeout(minuterieMessage);
    minuterieMessage = setTimeout(function () {
        messageGlobal.textContent = "";
        messageGlobal.className = "message-global";
    }, 4000);
}

// Supprimer une inscription
function supprimerInscription(numero) {
    const index = trouverIndexInscription(inscriptions, numero);

    if (index === -1) {
        return;
    }

    const confirmation = confirm("Supprimer cette inscription ?");

    if (confirmation) {
        inscriptions.splice(index, 1);
        sauvegarderInscriptions(inscriptions);
        afficherInscriptions();
        afficherMessageGlobal("Inscription supprimée.", "success");
    }
}

function remplirCoursModification(niveau, coursSelectionne = "") {
    coursModification.innerHTML = '<option value="">Choisir un cours</option>';

    if (niveau === "") {
        coursModification.disabled = true;
        return;
    }

    const inscription = inscriptionEnModification;

    const coursFiltres = courses.filter(function (cours) {
        const estLeCoursActuel = inscription !== null &&
            niveau === inscription.niveau &&
            cours.title === inscription.cours;

        return cours.level === niveau && (cours.places > 0 || estLeCoursActuel);
    });

    coursFiltres.forEach(function (cours) {
        const option = document.createElement("option");
        option.value = cours.id;
        option.textContent = cours.title;

        if (cours.title === coursSelectionne) {
            option.selected = true;
        }

        coursModification.appendChild(option);
    });

    if (coursFiltres.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Aucun cours disponible";
        coursModification.appendChild(option);
    }

    coursModification.disabled = coursFiltres.length === 0;
}

function effacerErreursModification() {
    formulaireModification.querySelectorAll(".field-error, .form-error").forEach(function (element) {
        element.textContent = "";
    });

    formulaireModification.querySelectorAll("input, select").forEach(function (champ) {
        champ.classList.remove("input-invalid");
        champ.removeAttribute("aria-invalid");
    });
}

function ouvrirModaleModification(numero) {
    const inscription = inscriptions.find(function (element) {
        return element.numero === numero;
    });

    if (!inscription || !modalModification) {
        return;
    }

    inscriptionEnModification = inscription;

    nomModification.value = inscription.eleve;
    telephoneModification.value = inscription.telephone;
    dateModification.value = inscription.date;
    niveauModification.value = inscription.niveau;
    statutModification.value = inscription.statut;

    effacerErreursModification();
    remplirCoursModification(inscription.niveau, inscription.cours);

    modalModification.showModal();
    nomModification.focus();
}

function fermerModaleModification() {
    if (modalModification.open) {
        modalModification.close();
    }

    formulaireModification.reset();
    effacerErreursModification();
    inscriptionEnModification = null;
}

// Conserve le nom utilisé par les boutons du tableau.
function modifierInscription(numero) {
    ouvrirModaleModification(numero);
}

niveauModification.addEventListener("change", function () {
    const coursActuel = inscriptionEnModification !== null &&
        niveauModification.value === inscriptionEnModification.niveau
        ? inscriptionEnModification.cours
        : "";

    remplirCoursModification(niveauModification.value, coursActuel);
    effacerErreurChamp(coursModification);
    erreurModification.textContent = "";
});

coursModification.addEventListener("change", function () {
    effacerErreurChamp(coursModification);
});

nomModification.addEventListener("input", function () {
    effacerErreurChamp(nomModification);
});

telephoneModification.addEventListener("input", function () {
    effacerErreurChamp(telephoneModification);
});

boutonAnnulerModification.addEventListener("click", function () {
    fermerModaleModification();
});

boutonFermerModification.addEventListener("click", function () {
    fermerModaleModification();
});

// Fermer la modale en cliquant sur le fond.
modalModification.addEventListener("click", function (event) {
    if (event.target === modalModification) {
        fermerModaleModification();
    }
});

// Fermer la modale avec la touche Échap.
modalModification.addEventListener("cancel", function (event) {
    event.preventDefault();
    fermerModaleModification();
});

formulaireModification.addEventListener("submit", function (event) {
    event.preventDefault();

    if (inscriptionEnModification === null) {
        return;
    }

    const eleve = nomModification.value.trim().replace(/\s+/g, " ");
    const telephone = normaliserTelephone(telephoneModification.value);
    const niveau = niveauModification.value;
    const coursSelectionne = coursModification.options[coursModification.selectedIndex];
    const cours = coursSelectionne && coursSelectionne.value !== ""
        ? coursSelectionne.textContent
        : "";
    const date = dateModification.value;
    const statut = statutModification.value;

    effacerErreursModification();

    let formulaireValide = true;

    const resultatNom = validerNom(eleve);

    if (!resultatNom.valide) {
        afficherErreurChamp(nomModification, resultatNom.message);
        formulaireValide = false;
    }

    const resultatTelephone = validerTelephone(telephone);

    if (!resultatTelephone.valide) {
        afficherErreurChamp(telephoneModification, resultatTelephone.message);
        formulaireValide = false;
    }

    if (!niveau) {
        afficherErreurChamp(coursModification, "Choisissez d'abord un niveau.");
        formulaireValide = false;
    } else if (!cours) {
        afficherErreurChamp(coursModification, "Choisissez un cours.");
        formulaireValide = false;
    }

    if (!niveau || !date || !statut) {
        erreurModification.textContent = "Veuillez remplir tous les champs obligatoires.";
        formulaireValide = false;
    }

    if (!formulaireValide) {
        const premierChampInvalide = formulaireModification.querySelector(".input-invalid");

        if (premierChampInvalide) {
            premierChampInvalide.focus();
        }

        return;
    }

    const erreur = verifierInscription(
        inscriptions,
        { eleve: eleve, cours: cours, niveau: niveau },
        inscriptionEnModification.numero
    );

    if (erreur) {
        afficherErreurChamp(coursModification, erreur);
        coursModification.focus();
        return;
    }

    const index = trouverIndexInscription(inscriptions, inscriptionEnModification.numero);

    if (index === -1) {
        erreurModification.textContent = "Inscription introuvable. Rechargez la page.";
        return;
    }

    inscriptions[index] = {
        ...inscriptions[index],
        eleve: eleve,
        niveau: niveau,
        cours: cours,
        telephone: resultatTelephone.valeur,
        date: date,
        statut: statut
    };

    sauvegarderInscriptions(inscriptions);
    afficherInscriptions();
    fermerModaleModification();
    afficherMessageGlobal("Inscription modifiée avec succès.", "success");
});

// Délégation d'événements : les fonctions d'un module ne sont pas globales,
// donc on évite les attributs onclick dans le tableau.
tableau.addEventListener("click", function (event) {
    const bouton = event.target.closest("button[data-action]");

    if (!bouton) {
        return;
    }

    const numero = bouton.dataset.numero;

    if (bouton.dataset.action === "modifier") {
        modifierInscription(numero);
    } else if (bouton.dataset.action === "supprimer") {
        supprimerInscription(numero);
    }
});

filtreStatut.addEventListener("change", afficherInscriptions);
filtreTri.addEventListener("change", afficherInscriptions);

afficherInscriptions();
