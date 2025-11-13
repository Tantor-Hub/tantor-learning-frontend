import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube, PhoneCall } from "lucide-react";
import { Separator } from "../ui/separator";
import Image from "next/image";

const footerLinks = [
  [
    { href: "/about-us", label: "À propos" },
    { href: "/#partners", label: "Nos partenaires" },
    { href: "#", label: "FAQ" },
    { href: "/contact-us", label: "Contacts" },
    { href: "/legales?tab=reclamations", label: "Politique globale de reclamations" },
    { href: "/legales?tab=donnees", label: "Politique de protection des données personnelles" },
  ],
  [
    { href: "/legales?tab=codeEthique", label: "Code Éthique" },
    { href: "/legales?tab=mentions", label: "Mentions Légales" },
    { href: "/legales?tab=reglement", label: "Reglement Interieur" },
    { href: "/legales?tab=cgu", label: "Conditions générales d'utilisation" },
    { href: "/legales?tab=cgs", label: "Conditions générales de service" },
  ],
  [
    { href: "/trainings", label: "Nos Formations" },
    { href: "/about-us", label: "Qui sommes-nous?" },
    { href: "/about-us", label: "Nos objectifs" },
  ],
];

const socialsIcons = [
  {
    id: "facebook",
    icon: <Facebook className="w-4 h-4 text-white" size={16} />,
    url: "https://www.facebook.com/people/Tantor-Learning/61579342811776/",
  },
  {
    id: "instagram",
    icon: <Instagram className="w-4 h-4 text-white" />,
    url: "https://www.instagram.com/tantor.learning/",
  },
  {
    id: "linkedin",
    icon: <Linkedin className="w-4 h-4 text-white" />,
    url: "https://www.linkedin.com/company/tantor-learning/?viewAsMember=true",
  },
  {
    id: "phone-call",
    icon: <PhoneCall className="w-4 h-4 text-white" />,
    url: "tel:+336 66 68 37 60",
  },
  {
    id: "youtube",
    icon: <Youtube className="w-4 h-4 text-white" />,
    url: "https://www.youtube.com/@TantorLearning",
  },
];

export function Footer() {
  return (
    <footer className="bg-primary py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-12">
          <section className="flex gap-4 flex-wrap justify-between items-start w-full">
            {footerLinks.map((links) => (
              <div key={links[0].label} className="flex flex-col gap-4 justify-between">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="md:max-w-[200px] hover:text-white/80 font-light"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="border h-[110px] flex flex-col justify-between p-3.5">
              <p className="font-semibold">Nous Suivre</p>
              <div className="flex gap-2.5">
                {socialsIcons.map((social) => (
                  <a
                    href={social.url}
                    className="bg-white/20 rounded-full p-2"
                    aria-label={social.id}
                    key={social.id}
                    target="_blank"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </section>
          <section>
            <div className="mb-6 space-y-2">
              <Image src="/icons/qualiopi.png" alt="France Education" width={200} height={200} />
              <div className="max-w-[250px] space-y-2">
                <p className="text-sm">
                  La certification qualité a été délivrée au titre des categories d'actions
                  suivantes
                </p>
                <div className="text-base font-semibold space-y-0">
                  <p>ACTIONS DE FORMATION</p>
                  <p>BILAN DE COMPETENCES</p>
                </div>
              </div>
            </div>
            <Separator />
            <p className="text-center mt-12 font-light">
              © 2025 Tantor Learning. Tous droits reserves
            </p>
          </section>
        </div>
      </div>
    </footer>
  );
}
