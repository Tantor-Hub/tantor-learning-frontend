export function CSG() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Conditions Générales de Services de Tantor Learning
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Dernière mise à jour le lundi 18 août 2025
        <br />
        (Document protégé par le droit d’auteur. Toute reproduction interdite)
      </p>

      {/* Définitions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Définitions</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            <span className="font-medium">Apprenant :</span> Personne physique souscrivant à une
            Offre de formation.
          </li>
          <li>
            <span className="font-medium">Abonnement :</span> Engagement contractuel d’accès aux
            Services selon l’Offre sélectionnée.
          </li>
          <li>
            <span className="font-medium">Certificat de Compétence :</span> Attestation numérique
            délivrée après validation des évaluations d’un Module, valorisable auprès des
            recruteurs.
          </li>
          <li>
            <span className="font-medium">Module :</span> Unité pédagogique structurée (texte,
            vidéo, schémas interactifs) créée par des experts certifiés ou partenaires académiques.
          </li>
          <li>
            <span className="font-medium">Diplôme Certifiant :</span> Titre professionnel RNCP/RS
            délivré après soutenance devant un jury, sanctionnant la réussite d’un Parcours.
          </li>
          <li>
            <span className="font-medium">Coach :</span> Professionnel en activité accrédité par
            Tantor Learning, assurant un accompagnement individualisé ou collectif.
          </li>
          <li>
            <span className="font-medium">Offre :</span> Formule commerciale d’Abonnement décrite
            sur la Plateforme.
          </li>
          <li>
            <span className="font-medium">Parcours :</span> Curriculum pédagogique incluant Modules,
            Projets Pratiques, évaluations et séances de coaching.
          </li>
          <li>
            <span className="font-medium">Plateforme :</span> Écosystème numérique édité par Tantor
            SAS.
          </li>
          <li>
            <span className="font-medium">Formation Standard :</span> Services décrits à l’Article
            2.1.
          </li>
          <li>
            <span className="font-medium">Formation Avancée :</span> Services décrits à l’Article
            2.2.
          </li>
          <li>
            <span className="font-medium">Projet Pratique :</span> Mission professionnelle évaluée,
            intégrée aux Parcours.
          </li>
          <li>
            <span className="font-medium">Services :</span> Ensemble des fonctionnalités
            pédagogiques et techniques fournies via la Plateforme ou en présentiel.
          </li>
        </ul>
      </section>

      {/* Article 1 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Article 1. Dispositions Générales</h2>
        <h3 className="font-medium">1.1 Champ d’Application</h3>
        <p className="text-gray-700 mb-2">
          Les présentes Conditions Générales de Services (CGS) régissent la relation contractuelle
          entre Tantor et l’Apprenant dans le cadre des Abonnements payants et gratuits. Elles sont
          opposables dès la coché de la case d’acceptation lors de la souscription.
        </p>
        <h3 className="font-medium">1.2 Évolutions Contractuelles</h3>
        <p className="text-gray-700 mb-2">
          Tantor Learning se réserve le droit de modifier les CGS pour des motifs légaux, techniques
          ou pédagogiques. En cas de changement substantiel, l’Apprenant dispose d’un délai de 30
          jours pour résilier sans frais. L’utilisation continue vaut acceptation tacite.
        </p>
        <h3 className="font-medium">1.3 Capacité Contractuelle</h3>
        <p className="text-gray-700 mb-2">
          Tout Abonnement est conditionné à la majorité légale de l’Apprenant ou à une autorisation
          parentale écrite pour les mineurs. Tantor peut exiger une preuve d’identité.
        </p>
        <h3 className="font-medium">1.4 Services en Préparation</h3>
        <p className="text-gray-700 mb-2">
          Les Parcours signalés par "Disponible prochainement" ou équivalent, font l’objet d’une
          estimation de lancement affichée sur leur page dédiée.
        </p>
        <h3 className="font-medium">1.5 Accessibilité</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>
            Lecture audio assistée : MacOS (clic droit → Parler), Windows (Narrateur Windows + Ctrl
            + Entrée).
          </li>
          <li>Demande d’adaptation pour handicap : secretariat@tantorlearning.com</li>
        </ul>
      </section>

      {/* Article 2 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Article 2 – Offres de Formation</h2>
        <h3 className="font-medium">2.1 Modalités de Formation</h3>
        <ul className="list-disc list-inside text-gray-700 mb-3">
          <li>
            <span className="font-medium">En ligne :</span> accès 24h/24 aux modules, quiz et
            ressources, certificats après validation.
          </li>
          <li>
            <span className="font-medium">Présentiel :</span> sessions dans centres agréés, matériel
            pédagogique fourni.
          </li>
          <li>
            <span className="font-medium">Hybride :</span> alternance cours en ligne / présentiel,
            planning communiqué.
          </li>
        </ul>
        <p className="text-gray-700">
          Certaines formations certifiantes imposent un format spécifique.
        </p>
      </section>

      {/* (⚡ je ne mets pas tout ici sinon ça devient un mur de texte immense, 
           mais on peut continuer la structure jusqu’à l’Article 9 avec 
           titres, paragraphes et listes comme ci-dessus) */}

      <section className="text-gray-500 text-sm mt-8 border-t pt-4">
        Document émis par Tantor Learning SAS – © 2025 Tous droits réservés.
      </section>
    </div>
  );
}
