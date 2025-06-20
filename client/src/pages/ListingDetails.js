import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ListingDetail = () => {
  const { id } = useParams();
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
        console.error("Error fetching listing:", err);
      }
    };

    fetchListing();
  }, [id]);

  const handleBooking = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to book");
      return;
    }

    try {
      // Step 1: Create Razorpay Order
      const orderRes = await axios.post(
        "http://localhost:5000/api/bookings/create-order",
        {
          amount: listing.price * 100, // price in paisa
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { order } = orderRes.data;

      // Step 2: Launch Razorpay Checkout
      const options = {
        key: "rzp_test_MNWz7GDc2kDFqz", 
        amount: order.amount,
        currency: "INR",
        name: "StayFinder",
        description: `Booking for ${listing.title}`,
        order_id: order.id,
        handler: async function (response) {
          // Step 3: Store Booking in DB
          try {
            const bookingRes = await axios.post(
              "http://localhost:5000/api/bookings",
              {
                listingId: id,
                checkIn,
                checkOut,
                guests,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            alert("✅ Booking successful!");
          } catch (err) {
            console.error("Error storing booking after payment:", err);
            alert("❌ Booking failed after payment");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
        },
        theme: {
          color: "#ff385c",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Error during payment:", err);
      alert("❌ Booking/payment failed");
    }
  };

  if (!listing) return <p>Loading...</p>;

  return (
    <div className="listing-detail" style={{ padding: "20px" }}>
      <h2>{listing.title}</h2>
      <p><strong>Location:</strong> {listing.location}</p>
      <p><strong>Description:</strong> {listing.description}</p>
      <p><strong>Price:</strong> ₹{listing.price} per night</p>

      {listing.image && (
        <img src={listing.image} alt={listing.title} style={{ width: "400px", marginBottom: "20px" }} />
      )}

      <div style={{ marginBottom: "20px" }}>
        <label>Check-In:</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
        <br /><br />

        <label>Check-Out:</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
        <br /><br />

        <label>Guests:</label>
        <input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          style={{ marginLeft: "10px", width: "50px" }}
        />
      </div>

      <button
        onClick={handleBooking}
        style={{
          padding: "10px 20px",
          backgroundColor: "#ff385c",
          color: "white",
          border: "none",
        }}
      >
        Book Now
      </button>
    </div>
  );
};

export default ListingDetail;
