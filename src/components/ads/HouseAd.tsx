type Props = {
  href: string;         // clickthrough
  img: string;          // /ads/your-banner.jpg (public folder)
  alt: string;
  className?: string;
  newTab?: boolean;
};

export default function HouseAd({ href, img, alt, className = "", newTab = true }: Props) {
  return (
    <a
      href={href}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`block ${className}`}
    >
      <img src={img} alt={alt} className="w-full h-auto rounded-xl shadow" />
    </a>
  );
}
