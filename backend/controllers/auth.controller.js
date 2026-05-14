import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const cookieName = process.env.JWT_COOKIE_NAME || "sip_token";
const isProd = process.env.NODE_ENV === "production";

const registerUser = async (req, res) => {
  let conn;
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }
    conn = await pool.getConnection();
    const [existing] = await conn.query(
      "SELECT user_id FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(" ") || null;

    await conn.beginTransaction();

    const [result] = await conn.query(
      `
      INSERT INTO users
      (name, email, password)
      VALUES (?, ?, ?)
      `,
      [name, email, hashedPassword]
    );

    const userId = Number(result.insertId);

    await conn.query(
      `
      INSERT INTO investors
      (
        investor_id,
        user_id,
        first_name,
        last_name,
        email
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [userId, userId, firstName, lastName, email]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId
    });
  } catch (err) {
    if (conn) {
      try {
        await conn.rollback();
      } catch {
        // rollback best effort
      }
    }
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  } finally {
    if (conn) conn.release();
  }
};

const loginUser = async (req, res) => {
  let conn;
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
    conn = await pool.getConnection();
    const [rows] = await conn.query(
      `
      SELECT *
      FROM users
      WHERE email = ?
      `,
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email"
      });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }
    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/"
    });
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  } finally {
    if (conn) conn.release();
  }
};

const logoutUser = (req, res) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/"
  });
  res.json({
    success: true,
    message: "Logged out"
  });
};

export { registerUser, loginUser, logoutUser };