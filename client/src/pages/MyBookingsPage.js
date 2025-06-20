import React, { useEffect, useState } from "react";
import axios from "axios";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bookings/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user, token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              <strong>{booking.listing.title}</strong> in{" "}
              {booking.listing.location} <br />
              Check-in: {new Date(booking.checkIn).toLocaleDateString()} <br />
              Check-out: {new Date(booking.checkOut).toLocaleDateString()} <br />
              Guests: {booking.guests}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookingsPage;
