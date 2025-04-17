import { useState } from 'react';

interface Item {
  category: string;
  name: string;
  units: number;
  size: string;
}

export default function SimpleInteriorDesignForm() {
  const FullMenuItems = [
    { name: "Design Gallery", href: "design-gallary" },
    { name: "Modular Kitchen", href: "modular-kitchen" },
    { name: "Wardrobe", href: "wardrobe" },
    { name: "Bedroom", href: "bedroom" },
    { name: "Living Room", href: "living-room" },
    { name: "Bathroom", href: "bathroom" },
    { name: "Space Saving Furniture", href: "space-saving-furniture" },
  ];

  const CategoryItems = {
    "Modular Kitchen": [
      "Kitchen Cabinets",
      "Kitchen Island",
      "Countertop",
      "Pantry Unit",
      "Tall Unit",
      "Corner Unit",
      "Sink Unit",
      "Appliance Housing"
    ],
    "Wardrobe": [
      "Walk-in Closet",
      "Sliding Door Wardrobe",
      "Hinged Door Wardrobe",
      "Corner Wardrobe",
      "Dresser Unit",
      "Shoe Cabinet"
    ],
    "Bedroom": [
      "Bed Frame",
      "Side Tables",
      "Dressing Table",
      "TV Unit",
      "Study Table",
      "Storage Bench",
      "Wall Shelves"
    ],
    "Living Room": [
      "TV Console",
      "Entertainment Unit",
      "Display Cabinet",
      "Wall Unit",
      "Storage Cabinet",
      "Book Shelf",
      "Shoe Cabinet"
    ],
    "Bathroom": [
      "Vanity Unit",
      "Mirror Cabinet",
      "Tall Storage Unit",
      "Wall Cabinet",
      "Linen Cabinet",
      "Under-sink Cabinet"
    ],
    "Space Saving Furniture": [
      "Murphy Bed",
      "Folding Table",
      "Nested Tables",
      "Storage Ottoman",
      "Wall-mounted Desk",
      "Expandable Dining Table"
    ],
    "Design Gallery": [
      "Custom Design",
      "Theme Package",
      "Color Scheme",
      "Material Selection",
      "Lighting Plan"
    ]
  };

  const [items, setItems] = useState<Item[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    category: "",
    name: "",
    units: 1,
    size: ""
  });

  const handleAddItem = () => {
    if (!currentItem.category || !currentItem.name.trim()) {
      alert("Please select a category and an item");
      return;
    }

    setItems([...items, {...currentItem}]);
    setCurrentItem({
      category: currentItem.category, // Keep the same category for convenience
      name: "",
      units: 1,
      size: ""
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Please add at least one item to your requirements");
      return;
    }
    setShowSummary(true);
  };

  const resetForm = () => {
    setItems([]);
    setCurrentItem({
      category: "",
      name: "",
      units: 1,
      size: ""
    });
    setShowSummary(false);
  };

  // Group items by category for the summary
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-3xl mx-auto p-3 sm:p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Interior Design Requirements</h1>
      
      {!showSummary ? (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">Add Items to Your Requirements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={currentItem.category}
                  onChange={(e) => setCurrentItem({
                    ...currentItem,
                    category: e.target.value,
                    name: "" 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {FullMenuItems.map((item) => (
                    <option key={item.href} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <select
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!currentItem.category}
                >
                  <option value="">Select an item</option>
                  {currentItem.category && CategoryItems[currentItem.category]?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
                <input
                  type="number"
                  min="1"
                  value={currentItem.units}
                  onChange={(e) => setCurrentItem({...currentItem, units: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size/Dimensions</label>
                <input
                  type="text"
                  value={currentItem.size}
                  onChange={(e) => setCurrentItem({...currentItem, size: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 2x3 ft"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              disabled={!currentItem.category || !currentItem.name.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              Add Item
            </button>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Size</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{item.category}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{item.units}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">{item.size || '-'}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            type="submit"
            disabled={items.length === 0}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-300"
          >
            Generate Summary
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 p-3 sm:p-6 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Requirements Summary</h2>
          
          <div className="grid gap-4 sm:gap-6">
            {Object.keys(groupedItems).map((category) => (
              <div key={category} className="bg-white p-3 sm:p-4 rounded-md shadow-sm">
                <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2 sm:mb-3">{category}</h3>
                <ul className="pl-4 sm:pl-5 space-y-1 sm:space-y-2">
                  {groupedItems[category].map((item, index) => (
                    <li key={index} className="text-sm sm:text-base text-gray-700">
                      <span className="font-medium">{item.name}</span>: {item.units} unit(s)
                      {item.size && <span className="block sm:inline sm:ml-1">Size: {item.size}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
            <button
              onClick={resetForm}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create New Requirements
            </button>
            <button
              onClick={() => setShowSummary(false)}
              className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white text-sm sm:text-base rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Edit Requirements
            </button>
            <button
              onClick={() => {console.log('Requirements submitted:', items)}}
              className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white text-sm sm:text-base rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Submit Requirements
            </button>
          </div>
        </div>
      )}
    </div>
  );
}