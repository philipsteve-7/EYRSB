const express = require('express');
const cors = require('cors'); // Import CORS
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;
app.use(express.json());

// Enable CORS for the frontend URL
app.use(cors({
  origin: 'https://eyrsmain.onrender.com', // The React frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Home page API
app.get('/', (req, res) => {
  res.send("<h1 align=center>Welcome to the MERN Stack Recipie Platform</h1>");
});

// Registration page API
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.json({ message: "User Registered.." });
    console.log("User Registration completed...");
  } catch (err) {
    console.log(err);
  }
});

// Login page API
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    res.json({ message: "Login Successful", username: user.username });
  } catch (err) {
    console.log(err);
  }
});

mongoose.connect(process.env.MONGO_URL).then(
  () => console.log("DB connected successfully..")
).catch(
  (err) => console.log(err)
);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server is running on port :" + PORT);
});
