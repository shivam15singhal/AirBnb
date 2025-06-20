import React, { useEffect, useState } from "react";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>You haven’t booked any stays yet.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "20px",
              padding: "10px",
            }}
          >
            <h3>{booking.listing?.title || "Listing"}</h3>
            <p>📍 {booking.listing?.location}</p>
            <p>
              🗓 {new Date(booking.checkIn).toDateString()} -{" "}
              {new Date(booking.checkOut).toDateString()}
            </p>
            <p>👥 Guests: {booking.guests}</p>
            {booking.listing?.image && (
              <img
                src={booking.listing.image}
                alt="Listing"
                width="200"
                style={{ marginTop: "10px" }}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default BookingsPage;
