import React, { useState } from "react";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("✅ Registered successfully! You are now logged in.");
        window.location.href = "/";
      } else {
        alert("❌ Registration failed: " + data.message);
        console.error(data);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      alert("Something went wrong. Check the console.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
