import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/properties/${id}`)  // adjust if needed
      .then((res) => setProperty(res.data))
      .catch((err) => console.error("Error fetching property:", err));
  }, [id]);

  if (!property) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-3xl font-bold mb-4">{property.name}</h2>
      <p className="text-lg text-gray-700 mb-2">{property.location}</p>
      <p className="text-xl text-green-600 font-semibold mb-4">${property.pricePerNight}/night</p>

      {/* Display Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {property.images && property.images.map((image, index) => (
          <img
            key={index}
            src={`http://localhost:4000/uploads/${image}`}  // Adjust based on your server setup
            alt={`Property ${index}`}
            className="w-full h-60 object-cover rounded"
          />
        ))}
      </div>

      <p className="text-gray-800">{property.description}</p>
    </div>
  );
}

export default PropertyDetail;
