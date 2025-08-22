export function CodeEthique() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Titre et mise à jour */}
      <h1 className="text-2xl font-bold">Code d’éthique – TANTOR</h1>
      <p className="text-sm text-muted-foreground">Dernière mise à jour : 15 août 2025</p>

      {/* Introduction */}
      <p>
        Chez <span className="font-semibold">TANTOR</span>, nous croyons que la confiance,
        l’intégrité et le respect sont les fondations d’une relation durable avec nos
        collaborateurs, nos clients et nos partenaires.
      </p>
      <p>
        Ce Code d’éthique fixe les principes qui guident nos actions au quotidien, et il s’applique
        à <span className="font-semibold">tous</span> ceux qui travaillent pour ou avec TANTOR :
        salariés, dirigeants, consultants, formateurs, sous-traitants et partenaires commerciaux.
      </p>

      {/* Contenu principal */}
      <ol className="space-y-6 list-decimal pl-6">
        {/* Valeurs */}
        <li className="space-y-2">
          <h2 className="font-semibold text-lg">Nos valeurs fondamentales</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <span className="font-semibold">Intégrité :</span> agir avec honnêteté et transparence
              dans toutes nos relations.
            </li>
            <li>
              <span className="font-semibold">Respect :</span> traiter chaque personne avec dignité
              et considération.
            </li>
            <li>
              <span className="font-semibold">Excellence :</span> viser la qualité et l’amélioration
              continue dans nos services.
            </li>
            <li>
              <span className="font-semibold">Responsabilité :</span> assumer pleinement les
              conséquences de nos décisions et de nos actions.
            </li>
            <li>
              <span className="font-semibold">Innovation :</span> favoriser la créativité et
              l’adaptation aux évolutions technologiques et sociétales.
            </li>
          </ul>
        </li>

        {/* Champ d’application */}
        <li className="space-y-2">
          <h2 className="font-semibold text-lg">Champ d’application du Code</h2>
          <p>Ce Code concerne l’ensemble des activités de TANTOR, notamment :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>La formation professionnelle (présentiel et à distance).</li>
          </ul>
          <p>Il s’applique à :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Aux collaborateurs internes et dirigeants.</li>
            <li>Aux prestataires, fournisseurs et partenaires.</li>
            <li>Aux formateurs et consultants travaillant pour TANTOR.</li>
          </ul>
        </li>

        {/* Principes éthiques */}
        <li className="space-y-2">
          <h2 className="font-semibold text-lg">Principes éthiques</h2>

          <h3 className="font-semibold">3.1 Respect des personnes et diversité</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Interdiction de toute forme de discrimination liée à l’origine, au genre, à l’âge, à
              l’orientation sexuelle, à la religion, au handicap ou à toute autre caractéristique
              protégée par la loi.
            </li>
            <li>
              Combat du harcèlement, qu’il soit moral ou sexuel, pour maintenir un environnement de
              travail sûr et respectueux.
            </li>
            <li>
              Promotion de l’inclusion, de la diversité des profils et de l’égalité des chances.
            </li>
          </ul>

          <h3 className="font-semibold">3.2 Intégrité dans les affaires</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Interdiction de la corruption, fraude, blanchiment d’argent et pratiques commerciales
              déloyales.
            </li>
            <li>
              Refus des cadeaux ou avantages qui pourraient influencer indûment une décision, sauf
              s’ils sont symboliques et conformes aux usages.
            </li>
            <li>Déclaration et prévention de tout conflit d’intérêts potentiel.</li>
          </ul>

          <h3 className="font-semibold">3.3 Confidentialité et protection des données</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Protection des informations personnelles et professionnelles confiées.</li>
            <li>Respect du RGPD et des droits de propriété intellectuelle.</li>
            <li>
              Utilisation des outils et systèmes uniquement à des fins professionnelles et
              autorisées.
            </li>
          </ul>

          <h3 className="font-semibold">3.4 Conformité légale et réglementaire</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Respect des lois applicables dans les pays où TANTOR exerce.</li>
            <li>Conformité aux réglementations du secteur de la formation et du numérique.</li>
            <li>Adaptation continue aux évolutions législatives et technologiques.</li>
          </ul>

          <h3 className="font-semibold">3.5 Responsabilité environnementale</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Réduction de l’impact environnemental avec des pratiques responsables.</li>
            <li>Encouragement du recyclage, réduction des déchets et économies d’énergie.</li>
            <li>
              Privilégier les prestataires et fournisseurs engagés dans des démarches durables.
            </li>
          </ul>
        </li>

        {/* Signalement */}
        <li className="space-y-2">
          <h2 className="font-semibold text-lg">Signalement des manquements</h2>
          <p>
            Tout collaborateur ou partenaire peut signaler, en toute bonne foi, un comportement ou
            une situation contraire à ce Code.
          </p>
          <p>Les signalements peuvent se faire :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Par e-mail :{" "}
              <a href="mailto:support@tantorlearning.com" className="text-primary">
                support@tantorlearning.com
              </a>
            </li>
            <li>
              Par courrier :{" "}
              <span className="font-semibold">
                TANTOR – Service Éthique, 48 rue du Bret, 38090 Villefontaine, France
              </span>
            </li>
          </ul>
          <p>
            TANTOR s’engage à traiter tous les signalements avec confidentialité et sans
            représailles envers la personne qui rapporte les faits.
          </p>
        </li>

        {/* Sanctions */}
        <li className="space-y-2">
          <h2 className="font-semibold text-lg">Sanctions</h2>
          <p>
            Toute violation de ce Code pourra entraîner des mesures disciplinaires, pouvant aller
            jusqu’à la rupture du contrat de travail ou de collaboration, ainsi que des poursuites
            judiciaires si nécessaire.
          </p>
        </li>

        {/* Révision */}
        <li className="space-y-2">
          <h2 className="font-semibold text-lg">Révision du Code</h2>
          <p>
            Ce Code d’éthique pourra être modifié pour tenir compte des évolutions légales,
            technologiques et organisationnelles. La version à jour sera toujours disponible sur
            notre{" "}
            <a href="https://www.tantorlearning.com" className="text-primary">
              site internet
            </a>
            .
          </p>
        </li>
      </ol>
    </div>
  );
}
