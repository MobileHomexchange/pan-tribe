import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PostImageProps {
  src: string;
  alt: string;
}

export const PostImage = ({ src, alt }: PostImageProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full">
      {loading && (
        <Skeleton className="w-full h-96 rounded-lg" />
      )}
      {error ? (
        <div className="w-full h-96 rounded-lg bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Failed to load image</p>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full rounded-lg max-h-96 object-cover transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}
    </div>
  );
};
