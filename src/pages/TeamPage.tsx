import React from 'react';
import { Linkedin, Twitter, Instagram, Award, ThumbsUp, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeamPage = () => {
  // Team members data remains the same
  const leadershipTeam = [
    // {
    //   name: 'Rajiv Sharma',
    //   position: 'Chief Executive Officer',
    //   image: '/api/placeholder/400/400',
    //   bio: 'With over 20 years of experience in the interior design industry, Rajiv has transformed HomeLane into one of India\'s leading home interior companies.',
    //   social: {
    //     linkedin: '#',
    //     twitter: '#',
    //     instagram: '#'
    //   }
    // },
    // {
    //   name: 'Priya Patel',
    //   position: 'Chief Design Officer',
    //   image: '/api/placeholder/400/400',
    //   bio: 'Award-winning designer with a passion for creating functional, beautiful spaces. Prior to HomeLane, Priya led design teams at top architecture firms.',
    //   social: {
    //     linkedin: '#',
    //     twitter: '#',
    //     instagram: '#'
    //   }
    // },
    {
      name: 'Pratyush Meher',
      position: 'Chief Operation Officer',
      image: '../../public/images/pratyush.jpeg',
      bio: 'Pratyush brings operational excellence to DewellingHome, streamlining processes to ensure timely project delivery and customer satisfaction.',
      social: {
        linkedin: '#',
        twitter: '#',
        instagram: '#'
      }
    }
  ];

  const designTeam = [
    {
      name: 'Ananya Mehta',
      position: 'Senior Interior Designer',
      image: '/api/placeholder/400/400',
      location: 'Mumbai',
      specialty: 'Modern Minimalist'
    },
    {
      name: 'Rohan Kapoor',
      position: 'Interior Designer',
      image: '/api/placeholder/400/400',
      location: 'Delhi NCR',
      specialty: 'Contemporary'
    },
    {
      name: 'Shreya Gupta',
      position: 'Interior Designer',
      image: '/api/placeholder/400/400',
      location: 'Bengaluru',
      specialty: 'Traditional Fusion'
    },
    {
      name: 'Arjun Varma',
      position: 'Interior Designer',
      image: '/api/placeholder/400/400',
      location: 'Hyderabad',
      specialty: 'Industrial Chic'
    },
    {
      name: 'Neha Singh',
      position: 'Interior Designer',
      image: '/api/placeholder/400/400',
      location: 'Chennai',
      specialty: 'Scandinavian'
    },
    {
      name: 'Karan Desai',
      position: 'Interior Designer',
      image: '/api/placeholder/400/400',
      location: 'Pune',
      specialty: 'Mid-Century Modern'
    }
  ];

  // Company stats
  const stats = [
    { number: '10+', label: 'Design Experts', icon: <Users className="h-8 w-8" /> },
    { number: '200+', label: 'Happy Customers', icon: <ThumbsUp className="h-8 w-8" /> },
    { number: '5+', label: 'Design Awards', icon: <Award className="h-8 w-8" /> }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Enhanced with parallax effect */}
      <div className="relative h-[60vh] overflow-hidden bg-red-600">
        <div className="absolute inset-0 bg-[url('/images/team-hero.jpg')] bg-cover bg-center opacity-20 scale-110 transform-gpu"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-red-600/50 to-red-700/90"></div>
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">Meet Our Team</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              The creative minds and skilled professionals behind DewellingHome's exceptional interior designs and customer experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section - Floating cards */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-red-500 to-red-600 inline-block rounded-2xl text-white">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">{stat.number}</h3>
              <p className="text-gray-600 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership Team Section - Modern cards with hover effects */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Our Leadership</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the visionaries guiding DewellingHome to redefine home interior experiences across India.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {leadershipTeam.map((member, index) => (
              <div key={index} className="flex flex-col justify-between group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="aspect-w-4 aspect-h-5 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex justify-center space-x-4">
                      <a href={member.social.linkedin} className="text-white hover:text-red-400 transition-colors">
                        <Linkedin size={24} />
                      </a>
                      <a href={member.social.twitter} className="text-white hover:text-red-400 transition-colors">
                        <Twitter size={24} />
                      </a>
                      <a href={member.social.instagram} className="text-white hover:text-red-400 transition-colors">
                        <Instagram size={24} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">{member.name}</h3>
                  <p className="text-red-600 font-medium mb-4">{member.position}</p>
                  <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Design Team Section - Creative grid layout */}
      {/* <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Design Experts</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our talented team of interior designers brings creativity, expertise, and passion to every project.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {designTeam.map((designer, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-red-100 group-hover:ring-red-200 transition-all duration-300">
                      <img 
                        src={designer.image} 
                        alt={designer.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm">
                      {designer.specialty}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{designer.name}</h3>
                  <p className="text-red-600 mb-3">{designer.position}</p>
                  <p className="text-gray-600">{designer.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
      
      {/* Company Culture Section - Modern layout with animated elements */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl font-bold mb-8 text-gray-800">Our Culture & Values</h2>
              <div className="space-y-8">
                {[
                  { title: 'Customer First', description: 'We put our customers at the center of everything we do, ensuring their vision for their dream home comes to life.' },
                  { title: 'Design Excellence', description: 'We"re committed to exceptional design quality, blending aesthetics with functionality to create spaces that inspire.' },
                  { title: 'Transparency', description: 'We believe in honest communication, from pricing to project timelines, with no hidden costs or surprises.' },
                  { title: 'Innovation', description: 'We continuously push boundaries, embracing new technologies and design approaches to deliver better homes.' }
                ].map((value, index) => (
                  <div key={index} className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-semibold mb-3 text-red-600 group-hover:text-red-700 transition-colors">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-2 gap-6">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c"
                    alt="Modern collaborative workspace" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <img 
                    src="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2"
                    alt="Team collaboration session" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <img 
                    src="https://images.unsplash.com/photo-1604328471151-b52226907017"
                    alt="Design planning meeting" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <img 
                    src="https://images.unsplash.com/photo-1497366811353-6870744d04b2"
                    alt="Modern office culture" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Join Our Team CTA - Creative design */}
      {/* <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-red-600 transform -skew-y-6 origin-top-left"></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Join Our Team</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Are you passionate about interior design? We're always looking for talented individuals to help us create beautiful homes.
          </p>
          <Link 
            to="#" 
            className="inline-flex items-center bg-white text-red-600 hover:bg-red-50 font-medium py-4 px-8 rounded-full text-lg transition-colors duration-300 group"
          >
            View Open Positions
            <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div> */}
    </div>
  );
};

export default TeamPage;