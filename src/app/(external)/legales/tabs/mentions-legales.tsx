export function MentionsLegales() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mentions légales – TANTOR</h1>
      <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 15 août 2025</p>

      {/* Section 1 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">1. Identification de l’entreprise</h2>
        <ul className="space-y-1 text-gray-700">
          <li>
            <span className="font-medium">Raison sociale :</span> TANTOR
          </li>
          <li>
            <span className="font-medium">Forme juridique :</span> Société par Actions Simplifiée
            Unipersonnelle (SASU)
          </li>
          <li>
            <span className="font-medium">Capital social :</span> 1 000 €
          </li>
          <li>
            <span className="font-medium">RCS :</span> Vienne – 952 066 298
          </li>
          <li>
            <span className="font-medium">Siège social :</span> 48 rue du Bret, 38090 Villefontaine,
            France
          </li>
          <li>
            <span className="font-medium">Numéro de TVA intracommunautaire :</span> FR53 952 066 298
          </li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">2. Direction</h2>
        <p className="text-gray-700">
          <span className="font-medium">Président :</span> M. Kalboussi Karim
          <br />
          Responsable de la direction stratégique et opérationnelle de l’entreprise.
        </p>
      </section>

      {/* Section 3 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">3. Activités</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Formation professionnelle continue (en présentiel et à distance)</li>
          <li>Développement de solutions numériques et de logiciels</li>
          <li>Accompagnement à la digitalisation et au commerce en ligne</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">4. Hébergement du site</h2>
        <p className="text-gray-700">
          <span className="font-medium">Hébergeur :</span> Amazon Web Services Limited Liability
          Company (LLC)
          <br />
          <span className="font-medium">Adresse :</span> Amazon Web Services, Inc. – 410 Terry Ave
          North, Seattle, WA 98109-5210, USA
        </p>
      </section>

      {/* Section 5 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">5. Contact</h2>
        <ul className="text-gray-700 space-y-1">
          <li>
            <span className="font-medium">Téléphone :</span> 04 28 35 05 60
          </li>
          <li>
            <span className="font-medium">Email :</span> support@tantorlearning.com
          </li>
          <li>
            <span className="font-medium">Adresse postale :</span> TANTOR, 48 rue du Bret, 38090
            Villefontaine, France
          </li>
        </ul>
      </section>

      {/* Section 6 */}
      <section>
        <h2 className="text-lg font-semibold mb-2">6. Protection des données personnelles</h2>
        <p className="text-gray-700 mb-3">
          TANTOR traite vos données personnelles dans le strict respect du Règlement Général sur la
          Protection des Données (RGPD). Vous disposez d’un droit d’accès, de rectification, de
          suppression et de limitation du traitement de vos données.
        </p>
        <p className="text-gray-700">Pour exercer vos droits :</p>
        <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
          <li>Par email : support@tantorlearning.com</li>
          <li>
            Par courrier : TANTOR – Délégué à la Protection des Données, 48 rue du Bret, 38090
            Villefontaine, France
          </li>
        </ul>
      </section>
    </div>
  );
}
