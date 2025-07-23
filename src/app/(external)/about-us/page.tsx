"use client";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "./components/feature-card";
import { StepCard } from "./components/step-card";
import { courseTypes, registrationSteps, accountingCourses } from "./data";
import { Pricing } from "./components/pricing";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-work-sans font-semibold text-primary mb-6">
            TANTOR Learning Hub
          </h1>
          <p className="text-medium text-muted-foreground">
            Formez-vous aux métiers de la comptabilité avec notre école spécialisée
          </p>
          <p className="my-4 text-medium text-muted-foreground">
            Notre école de comptabilité vous offre des formations de qualité adaptées à vos besoins.
            Rejoignez TANTOR Learning Hub pour une carrière réussie dans le monde de la finance et
            de la comptabilité.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/trainings")}
              className="border-primary text-primary w-full"
            >
              Decourvir nos formations
            </Button>
            <Button onClick={() => router.push("/contact-us")} className="w-full" size="lg">
              Nous Contacter
            </Button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 border rounded-md p-4 border-ring shadow-sm shadow-ring">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 text-center">
        <h2 className="text-3xl font-work-sans font-semibold mb-6">Comment s'inscrire</h2>
        <p className="text-medium text-muted-foreground max-w-lg mx-auto">
          Nous avons simplifié le processus d'inscription pour vous permettre de vous inscrire
          rapidement et facilement. Suivez ces trois étapes simples
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          {registrationSteps.map((step, index) => (
            <StepCard
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

        <Button size="lg" className="mt-4" onClick={() => router.push("/signup")}>
          S'inscrire maintenant
        </Button>
      </div>

      <div className="text-secondary-foreground">
        <div className="bg-ring text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 text-center">
            <h2 className="text-3xl font-work-sans font-semibold mb-6">
              Nos Formations Bac +3 en Comptabilité
            </h2>
            <p className="text-primary-foreground mb-4 w-full max-w-lg mx-auto">
              TANTOR Learning vous propose des formations Bac +3 en comptabilité, adaptées à tous
              les profils d'étudiants et professionnels souhaitant approfondir leurs compétences
              dans le domaine de la comptabilité et de la gestion.
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
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <Pricing />
        </div>
      </div>

      <div className="text-primary-foreground">
        <div className="bg-ring">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 text-center">
            <h2 className="text-3xl font-work-sans font-semibold mb-6">
              Nos Formations Bac +5 en Comptabilité
            </h2>
            <p className="text-primary-foreground mb-4 w-full max-w-lg mx-auto">
              TANTOR Learning vous propose des formations Bac +3 en comptabilité, adaptées à tous
              les profils d'étudiants et professionnels souhaitant approfondir leurs compétences
              dans le domaine de la comptabilité et de la gestion.
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
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full m-auto text-center">
          <Pricing />
        </div>
      </div>

      <div className="text-primary-foreground">
        <div className="bg-ring">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 text-center">
            <h2 className="text-3xl font-work-sans font-semibold mb-6">
              Nos Formations en continu
            </h2>
            <p className="text-primary-foreground mb-4 w-full max-w-lg mx-auto">
              TANTOR Learning vous propose des formations Bac +3 en comptabilité, adaptées à tous
              les profils d'étudiants et professionnels souhaitant approfondir leurs compétences
              dans le domaine de la comptabilité et de la gestion.
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
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 text-center">
          <Pricing />
        </div>
      </div>
    </main>
  );
}
