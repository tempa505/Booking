// models/Property.js
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    locationDescription: {
      type: String,
      default: "",
    },
    propertyDescription: {
      type: String,
      default: "",
    },
    contactNumber: {
      type: String,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String, // store image filenames or full URLs
      },
    ],
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
