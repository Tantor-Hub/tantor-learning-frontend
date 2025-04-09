import Image from 'next/image'
const learningContent = {
  title: 'Apprenez et Développez Vos connaissances Partout en France',
  description: `Nous offrons une expérience d’apprentissage transformative, où chaque étudiant se sent soutenu, inspiré et prêt à relever de nouveaux défis où qu’il se trouve.`,
  features: [
    'Formateurs Hautement qualifiés',
    'Interface intuitive et Facile à utiliser',
    'Suivi en temps réel de vos progrès',
    'Support Expert 24/7',
  ],
}

const Learn = () => {
  return (
    <section className="flex flex-col md:flex-row justify-between items-center">
      <div className="max-w-[1440px] m-auto px-5 md:px-10 flex flex-col lg:flex-row gap-10 lg:gap-28">
        <picture className="flex-[1] md:min-w-[500px] m:py-7">
          <Image
            src="/icons/learn.svg"
            height={415}
            width={755}
            alt="learning illustration"
            className="object-cover w-full h-auto"
          />
        </picture>
        <div className="flex-[1] font-semibold flex flex-col gap-4 py-7">
          <h2 className="text-[32px] text-[#0353A4]">{learningContent.title}</h2>
          <p>{learningContent.description}</p>
          <ul className="list-disc marker:text-[#23BDEE] marker:text-xl">
            {learningContent.features.map((feature) => (
              <li key={feature} className="pb-1 ml-5">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
export default Learn
