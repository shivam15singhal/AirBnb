import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error("Error fetching listing details:", err);
      }
    };

    fetchListing();
  }, [id]);

  const handleBooking = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to book.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          listing: id,
          checkIn,
          checkOut,
          guests,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Booking successful!");
      navigate("/my-bookings");
    } catch (err) {
      console.error("Booking error:", err);
      alert("❌ Booking failed.");
    }
  };

  if (!listing) return <p>Loading listing...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold mb-4">{listing.title}</h2>
      <img
        src={listing.image}
        alt={listing.title}
        className="w-full h-64 object-cover rounded-xl mb-4"
      />
      <p className="text-gray-700 mb-2">{listing.description}</p>
      <p className="text-gray-500 mb-2">📍 {listing.location}</p>
      <p className="text-lg font-medium mb-4">💰 ${listing.price} per night</p>

      <div className="border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">Book This Stay</h3>
        <div className="flex flex-col gap-2">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            value={guests}
            min="1"
            onChange={(e) => setGuests(e.target.value)}
            className="p-2 border rounded"
            placeholder="Number of guests"
          />
          <button
            onClick={handleBooking}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
