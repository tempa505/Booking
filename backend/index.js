
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// In server.js or index.js
import authRoutes from "./auth.js";

app.use('/api', authRoutes); // makes the full path /api/signup



const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
import mongoose from "mongoose";
import Property from "./models/Property.js";

dotenv.config();

const uri = process.env.MONGO_URI;


mongoose.connect(uri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));




// GET / - basic check for backend running
app.get('/', (req, res) => {
  res.send('Booking app backend is running!');
});

// GET /api/properties - get all properties with optional filters and sorting
app.get('/api/properties', async (req, res) => { // <-- Added /api prefix
  try {
    const { location, minPrice, maxPrice, sort } = req.query;

    // Build a query object dynamically
    const query = {};
    if (location) {
      query.location = { $regex: location, $options: 'i' }; // case-insensitive search
    }
    if (minPrice) {
      query.pricePerNight = { ...query.pricePerNight, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      query.pricePerNight = { ...query.pricePerNight, $lte: Number(maxPrice) };
    }

    let propertiesQuery = Property.find(query);

    // Sorting
    if (sort === 'price_asc') {
      propertiesQuery = propertiesQuery.sort({ pricePerNight: 1 });
    } else if (sort === 'price_desc') {
      propertiesQuery = propertiesQuery.sort({ pricePerNight: -1 });
    }

    const properties = await propertiesQuery.exec();

    res.json(properties);
  } catch (error) {
    console.error('GET /api/properties error:', error); // <-- Updated log message
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET /api/properties - get all properties with optional filters and sorting
// This route fetches a list of properties, allowing filtering by location, price range, and sorting.
app.get('/api/properties', async (req, res) => {
  try {
    const { location, minPrice, maxPrice, sort } = req.query;

    // Build a query object dynamically based on provided filters
    const query = {};
    if (location) {
      // Case-insensitive search for location using regex
      query.location = { $regex: location, $options: 'i' };
    }
    if (minPrice) {
      // Add greater than or equal to filter for price
      query.pricePerNight = { ...query.pricePerNight, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      // Add less than or equal to filter for price
      query.pricePerNight = { ...query.pricePerNight, $lte: Number(maxPrice) };
    }

    // Start building the Mongoose query
    let propertiesQuery = Property.find(query);

    // Apply sorting based on the 'sort' query parameter
    if (sort === 'price_asc') {
      propertiesQuery = propertiesQuery.sort({ pricePerNight: 1 }); // Ascending order
    } else if (sort === 'price_desc') {
      propertiesQuery = propertiesQuery.sort({ pricePerNight: -1 }); // Descending order
    }

    // Execute the query to get the properties from the database
    const properties = await propertiesQuery.exec();

    // Send the fetched properties as a JSON response
    res.json(properties);
  } catch (error) {
    // Log any errors that occur during the process
    console.error('[BACKEND LOG] GET /api/properties error:', error);
    // Send a 500 Internal Server Error response to the client
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/properties/:id - get full details of a single property by ID
// This route fetches the detailed information for a single property using its unique ID.
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the URL parameters

    // --- IMPORTANT DEBUGGING LOGS ---
    console.log(`[BACKEND LOG] Received GET request for property ID: ${id}`);

    // Find the property in the database by its ID
    const property = await Property.findById(id);

    // --- IMPORTANT DEBUGGING LOGS ---
    if (!property) {
      // If no property is found with the given ID, log it and send a 404 Not Found response
      console.log(`[BACKEND LOG] Property with ID ${id} was NOT found in the database.`);
      return res.status(404).json({ error: 'Property not found' });
    } else {
      // If property is found, log its name (or other identifying info)
      console.log(`[BACKEND LOG] Property with ID ${id} WAS found. Name: "${property.name}"`);
    }

    // Send the found property details as a JSON response
    res.json(property);
  } catch (error) {
    // Log any errors that occur during the process (e.g., invalid ID format, database issues)
    console.error('[BACKEND LOG] Error in GET /api/properties/:id:', error);
    // Send a 500 Internal Server Error response to the client
    res.status(500).json({ error: 'Internal server error' });
  }
});




// PUT /properties/:id - update property by ID
app.put('/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(updatedProperty);
  } catch (error) {
    console.error('PUT /properties/:id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE /properties/:id - delete property by ID
app.delete('/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Property deleted', property: deletedProperty });
  } catch (error) {
    console.error('DELETE /properties/:id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
