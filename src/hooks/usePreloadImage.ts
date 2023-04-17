import { useEffect, useState } from 'react';

export const usePreloadImage = (image: string, emptyImage: string) => {
  const [preloadedImage, setPreloadedImage] = useState(emptyImage);
  useEffect(() => {
    const imageInstance = new Image();
    imageInstance.onload = () => {
      setPreloadedImage(image);
    };
    imageInstance.onerror = () => {
      setPreloadedImage(emptyImage);
    };
    imageInstance.src = image;
  }, [image, emptyImage]);
  return preloadedImage;
};
