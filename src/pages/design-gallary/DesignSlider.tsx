import ImageSliderTemplate from '../../components/ImageSliderTemplate';

const designData = [
  {
    title: 'Inspiring Kitchen Designs',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1556911261-6bd341186b2f?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    link: '/modular-kitchen'
  },
  {
    title: 'Wardrobe Designs That Wow',
    images: [
      'https://images.unsplash.com/photo-1558997519-83c9716d76a3?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1596079890744-c1a0462d0975?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    link: '/wardrobe-designs'
  },
  {
    title: 'Bedroom Designs That Spell Comfort',
    images: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1617325247774-5380be363c06?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    link: '/bedroom-designs'
  },
  {
    title: 'Vibrant Living Room Designs',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    link: '/living-room-designs'
  },
  {
    title: 'Refreshingly Chic Bathroom Designs',
    images: [
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    link: '/bathroom-designs'
  }
];


const DesignSlider = () => {
  return (
    <>
      {designData.map((design, index) => (
        <ImageSliderTemplate
          key={index}
          images={design.images}
          title={design.title}
          link={design.link}
        />
      ))}
    </>
  );
};

export default DesignSlider;
