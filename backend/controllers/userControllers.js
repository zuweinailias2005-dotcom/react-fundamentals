import { loginUser, registerUser } from "../services/userServices.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const user = await registerUser(name, email, password);

    res.status(201).json({
      message: "User registered successfully.",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful.",
      user,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
}