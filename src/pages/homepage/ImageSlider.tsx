import ImageSliderTemplate from '../../components/ImageSliderTemplate';
import useGalleryStore from '../../store/public/gallery.store';
import { useEffect } from 'react';

const ImageSlider = () => {
  const { galleries, getAllGalleries } = useGalleryStore();

  useEffect(() => {
    getAllGalleries();
  }, []);

  return (
    <>
      {galleries.map((gallery) => (
        <ImageSliderTemplate
          key={gallery._id}
          galleryId={gallery._id}
          title={gallery.title}
          link={`/gallery/${gallery._id}`}
        />
      ))}
    </>
  );
};

export default ImageSlider;
