import Image from 'next/image'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const Hero = () => {
  return (
    <section className=" relative h-[680px] bg-[#00000033]">
      <div className="relative max-w-[1440px]  px-5 md:px-10 h-full m-auto">
        <div className="max-w-fit flex flex-col gap-10 h-full justify-center">
          <h1 className="text-[58px] relative z-20 text-white font-bold">
            Bienvenue sur Tantor Learning
          </h1>
          <p className="text-white text-2xl relative z-20 max-w-[750px] mx-auto text-center">
            Votre plateforme de formation en ligne professionnelle. Accedez a des formations de
            qualite, ou que vous soyez.
          </p>
          <div className="border border-white flex gap-2.5 items-center p-2.5 relative z-20 rounded-full w-full max-w-[500px] mx-auto">
            <Input
              id="searchInput"
              type="text"
              className=" text-white font-semibold text-xl border-none shadow-none outline-0"
              placeholder="trouver votre formation"
            />
            <label
              className="bg-[#0353A4] text-white p-1.5 rounded-full cursor-pointer"
              htmlFor="searchInput"
            >
              <Search />
            </label>
          </div>
          <div className="relative z-20 flex flex-col md:flex-row gap-5 max-w-[500px] mx-auto">
            <Button className=" bg-white text-[#0353A4] text-[18px] cursor-pointer">
              Decouvrir nos formations
            </Button>
            <Button className="bg-[#0353A4] text-white  text-[18px] cursor-pointer">
              S'inscrire maintenant
            </Button>
          </div>
        </div>
        <Image
          src="/hero-bg.png"
          height={100}
          width={400}
          alt="hero image"
          className="absolute z-0 right-5 top-0 h-full w-auto object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[#00000033] z-10"></div>
    </section>
  )
}
export default Hero
