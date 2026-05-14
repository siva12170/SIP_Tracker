import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const cookieName = process.env.JWT_COOKIE_NAME || "sip_token";
    const tokenFromCookie = req.cookies?.[cookieName];
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader ? authHeader.split(" ")[1] : null;
    const token = tokenFromCookie || tokenFromHeader;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

export default verifyToken;