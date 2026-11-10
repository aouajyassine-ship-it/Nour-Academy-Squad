// Accès aux inscriptions et règles métier communes (ajout / modification).
import { normaliserNom } from "./validation.js";

export const STORAGE_KEY = "inscriptions";
export const CAPACITE_MAX = 15;

// Retourne null si aucune donnée n'a encore été enregistrée.
// Cela permet de distinguer "première visite" de "liste vidée".
export function lireInscriptionsStockees() {
    const donnees = localStorage.getItem(STORAGE_KEY);

    if (donnees === null) {
        return null;
    }

    try {
        const inscriptions = JSON.parse(donnees);
        return Array.isArray(inscriptions) ? inscriptions : [];
    } catch (erreur) {
        console.error("Impossible de lire les inscriptions :", erreur);
        return [];
    }
}

export function chargerInscriptions() {
    return lireInscriptionsStockees() ?? [];
}

export function sauvegarderInscriptions(inscriptions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inscriptions));
}

export function genererNumero() {
    return `NOUR-${Date.now()}`;
}

export function trouverIndexInscription(inscriptions, numero) {
    return inscriptions.findIndex(function (inscription) {
        return inscription.numero === numero;
    });
}

// Le numéro exclu permet de ne pas compter l'inscription en cours
// de modification dans son propre groupe.
export function compterInscrits(inscriptions, cours, niveau, numeroExclu = null) {
    return inscriptions.filter(function (inscription) {
        return inscription.numero !== numeroExclu &&
            inscription.cours === cours &&
            inscription.niveau === niveau;
    }).length;
}

export function estDoublon(inscriptions, { eleve, cours, niveau }, numeroExclu = null) {
    const nomRecherche = normaliserNom(eleve);

    return inscriptions.some(function (inscription) {
        return inscription.numero !== numeroExclu &&
            normaliserNom(inscription.eleve) === nomRecherche &&
            inscription.cours === cours &&
            inscription.niveau === niveau;
    });
}

// Retourne un message d'erreur, ou null si l'inscription est valide.
export function verifierInscription(inscriptions, { eleve, cours, niveau }, numeroExclu = null) {
    if (estDoublon(inscriptions, { eleve, cours, niveau }, numeroExclu)) {
        return "Cet élève est déjà inscrit à ce cours pour ce niveau.";
    }

    const nombreInscrits = compterInscrits(inscriptions, cours, niveau, numeroExclu);

    if (nombreInscrits >= CAPACITE_MAX) {
        return `Ce groupe est complet (${CAPACITE_MAX} élèves maximum).`;
    }

    return null;
}
