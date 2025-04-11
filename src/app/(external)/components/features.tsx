import Image from "next/image";

const learningFeatures = [
  {
    icon: "📚",
    title: "Bibliothèque numérique",
    description: "Bibliothèque numérique à votre disposition",
  },
  {
    icon: "🖥️",
    title: "Cours en visioconférence",
    description: "Cours en visioconférence ou en présentiel",
  },
  {
    icon: "📊",
    title: "Suivi de progression intelligent",
    description: "Suivi de progression intelligent",
  },
];
const Features = () => {
  return (
    <section>
      <div className="max-w-[1440px] m-auto px-5 md:px-10">
        <div className="overflow-x-clip bg-[#e4e4e49a] py-6">
          <div className="animate-move-left w-[200%] [animation-duration:90s] hover:[animation-play-state:paused] gap-2.5 md:gap-10 lg:gap-14">
            {[...learningFeatures, ...learningFeatures].map((feature, i) => (
              <div
                key={i}
                className="flex-[1] h-[200px] md:h-[250px] lg:h-[360px] w-[50%] md:w-[30%] rounded-2xl py-5 px-6 flex flex-col justify-between border border-[#E4E4E4] bg-white hover:scale-105 transition duration-500"
              >
                <Image
                  src={`/icons/l-feature${(i % 3) + 1}.svg`}
                  height={310}
                  width={350}
                  alt={`feature ${i} icon`}
                  className="w-4/5 h-auto"
                />
                <div className="flex gap-2.5">
                  <span className="hidden md:inline-block">{feature.icon}</span>
                  <p className="text-[#0466C8] font-semibold text-[12px] md:text-[18px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Features;
