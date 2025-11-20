import Image from "next/image";

// const partners = ["france travail", "lk paie", "qualiopi", "voltaire", "mon compe", "la region"];
const partners = ["lk paie", "qualiopi", "voltaire"];
const Partners = () => {
  return (
    <section id="partners" className="pt-6">
      <div className="m-auto">
        <h1 className="text-4xl font-medium font-work-sans text-[#001A40] mb-4 text-center">
          Nos partenaires
        </h1>
        <div className="overflow-x-clip [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-move-left w-[400%] [animation-duration:90s] hover:[animation-play-state:paused]">
            {[...partners, ...partners].map((partner, i) => (
              <picture
                key={i}
                className="w-[30%] mx-5 md:mx-10 lg:mx-16 xl:mx-20 flex items-center justify-center"
              >
                <Image
                  src={`/icons/partner${(i % 6) + 1}.svg`}
                  alt={partner}
                  height={500}
                  width={1000}
                  className={`${i % 4 == 0 ? "w-3/5" : "w-full"} h-auto`}
                />
              </picture>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center mb-6 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h2 className="text-2xl font-medium text-foreground">
            "Une plateforme complète pour une formation simplifiée."
          </h2>
          <p className="max-w-[700px] text-ring font-normal text-[16px] leading-relaxed">
            Que vous soyez étudiant, formateur ou administrateur, Tantor Learning vous offre tous
            les outils nécessaires pour apprendre, enseigner et gérer vos formations en toute
            simplicité.
          </p>
        </div>
      </div>
    </section>
  );
};
export default Partners;
