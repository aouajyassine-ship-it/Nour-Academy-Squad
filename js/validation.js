// Regex et règles de validation partagées par les formulaires.
// Ce module est importé par la page d'ajout et par la page de modification.

export const NAME_REGEX = /^[\p{L}]+(?:[\s'\u2019-]+[\p{L}]+)*$/u;
export const PHONE_REGEX = /^0[5-7]\d{8}$/;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 60;

// Normalise un nom pour comparer les doublons :
// minuscules, espaces simples et suppression des accents.
export function normaliserNom(nom) {
    return String(nom)
        .trim()
        .replace(/\s+/g, " ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// Accepte les formats 06 12 34 56 78, 0612345678, +212 6 12 34 56 78...
export function normaliserTelephone(telephone) {
    let valeur = String(telephone).replace(/[\s.\-()\/]/g, "");

    if (valeur.startsWith("+212")) {
        valeur = "0" + valeur.slice(4).replace(/^0/, "");
    } else if (valeur.startsWith("00212")) {
        valeur = "0" + valeur.slice(5).replace(/^0/, "");
    }

    return valeur;
}

export function validerNom(nom) {
    const valeur = String(nom).trim().normalize("NFC");

    if (valeur.length < NAME_MIN_LENGTH) {
        return {
            valide: false,
            message: "Le nom doit contenir au moins 2 caractères."
        };
    }

    if (valeur.length > NAME_MAX_LENGTH) {
        return {
            valide: false,
            message: `Le nom ne doit pas dépasser ${NAME_MAX_LENGTH} caractères.`
        };
    }

    if (!NAME_REGEX.test(valeur)) {
        return {
            valide: false,
            message: "Le nom ne doit contenir que des lettres, des espaces, des apostrophes ou des tirets."
        };
    }

    if (valeur.split(/\s+/).filter(Boolean).length < 2) {
        return {
            valide: false,
            message: "Saisissez le nom et le prénom de l'élève."
        };
    }

    return { valide: true, message: "" };
}

export function validerTelephone(telephone) {
    const valeur = normaliserTelephone(telephone);

    if (valeur === "") {
        return {
            valide: false,
            message: "Le numéro de téléphone est obligatoire."
        };
    }

    if (!PHONE_REGEX.test(valeur)) {
        return {
            valide: false,
            message: "Saisissez un numéro marocain valide à 10 chiffres (ex. 0612345678)."
        };
    }

    return { valide: true, message: "", valeur: valeur };
}

// Affiche le message sous le champ concerné (id du champ + "-error").
export function afficherErreurChamp(champ, message) {
    const messageErreur = document.getElementById(`${champ.id}-error`) ||
        champ.closest(".form-field")?.querySelector(".field-error");

    if (messageErreur) {
        messageErreur.textContent = message;
    }

    champ.classList.add("input-invalid");
    champ.setAttribute("aria-invalid", "true");
}

export function effacerErreurChamp(champ) {
    const messageErreur = document.getElementById(`${champ.id}-error`) ||
        champ.closest(".form-field")?.querySelector(".field-error");

    if (messageErreur) {
        messageErreur.textContent = "";
    }

    champ.classList.remove("input-invalid");
    champ.removeAttribute("aria-invalid");
}
