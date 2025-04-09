import Link from "next/link";
import { Facebook, Instagram, LinkedIn, X, Youtube } from "./social-icons";

const footerLinks = [
  [
    { href: "#", label: "À propos" },
    { href: "#", label: "FAQ" },
    { href: "#", label: "Contacts" },
  ],
  [
    { href: "#", label: "Nos partenires" },
    { href: "#", label: "Politiques de Confidentialite" },
    { href: "#", label: "Termes & Conditions" },
  ],
  [
    { href: "#", label: "Nos Formations" },
    { href: "#", label: "Qui sommes-nous?" },
    { href: "#", label: "Nos objectifs" },
  ],
];

const socialsIcons = [
  { id: "facebook", icon: <Facebook /> },
  { id: "instagram", icon: <Instagram /> },
  { id: "linkedin", icon: <LinkedIn /> },
  { id: "x", icon: <X /> },
  { id: "youtube", icon: <Youtube /> },
];

const Footer = () => {
  return (
    <footer className="bg-[#023E7D] pt-20 pb-5 text-white">
      <div className="max-w-[1440px] flex flex-col gap-10 m-auto px-5 md:px-10 text-base md:text-xl">
        <section className="flex gap-5 flex-wrap justify-between items-center w-full">
          {footerLinks.map((links) => (
            <div key={links[0].label} className="flex flex-col h-32 md:h-44 justify-between">
              {links.map((link) => (
                <Link key={link.label} href={link.href} className="md:max-w-[200px]">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="border h-[130px] border-white flex flex-col justify-between p-3.5">
            <p>Nous Suivre</p>
            <div className="flex gap-2.5">
              {socialsIcons.map((social) => (
                <div key={social.id} className="hover:text-blue-300 bg-none">
                  {social.icon}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section>
          <p className="text-center">© 2025 Tantor Learning. Tous droits reserves</p>
        </section>
      </div>
    </footer>
  );
};
export default Footer;
