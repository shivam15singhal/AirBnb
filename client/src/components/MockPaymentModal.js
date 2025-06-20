import React, { useState } from "react";

const MockPaymentModal = ({ onClose, onSuccess }) => {
  const [cardNumber, setCardNumber] = useState("");

  const handlePayment = () => {
    if (cardNumber.length < 12) {
      alert("Enter valid mock card number");
      return;
    }
    alert("💳 Mock Payment Successful");
    onSuccess(); // Proceed to booking
  };

  return (
    <div className="modal">
      <h3>Mock Payment</h3>
      <input
        type="text"
        placeholder="Enter Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />
      <button onClick={handlePayment}>Pay</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default MockPaymentModal;
