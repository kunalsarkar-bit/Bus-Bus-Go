require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db"); // Updated import
const userRoutes = require("./Routes/userRoutes");
const busRoutes = require("./Routes/busRoutes");
const bookingRoutes = require("./Routes//bookingRoutes");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
connectDB(); // This will handle the connection

// MongoDB connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/buses", busRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

//  Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Bypass SSL verification
  },
});

// Email-to-SMS gateway mapping
const carrierGateways = {
  verizon: "vtext.com",
  att: "txt.att.net",
  tmobile: "tmomail.net",
  sprint: "messaging.sprintpcs.com",
};

// API endpoint
app.post("/api/send-contact", async (req, res) => {
  try {
    const { name, email, subject, message, phoneNumber, carrier } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Email options for support team
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.SUPPORT_EMAIL || "support@yourdomain.com",
      subject: `New Contact Form: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
        ${phoneNumber ? `Phone: ${phoneNumber}` : ""}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        ${phoneNumber ? `<p><strong>Phone:</strong> ${phoneNumber}</p>` : ""}
      `,
    };

    // Send email to support
    await transporter.sendMail(mailOptions);

    // If phone number and carrier provided, send SMS via email gateway
    if (phoneNumber && carrier && carrierGateways[carrier]) {
      const smsMailOptions = {
        from: process.env.EMAIL_USER,
        to: `${phoneNumber.replace(/\D/g, "")}@${carrierGateways[carrier]}`,
        subject: "New contact form submission",
        text: `New message from ${name}: ${message.substring(0, 140)}...`,
      };

      await transporter.sendMail(smsMailOptions);
    }

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle shutdown gracefully
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed due to app termination");
  process.exit(0);
});

module.exports = app;
