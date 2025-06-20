import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    image: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/listings", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Listing created successfully ✅");
      navigate("/host-dashboard");
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing ❌");
    }
  };

  return (
    <div>
      <h2>Create New Listing</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          required
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          required
          onChange={handleChange}
        />
        <button type="submit">Create Listing</button>
      </form>
    </div>
  );
};

export default CreateListing;
