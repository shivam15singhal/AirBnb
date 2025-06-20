import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [guests, setGuests] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/listings");
        setListings(res.data);
        setFilteredListings(res.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, []);

  const handleFilter = () => {
    let results = listings;

    if (location.trim()) {
      results = results.filter((item) =>
        item.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minPrice) {
      results = results.filter((item) => item.price >= parseInt(minPrice));
    }

    if (maxPrice) {
      results = results.filter((item) => item.price <= parseInt(maxPrice));
    }

    if (guests) {
      results = results.filter(
        (item) => item.guests && item.guests >= parseInt(guests)
      );
    }

    setFilteredListings(results);
  };

  return (
    <div className="container">
      <h2>🏠 StayFinder Listings</h2>

      <div className="filter-container" style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
        <button onClick={handleFilter}>Search</button>
      </div>

      <div className="listing-grid" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filteredListings.map((listing) => (
          <div
            key={listing._id}
            className="listing-card"
            onClick={() => navigate(`/listing/${listing._id}`)}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "300px",
              cursor: "pointer",
              borderRadius: "8px"
            }}
          >
            <img
              src={listing.image}
              alt={listing.title}
              style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "5px" }}
            />
            <h3>{listing.title}</h3>
            <p>{listing.location}</p>
            <p>₹{listing.price}/night</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
