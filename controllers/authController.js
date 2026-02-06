const User = require('../models/User');
const bcrypt = require('bcryptjs');

// =======================
// 📝 SIGNUP CONTROLLER
// =======================
const signup = async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

    // ✅ Validate required fields (MATCHES MODEL)
    if (!name || !email || !password || !department) {
      return res.status(400).json({
        message: 'Name, Email, Password and Department are required',
      });
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create user (FIELDS MATCH MODEL)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      department,
      role: role || 'Employee',
    });

    // ✅ Response
    res.status(201).json({
      message: 'Signup successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'Signup failed',
    });
  }
};

// =======================
// 🔐 LOGIN CONTROLLER
// =======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Login failed',
    });
  }
};

module.exports = { signup, login };
