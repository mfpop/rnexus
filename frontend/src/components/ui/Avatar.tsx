import React, { createContext, useContext, useState } from "react";
import { cn } from "../../lib/utils";

interface AvatarContextType {
  imageLoaded: boolean;
  imageError: boolean;
  setImageLoaded: (loaded: boolean) => void;
  setImageError: (error: boolean) => void;
}

const AvatarContext = createContext<AvatarContextType | null>(null);

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children, ...props }, ref) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
      <AvatarContext.Provider
        value={{ imageLoaded, imageError, setImageLoaded, setImageError }}
      >
        <div
          ref={ref}
          className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </AvatarContext.Provider>
    );
  },
);
Avatar.displayName = "Avatar";

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt = "", ...props }, ref) => {
    const context = useContext(AvatarContext);

    if (!context) {
      throw new Error("AvatarImage must be used within an Avatar component");
    }

    const { imageError, setImageLoaded, setImageError } = context;

    const handleLoad = () => {
      console.log("✅ Avatar image loaded successfully:", src);
      setImageLoaded(true);
      setImageError(false);
    };

    const handleError = (
      event: React.SyntheticEvent<HTMLImageElement, Event>,
    ) => {
      console.error("❌ Avatar image failed to load:", src, event);
      setImageLoaded(false);
      setImageError(true);
    };

    if (!src || imageError) {
      return null;
    }

    console.log("🖼️ AvatarImage rendering with src:", src);

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn("aspect-square h-full w-full object-cover", className)}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    );
  },
);
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    const context = useContext(AvatarContext);

    if (!context) {
      throw new Error("AvatarFallback must be used within an Avatar component");
    }

    const { imageLoaded, imageError } = context;

    // Show fallback if no image loaded or there was an error
    if (imageLoaded && !imageError) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-muted",
          className,
        )}
        {...props}
      />
    );
  },
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
