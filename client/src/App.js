import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import ListingDetails from "./pages/ListingDetails";
import BookingsPage from "./pages/BookingsPage";
import HostDashboard from "./pages/HostDashboard";
import ListingDetailPage from "./pages/ListingDetailPage";
import MyBookingsPage from './pages/MyBookingsPage';
import CreateListing from "./pages/CreateListing";




// Components
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/host" element={<HostDashboard />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/host/dashboard" element={<HostDashboard />} />



      </Routes>
    </Router>
  );
}

export default App;
