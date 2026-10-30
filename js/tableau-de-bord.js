
const inscriptions = JSON.parse(
    localStorage.getItem("inscriptions")
) || [];


const inscrits = document.getElementById("total-inscrits");
inscrits.textContent = inscriptions.length;


const attente = inscriptions.filter(function(inscription) {
    return inscription.statut === "En attente";
});

const validee = inscriptions.filter(function(inscription) {
    return ["Validée", "Validee"].includes(inscription.statut);
});

const payee = inscriptions.filter(function(inscription) {
    return ["Payée", "Payee"].includes(inscription.statut);
});


document.getElementById("total-attente").textContent = attente.length;
document.getElementById("total-validee").textContent = validee.length;
document.getElementById("total-payee").textContent = payee.length;



const total = inscriptions.length;

function calculerPourcentage(nombre, total) {
    if (total === 0) {
        return 0;
    }

    return (nombre / total) * 100;
}

document.querySelector(".progress-fill.attente").style.width =
    calculerPourcentage(attente.length, total) + "%";

document.querySelector(".progress-fill.validee").style.width =
    calculerPourcentage(validee.length, total) + "%";

document.querySelector(".progress-fill.payee").style.width =
    calculerPourcentage(payee.length, total) + "%";




let recettes = 0;

if (typeof courses !== "undefined") {
    payee.forEach(function(inscription) {
        const coursTrouve = courses.find(function(cours) {
            return cours.title === inscription.cours &&
                   cours.level === inscription.niveau;
        });

        if (coursTrouve) {
            recettes += coursTrouve.price;
        }
    });
}

document.getElementById("total-recettes").textContent =
    recettes + " MAD";


const matieres = [
    { nom: "Mathématiques", id: "total-math", classe: "math" },
    { nom: "Français", id: "total-francais", classe: "francais" },
    { nom: "Anglais", id: "total-anglais", classe: "anglais" },
    { nom: "Physique-chimie", id: "total-pc", classe: "pc" }
];

matieres.forEach(function(matiere) {
    const nombreInscrits = inscriptions.filter(function(inscription) {
        return inscription.cours === matiere.nom;
    }).length;

   
    const nombreGroupes = courses.filter(function(cours) {
    return cours.title === matiere.nom;
}).length;

const capacite = nombreGroupes * 15;

    const pourcentage = Math.min(
        Math.round(calculerPourcentage(nombreInscrits, capacite)),
        100
    );

    const element = document.getElementById(matiere.id);

    if (element) {
        element.textContent = pourcentage + "%";
    }

    const barre = document.querySelector(
        ".progress-fill." + matiere.classe
    );

    if (barre) {
        barre.style.width = pourcentage + "%";
    }
});