const niveauSelect = document.querySelector("#level");
const coursSelect = document.querySelector("#course");
niveauSelect.addEventListener("change", function () {
    const niveauChoisi = niveauSelect.value;
    coursSelect.innerHTML =
        '<option value="">Choisir un cours</option>';
    if (niveauChoisi === "") {
        coursSelect.disabled = true;
        return;
    }
    
    const coursFiltres = courses.filter(function (cours) {
        return cours.level === niveauChoisi;
    });

    coursFiltres.forEach(function (cours) {
        if (cours.places > 0) {
            const option = document.createElement("option");
            option.value = cours.id;
            option.textContent = cours.title;
            coursSelect.appendChild(option);
        }
    });
    coursSelect.disabled = coursSelect.options.length <= 1;
});

const formulaire = document.querySelector("#form-inscription");
formulaire.addEventListener("submit", function (event) {
event.preventDefault();
    // Récupérer les données du formulaire
    const eleve = document.querySelector("#student-name").value;
    const niveau = document.querySelector("#level").value;
    const cours = document.querySelector("#course").value;
    const telephone = document.querySelector("#parent-phone").value;
    const date = document.querySelector("#registration-date").value;
    const statut = document.querySelector("#status").value;
    // Récupérer les inscriptions enregistrées
    let inscriptions = JSON.parse(
        localStorage.getItem("inscriptions")
    );
    if (inscriptions === null) {
        inscriptions = [];
    }
    // Créer une nouvelle inscription
    const nouvelleInscription = {
        numero: "NOUR-" + Date.now(),
        eleve: eleve,
        niveau: niveau,
        cours: cours,
        telephone: telephone,
        statut: statut,
        date: date
    };
    // Ajouter l'inscription à la liste
    inscriptions.push(nouvelleInscription);
    // Sauvegarder la liste
    localStorage.setItem(
        "inscriptions",
        JSON.stringify(inscriptions)
    );
    alert("Inscription enregistrée avec succès !");
    formulaire.reset();
});
