import Image from "next/image";

const LogoSvg = () => (
  <Image
    src="/beauty-care-full-logo.png"
    alt="Logo"
    width={308}
    height={54}
    className="w-auto h-8 sm:h-10 md:h-[54px] block"
  />
);

export default LogoSvg;
