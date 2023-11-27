import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import User from "../models/user.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      phoneNumber,
      email,
      password,
      picturePath,
      location,
      accountBalance,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      userName,
      phoneNumber,
      email,
      password: passwordHash,
      picturePath,
      location,
      accountBalance,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email: email });
//     if (!user) return res.status(400).json({ msg: "User does not exist. " });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

//     // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1200s' });
//     // delete user.password;
//     res.status(200).json({ user }); // token, 
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Simple in-memory storage for user sessions
const sessions = {};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    // Assuming you have a sessions object to store user sessions
    const sessionId = Date.now().toString();
    sessions[sessionId] = { userId: user._id, email: user.email };

    res.status(200).json({ sessionId, user }); // Return the sessionId along with user data
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
