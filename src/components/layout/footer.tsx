import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import { Separator } from "../ui/separator";

const footerLinks = [
  [
    { href: "/about-us", label: "À propos" },
    { href: "#", label: "FAQ" },
    { href: "/contact-us", label: "Contacts" },
  ],
  [
    { href: "/#partners", label: "Nos partenaires" },
    { href: "#", label: "Politiques de Confidentialite" },
    { href: "#", label: "Termes & Conditions" },
  ],
  [
    { href: "/trainings", label: "Nos Formations" },
    { href: "/about-us", label: "Qui sommes-nous?" },
    { href: "/about-us", label: "Nos objectifs" },
  ],
];

const socialsIcons = [
  { id: "facebook", icon: <Facebook className="w-4 h-4 text-white" size={16} /> },
  { id: "instagram", icon: <Instagram className="w-4 h-4 text-white" /> },
  { id: "linkedin", icon: <Linkedin className="w-4 h-4 text-white" /> },
  { id: "x", icon: <Twitter className="w-4 h-4 text-white" /> },
  { id: "youtube", icon: <Youtube className="w-4 h-4 text-white" /> },
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
                    href="#"
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
