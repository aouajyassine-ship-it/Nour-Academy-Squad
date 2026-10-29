const searchInput = document.querySelector("#recherche");
const statusFilter = document.querySelector("#Status");
const sortSelect = document.querySelector("#Date-Nom");

const inscriptionsInitiales = [
    {
        numero: "NOUR-001",
        eleve: "Sara El Amrani",
        niveau: "1ère Bac",
        cours: "Mathématiques",
        telephone: "0612345678",
        statut: "En attente",
        date: "27/10/2026"
    }
];
// Charger les inscriptions
let inscriptions = JSON.parse(
    localStorage.getItem("inscriptions")
);
// Initialiser le stockage la première fois
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
const resultats = trierInscriptions(resultatsStatut, sortSelect.value);
    resultats.forEach(function (inscription) {
    const index = inscriptions.indexOf(inscription);
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
                    <button onclick="modifierInscription(${index})">
                        Modifier
                    </button>

                    <button onclick="supprimerInscription(${index})">
                        Supprimer
                    </button>
                </td>
            </tr>
        `;
    });
}

// Enregistrer les modifications
function sauvegarderInscriptions() {
    localStorage.setItem(
        "inscriptions",
        JSON.stringify(inscriptions)
    );
}

// Supprimer une inscription
function supprimerInscription(index) {
    const confirmation = confirm("Supprimer cette inscription ?");

    if (confirmation) {
        inscriptions.splice(index, 1);

        sauvegarderInscriptions();
        afficherInscriptions();
    }
}

// Modifier une inscription
function modifierInscription(index) {
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