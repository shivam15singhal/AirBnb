import React, { useEffect, useState } from "react";
import axios from "axios";

const HostDashboard = () => {
  const [listings, setListings] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchListings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/listings");
        const userListings = res.data.filter(listing => listing.host === user.id);
        setListings(userListings);
      } catch (err) {
        console.error("Failed to fetch listings", err);
      }
    };

    fetchListings();
  }, [user]);

  if (!user) {
    return <div>Please login as a host to view this page.</div>;
  }

  if (!user.isHost) {
    return <div>Access denied. Only hosts can access the dashboard.</div>;
  }

  return (
    <div>
      <h2>Your Listings</h2>
      {listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <ul>
          {listings.map((listing) => (
            <li key={listing._id}>
              <strong>{listing.title}</strong> - {listing.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HostDashboard;
