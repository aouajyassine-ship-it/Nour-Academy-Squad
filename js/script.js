const searchInput = document.querySelector("#recherche");
const statusFilter = document.querySelector("#Status");
const sortSelect = document.querySelector("#Date-Nom");
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
// Charger les inscriptions sauvegardées
let inscriptions = JSON.parse(
    localStorage.getItem("inscriptions")
);

// Première initialisation
if (inscriptions === null) {
    inscriptions = inscriptionsInitiales;
    localStorage.setItem(
        "inscriptions",
        JSON.stringify(inscriptions)
    );
}
// Afficher les inscriptions
function afficherInscriptions() {
    const tableau = document.querySelector("#liste-inscriptions");
    tableau.innerHTML = "";
    const resultatsRecherche = rechercherInscriptions(inscriptions, searchInput.value);
    const resultatsStatut = filtrerParStatut(resultatsRecherche, statusFilter.value);
    const inscriptionsAffichees = trierInscriptions(resultatsStatut, sortSelect.value);
    inscriptionsAffichees.forEach(function (inscription) {
        tableau.innerHTML += `
            <tr>
                <td>${inscription.numero}</td>
                <td>${inscription.eleve}</td>
                <td>${inscription.niveau}</td>
                <td>${inscription.cours}</td>
                <td>${inscription.telephone}</td>
                <td>${inscription.statut}</td>
                <td>${inscription.date}</td>
                <td>
                    <button onclick="modifierInscription('${inscription.numero}')">
                        Modifier
                    </button>
                    <button onclick="supprimerInscription('${inscription.numero}')">
                        Supprimer
                    </button>
                </td>
            </tr>
        `;
    });
}
// Sauvegarder les inscriptions
function sauvegarderInscriptions() {
    localStorage.setItem(
        "inscriptions",
        JSON.stringify(inscriptions)
    );
}
function trouverIndexInscription(numero) {
    let indexTrouve = -1;
    inscriptions.forEach(function (inscription, index) {
        if (inscription.numero === numero) {
            indexTrouve = index;
        }
    });
    return indexTrouve;
}
// Supprimer une inscription
function supprimerInscription(numero) {
    const index = trouverIndexInscription(numero);
    if (index === -1) {
        return;
    }
    const confirmation = confirm(
        "Supprimer cette inscription ?"
    );
    if (confirmation) {
        inscriptions.splice(index, 1);

        sauvegarderInscriptions();
        afficherInscriptions();
    }
}
// Modifier une inscription
function modifierInscription(numero) {
    const index = trouverIndexInscription(numero);
    if (index === -1) {
        return;
    }
    const nouveauNom = prompt(
        "Nom de l'élève :",
        inscriptions[index].eleve
    );
    if (nouveauNom !== null && nouveauNom.trim() !== "") {
        inscriptions[index].eleve = nouveauNom.trim();

        sauvegarderInscriptions();
        afficherInscriptions();
    }
}
function rechercherInscriptions(liste, recherche) {
    const texte = recherche.trim().toLowerCase();

    return liste.filter(function (inscription) {
        return inscription.eleve.toLowerCase().includes(texte)
            || inscription.telephone.includes(texte);
    });
}

afficherInscriptions();

searchInput.addEventListener("input", function () {
    afficherInscriptions();
});

function filtrerParStatut(liste, statut) {
    return liste.filter(function (inscription) {
        return statut === "" || inscription.statut === statut;
    });
}

statusFilter.addEventListener("change", function () {
    afficherInscriptions();
});

function convertirDate(date) {
    if (date.includes("/")) {
        const [jour, mois, annee] = date.split("/");
        return Date.UTC(Number(annee), Number(mois) - 1, Number(jour));
    }

    const [annee, mois, jour] = date.split("-");
    return Date.UTC(Number(annee), Number(mois) - 1, Number(jour));
}

function trierInscriptions(liste, tri) {
    const copie = [...liste];

    copie.sort(function (a, b) {
        if (tri === "date-desc") {
            return convertirDate(b.date) - convertirDate(a.date);
        }

        if (tri === "date-asc") {
            return convertirDate(a.date) - convertirDate(b.date);
        }

        if (tri === "name-asc") {
            return a.eleve.localeCompare(b.eleve, "fr", {
                sensitivity: "base"
            });
        }

        if (tri === "name-desc") {
            return b.eleve.localeCompare(a.eleve, "fr", {
                sensitivity: "base"
            });
        }

        return 0;
    });

    return copie;
}
sortSelect.addEventListener("change", function () {
    afficherInscriptions();
});
