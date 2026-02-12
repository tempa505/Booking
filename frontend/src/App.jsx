import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProperties, deleteProperty } from "./api/propertyApi";
import Signup from "./components/Signup";
import Login from "./components/Login";
import AddProperty from "./components/AddPropertyForm";
import PropertyList from "./components/PropertyList";
import PropertyDetail from "./components/PropertyDetail";

function Home({ properties, handleDelete }) {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `url('https://www.gokitetours.com/wp-content/uploads/2025/02/Top-8-Bhutan-Tourist-Places-to-Visit-in-2025.webp')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center px-4 w-full max-w-4xl">
          <h2 className="text-4xl font-bold mb-2">Discover great stays year-round</h2>
          <p className="text-lg mb-6">
            From charming B&Bs to upscale hotels, find the perfect place to unwind.
          </p>

          {/* Search Form */}
          <form className="bg-white bg-opacity-90 p-4 rounded-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
            <input type="text" placeholder="Where to?" className="border px-3 py-2 rounded w-full text-black" />
            <input type="date" className="border px-3 py-2 rounded w-full text-black" />
            <input type="date" className="border px-3 py-2 rounded w-full text-black" />
            <input type="number" min="1" placeholder="Guests" className="border px-3 py-2 rounded w-full text-black" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Property Listings */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-gray-100">
        {properties.map((property) => (
          <div key={property._id} className="bg-white p-4 shadow rounded border">
            {/* Clickable Hotel Name */}
            <h2 className="text-xl font-semibold">
              <Link to={`/properties/${property._id}`} className="text-blue-600 hover:underline">
                {property.name}
              </Link>
            </h2>
            <p className="text-gray-600">{property.location}</p>
            <p className="text-green-600 font-bold">${property.pricePerNight}/night</p>
            <button
              onClick={() => handleDelete(property._id)}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties().then(setProperties);
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      alert("Failed to delete property.");
      console.error(error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <header className="flex justify-between items-start mb-8">
          <h1 className="text-4xl font-bold text-black-700">ubooking.bt</h1>
          <div className="space-x-4">
            <Link to="/add" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Add Property
            </Link>
            <Link to="/signup" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Sign Up
            </Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Login
            </Link>
          </div>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home properties={properties} handleDelete={handleDelete} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add" element={<AddProperty setProperties={setProperties} />} />
          <Route path="/properties" element={<PropertyList properties={properties} />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
