import { Link } from "react-router-dom";
const Navbar = () => {
  const menuItems = [
    { name: "Design Gallery", href: "design-gallery" },
    { name: "Modular Kitchen", href: "modular-kitchen" },
    { name: "Bedroom", href: "bedroom" },
    { name: "Living Room", href: "living-room" },
  ];

  const FullMenuItems = [
    { name: "Design Gallery", href: "design-gellery" },
    { name: "Modular Kitchen", href: "modular-kitchen" },
    { name: "Wardrobe", href: "wardrobe" },
    { name: "Bedroom", href: "bedroom" },
    { name: "Living Room", href: "living-room" },
    { name: "Bathroom", href: "bathroom" },
    { name: "Space Saving Furniture", href: "space-saving-furniture" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky z-20">
      <div className="px-4 sm:px-6 lg:px-16">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center h-full gap-3">
            <img
              className="w-10 h-9 object-contain"
              src="/images/Dwelling_home.png"
              alt="DwellingHome Logo"
            />
            <h2 className="text-xl font-poppins tracking-tight">
              <span className="font-semibold text-gray-700">Dewelling</span>
              <span className="font-medium text-red-600">Home</span>
            </h2>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:justify-between md:items-center-safe ">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-red-600 px-2 py-1 text-xs"
              >
                {item.name}
              </Link>
            ))}
            <div className="text-gray-600 px-3 py-2 group">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute w-48 bg-white shadow-lg rounded-md py-1 transition-all duration-300 ease-in-out z-30">
                {FullMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className="block px-4 py-2 text-xs text-gray-700 hover:text-red-600 font-normal"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link
                to={"/get-estimate"}
                className="bg-red-600 text-white px-6 py-3 rounded-md text-sm font-medium"
              >
                Get Free Estimate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
