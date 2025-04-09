import Image from 'next/image'
import Link from 'next/link'

const Teaching = () => {
  return (
    <section className="flex flex-col md:flex-row justify-between items-center">
      <div className="max-w-[1440px] md:m-auto px-5 md:px-10 flex flex-col lg:flex-row gap-10 lg:gap-28">
        <div className="flex-[1] relative font-semibold text-[28px] my-auto justify-center flex flex-col py-7">
          <h2 className="ml-20">Formation en ligne ou en presentiel,</h2>
          <p className="text-[#0353A4] ml-20">c’est possible avec Tantor Learning</p>
          <Image
            src="/icons/ellipse.svg"
            height={60}
            width={60}
            alt="ellipse"
            className="h-[48px] w-auto absolute top-5 left-0"
          />
          <Image
            src="/icons/ellipse.svg"
            height={30}
            width={30}
            alt="ellipse"
            className="h-[24px] w-auto absolute top-30 left-0"
          />
          <Link
            href="#"
            className=" absolute bottom-0 top-40 text-base text-[#5C677D] font-normal underline"
          >
            Apprendre plus
          </Link>
        </div>
        <picture className="flex-[1] md:min-w-[500px] md:pt-7">
          <Image
            src="/icons/train.svg"
            height={415}
            width={755}
            alt="training illustration"
            className="object-cover w-full h-auto"
          />
        </picture>
      </div>
    </section>
  )
}
export default Teaching
