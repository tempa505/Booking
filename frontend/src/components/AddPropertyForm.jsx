import React, { useState } from "react";
import { createProperty } from "../api/propertyApi";
import { useNavigate } from "react-router-dom";

const AddPropertyForm = ({ setProperties }) => {
  const [formData, setFormData] = useState({
    name: "",                // <-- added name here
    pricePerNight: "",
    location: "",
    locationDescription: "",
    propertyDescription: "",
    contactNumber: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      // Limit max 5 images, max 5MB each
      const selectedFiles = Array.from(files).slice(0, 5);

      const validFiles = selectedFiles.filter(
        (file) =>
          file.size <= 5 * 1024 * 1024 &&
          ["image/jpeg", "image/png", "image/webp"].includes(file.type)
      );

      setFormData((prev) => ({ ...prev, images: validFiles }));

      // Generate previews
      const previews = validFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form with images using FormData
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", formData.name); // use real name from input
    payload.append("pricePerNight", formData.pricePerNight);
    payload.append("location", formData.location);
    payload.append("locationDescription", formData.locationDescription);
    payload.append("propertyDescription", formData.propertyDescription);
    payload.append("contactNumber", formData.contactNumber);

    formData.images.forEach((image) => {
      payload.append("images", image);
    });

    try {
      const created = await createProperty(payload); // Adjust backend to accept multipart/form-data
      setProperties((prev) => [...prev, created]);
      navigate("/");
    } catch (error) {
      console.error("Error posting property:", error);
      alert("Failed to post property. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg max-w-xl w-full p-8"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-bold mb-4 text-center">
          List your property on Tempa.com and start welcoming guests!
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Fill in the details of the property you want to list
        </p>

        {/* Property Name */}
        <div className="mb-6">
          <label className="block text-gray-800 font-semibold mb-1">
            Property Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter the property name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block text-gray-800 font-semibold mb-1">
            Price (per night)
          </label>
          <input
            type="number"
            name="pricePerNight"
            placeholder="Enter the price per night"
            value={formData.pricePerNight}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min={0}
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-gray-800 font-semibold mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Start typing a location..."
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <small className="text-gray-500 mt-1 block">
            Enter the city and state of the property
          </small>
        </div>

        {/* Location Description */}
        <div className="mb-6">
          <label className="block text-gray-800 font-semibold mb-1">
            Location Description
          </label>
          <input
            type="text"
            name="locationDescription"
            placeholder="Ex. Near downtown, quiet neighborhood"
            value={formData.locationDescription}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <small className="text-gray-500 mt-1 block">
            Provide a brief description of the location
          </small>
        </div>

        {/* Property Description */}
        <div className="mb-6">
          <label className="block text-gray-800 font-semibold mb-1">
            Property Description
          </label>
          <textarea
            name="propertyDescription"
            placeholder="Describe the apartment, its features, and amenities"
            value={formData.propertyDescription}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
          <small className="text-gray-500 mt-1 block">
            Provide a detailed description of the apartment
          </small>
        </div>

        {/* Contact Number */}
        <div className="mb-6">
          <label className="block text-gray-800 font-semibold mb-1">
            Contact Number
          </label>
          <input
            type="tel"
            name="contactNumber"
            placeholder="Ex: +97517576579"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <small className="text-gray-500 mt-1 block">
            Enter a valid contact number
          </small>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-800 font-semibold mb-1">
            Upload Images
          </label>
          <input
            type="file"
            name="images"
            accept=".jpg,.png,.webp"
            multiple
            onChange={handleChange}
            className="w-full"
          />
          <small className="text-gray-500 mt-1 block">
            Upload images of the apartment (max 5MB each, .jpg, .png, .webp)
          </small>
          {/* Image preview */}
          <div className="flex flex-wrap gap-3 mt-3">
            {imagePreviews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Preview ${i + 1}`}
                className="w-20 h-20 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-md"
        >
          Post Property
        </button>
      </form>
    </div>
  );
};

export default AddPropertyForm;
