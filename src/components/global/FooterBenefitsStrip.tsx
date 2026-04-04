import Image from "next/image";

export function FooterBenefitsStrip() {
  return (
    <div className="mt-10">
      <Image
        src="/assets/images/top-footer.webp"
        alt="Top Footer"
        width={1080}
        height={82}
        className="w-full h-auto"
      />
    </div>
  )
}

