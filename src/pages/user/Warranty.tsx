import React, { useState } from "react";

const WarrantyClaimPage = () => {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [claims, setClaims] = useState<{ ticketId: string; status: string }[]>([]);

  const projectItems = {
    "Modular Kitchen": ["Item 1", "Item 2"],
    "Wardrobe": ["Item 3", "Item 4"],
    "False Ceiling": ["Item 5", "Item 6"],
    "TV Unit": ["Item 7", "Item 8"],
    "Lighting": ["Item 9", "Item 10"],
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const generateTicketId = () => {
    // Simple ticket ID generation logic
    return `TICKET-${Date.now()}`; // Example: TICKET-1634567890123
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ticketId = generateTicketId(); // Generate a new ticket ID

    const formData = {
      project: selectedProject,
      item: selectedItem,
      images,
      description,
      ticketId, // Include generated ticket ID
    };

    console.log("Submitted warranty claim:", formData);
    // Submit formData to API here

    setClaims([...claims, { ticketId, status: "Pending" }]);
    // Reset form fields
    setSelectedProject("");
    setSelectedItem("");
    setImages([]);
    setDescription("");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Warranty Claim</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm"
      >
        {/* Project Selector */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Project
          </label>
          <select
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              setSelectedItem("");
            }}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">-- Select a Project --</option>
            {Object.keys(projectItems).map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>

        {/* Item Selector */}
        {selectedProject && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Item from Your Project
            </label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">-- Select an Item --</option>
              {projectItems[selectedProject].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Upload Photos of Affected Area
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-500 file:text-white hover:file:bg-red-600"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Submit Claim
          </button>
        </div>
      </form>

      {/* Existing Claims Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Existing Claims</h2>
        <ul className="space-y-2">
          {claims.map((claim, index) => (
            <li key={index} className="p-4 border border-gray-300 rounded-md">
              <p><strong>Ticket ID:</strong> {claim.ticketId}</p>
              <p><strong>Status:</strong> {claim.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WarrantyClaimPage;
