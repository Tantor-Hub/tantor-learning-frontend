import Image from 'next/image'

const partners = ['france travail', 'lk paie', 'qualiopi', 'voltaire', 'mon compe', 'la region']
const Partners = () => {
  return (
    <section>
      <div className="max-w-[1440px] m-auto">
        <h1 className="text-center text-[#001845] text-2xl px-5 md:px-10 pb-15 md:pb-10 pt-6 font-semibold">
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
                  className={`${i % 4 == 0 ? 'w-3/5' : 'w-full'} h-auto`}
                />
              </picture>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-center text-[#001845] text-3xl px-5 md:px-10 pb-5 pt-6 font-semibold">
            "Une plateforme complète pour une formation simplifiée."
          </h2>
          <p className="max-w-[700px] pb-6 px-5 md:px-10 text-center text-base text-[#23BDEE]">
            Que vous soyez étudiant, formateur ou administrateur, Tantor Learning vous offre tous
            les outils nécessaires pour apprendre, enseigner et gérer vos formations en toute
            simplicité.
          </p>
        </div>
      </div>
    </section>
  )
}
export default Partners
