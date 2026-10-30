console.log("script.js khdam");
console.log("courses:", typeof courses);
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
if (inscriptions === null || inscriptions.length === 0) {
    inscriptions = inscriptionsInitiales;
    localStorage.setItem(
        "inscriptions",
        JSON.stringify(inscriptions)
    );
}
const filtreStatut = document.querySelector("#Status");
const filtreTri = document.querySelector("#Date-Nom");

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
    const tableau = document.querySelector("#liste-inscriptions");
    tableau.innerHTML = "";
    const inscriptionsAffichees = filtrerEtTrierInscriptions();
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
                <td class = "m-s-button">
                    <button class = "m-button" onclick="modifierInscription('${inscription.numero}')">
                        Modifier
                    </button>
                    <button class = "s-button" onclick="supprimerInscription('${inscription.numero}')">
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
filtreStatut.addEventListener("change", afficherInscriptions);
filtreTri.addEventListener("change", afficherInscriptions);

afficherInscriptions();
