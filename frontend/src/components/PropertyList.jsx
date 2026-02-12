import React from 'react';
import { Link } from 'react-router-dom';

const PropertyList = ({ properties }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property._id} className="border rounded-md p-4 shadow-md">
            {/* Show first image if available */}
            {property.images && property.images.length > 0 && (
              <img
                src={`http://localhost:4000/uploads/${property.images[0]}`}
                alt={property.name}
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}

            {/* Clickable property name */}
            <Link
              to={`/properties/${property._id}`}
              className="block text-xl font-semibold text-blue-600 hover:underline mb-1"
            >
              {property.name}
            </Link>

            {/* Location */}
            <p className="text-gray-600">{property.location}</p>

            {/* Price */}
            <p className="mt-2 text-lg font-bold text-gray-800">
              ${property.pricePerNight}/night
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
