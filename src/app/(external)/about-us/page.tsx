"use client";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "./components/feature-card";
import { StepCard } from "./components/step-card";
import { courseTypes, registrationSteps, accountingCourses } from "./data";
import { Pricing } from "./components/pricing";
import { useRouter } from "next/navigation";

export default function AboutUs() {
  const router = useRouter();
  return (
    <main>
      <div className="max-w-[1440px] m-auto flex flex-col gap-4 lg:flex-row px-5 md:px-10 py-12">
        <div className="flex-1">
          <h1 className="text-primary text-5xl font-bold mb-4">TANTOR Learning Hub</h1>
          <p>Formez-vous aux métiers de la comptabilité avec notre école spécialisée</p>
          <p className="mb-4 leading-11">
            Notre école de comptabilité vous offre des formations de qualité adaptées à vos besoins.
            Rejoignez TANTOR Learning Hub pour une carrière réussie dans le monde de la finance et
            de la comptabilité.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/trainings")}
              className="cursor-pointer"
            >
              Decourvir nos formations
            </Button>
            <Button onClick={() => router.push("/contact-us")} className="cursor-pointer">
              Nous Contacter
            </Button>
          </div>
        </div>

        <div
          style={{ boxShadow: "0 0 8px #0466C8" }}
          className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 border border-border rounded-md p-4"
        >
          {courseTypes.map((course, index) => (
            <FeatureCard
              key={index}
              icon={course.icon}
              title={course.title}
              description={course.description}
              className={"bg-[#8FAEF94D]"}
            />
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] m-auto px-5 md:px-10 py-12 text-center">
        <h2 className="font-bold text-4xl mb-4">Comment s'inscrire</h2>
        <p className="leading-12">
          Nous avons simplifié le processus d'inscription pour vous permettre de vous inscrire
          rapidement et facilement. Suivez ces trois étapes simples
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 mb-4">
          {registrationSteps.map((step, index) => (
            <StepCard
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

        <Button size="lg" className="cursor-pointer" onClick={() => router.push("/signup")}>
          S'inscrire maintenant
        </Button>
      </div>

      <div className="bg-[#B3D9FFB2] text-secondary-foreground mt-4">
        <div className="max-w-[1440px] m-auto px-5 md:px-10 py-12 text-center">
          <h2 className="font-bold text-4xl mb-4">Nos Formations Bac +3 en Comptabilité</h2>
          <p className="leading-12 text-xl text-muted-foreground">
            TANTOR Learning vous propose des formations Bac +3 en comptabilité, adaptées à tous les
            profils d'étudiants et professionnels souhaitant approfondir leurs compétences dans le
            domaine de la comptabilité et de la gestion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
            {accountingCourses.map((course, index) => (
              <FeatureCard
                key={index}
                icon={course.icon}
                title={course.title}
                description={course.description}
                action={course.action}
              />
            ))}
          </div>
        </div>
        <div className=" max-w-[1440px] m-auto text-center">
          <Pricing />
        </div>
      </div>

      <div className="bg-[#B3D9FFB2] text-secondary-foreground">
        <div className="max-w-[1440px] m-auto px-5 md:px-10 py-12 text-center">
          <h2 className="font-bold text-4xl mb-4">Nos Formations Bac +5 en Comptabilité</h2>
          <p className="leading-12 text-xl text-muted-foreground">
            TANTOR Learning vous propose des formations Bac +3 en comptabilité, adaptées à tous les
            profils d'étudiants et professionnels souhaitant approfondir leurs compétences dans le
            domaine de la comptabilité et de la gestion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
            {accountingCourses.map((course, index) => (
              <FeatureCard
                key={index}
                icon={course.icon}
                title={course.title}
                description={course.description}
                action={course.action}
              />
            ))}
          </div>
        </div>
        <div className=" max-w-[1440px] m-auto text-center">
          <Pricing />
        </div>
      </div>

      <div className="bg-[#B3D9FFB2] text-secondary-foreground">
        <div className="max-w-[1440px] m-auto px-5 md:px-10 py-12 text-center">
          <h2 className="font-bold text-4xl mb-4">Nos Formations en continu</h2>
          <p className="leading-12 text-xl text-muted-foreground">
            TANTOR Learning vous propose des formations Bac +3 en comptabilité, adaptées à tous les
            profils d'étudiants et professionnels souhaitant approfondir leurs compétences dans le
            domaine de la comptabilité et de la gestion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {accountingCourses.map((course, index) => (
              <FeatureCard
                key={index}
                icon={course.icon}
                title={course.title}
                description={course.description}
                action={course.action}
              />
            ))}
          </div>
        </div>
        <div className=" max-w-[1440px] m-auto text-center">
          <Pricing />
        </div>
      </div>
    </main>
  );
}
