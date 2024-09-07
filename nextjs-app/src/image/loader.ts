const normalizeSrc = (src: string) => {
    return src.startsWith("/") ? src.slice(1) : src;
  };
  
  interface ImageLoaderProps {
    src: string;
    width: number;
    quality?: number;
  }
  
  export default function loader({ src, width, quality }: ImageLoaderProps) {
    const params = [
      `width=${width}`,
      `quality=${quality ?? 75}`,
    ];
    const paramsString = params.join("&");
  
    return `/media/images/${normalizeSrc(src)}?${paramsString}`;
  }