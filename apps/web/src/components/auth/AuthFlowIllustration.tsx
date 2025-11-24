import Image from "next/image";

interface AuthFlowIllustrationProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export function AuthFlowIllustration({ src, alt, width = 550, height = 550 }: AuthFlowIllustrationProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority
      className="relative drop-shadow-2xl transition-transform hover:scale-105"
    />
  );
}
