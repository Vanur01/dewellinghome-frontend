import ImageSliderTemplate from '../../components/ImageSliderTemplate';

const sliderData = [
  {
    title: 'End-to-End Offerings',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b46539b?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-05c0f3536f81?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1600607687920-456c82854ad1?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    link: '/design-gallary'
  },
  {
    title: 'Modular Kitchen Designs',
    images: [
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1556912167-f556f1f39faa?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1556911261-6bd341186b2f?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1556909190-d9b181e061c9?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1556909114-cc85c70740db?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1556909114-bd41c148ca35?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    link: '/modular-kitchen'
  },
  {
    title: 'Living Room Designs',
    images: [
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    link: '/living-room'
  },
  {
    title: 'Wardrobe Designs',
    images: [
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1616048056617-93b94a339009?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1616046386594-c152babc9e15?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1616137356540-b13b2a04a507?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1616137356444-e6c269804bc9?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1616137356292-4dacab808c0e?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    link: '/wardrobe'
  }
];


const ImageSlider = () => {
  return (
    <>
      {sliderData.map((data, index) => (
        <ImageSliderTemplate
          key={index}
          images={data.images}
          title={data.title}
          link={data.link}
        />
      ))}
    </>
  );
};

export default ImageSlider;
