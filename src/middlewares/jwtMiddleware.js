import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { match } from "path-to-regexp";
import { env } from "~/config/environment";

const white_lists = [
  { method: "GET", path: "/" },
  { method: "POST", path: "/users/register" },
  { method: "POST", path: "/users/login" },
  { method: "GET", path: "/post" },
  { method: "GET", path: "/post/:id" },
]; // danh sach cac api ko can token

const matchers = white_lists.map(({ method, path }) => ({
  method,
  matcher: match("/v1" + path, { decode: decodeURIComponent }),
}));

export const jwtMiddleware = (req, res, next) => {
  const method = req.method.toUpperCase();

  if (
    matchers.some(
      ({ method: allowedMethod, matcher }) =>
        allowedMethod === method && matcher(req.originalUrl)
    )
  ) {
    console.log("dont need token");
    return next();
  }

  if (req?.headers?.authorization?.split(" ")[1]) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      console.log("decode middleware", decoded);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.message.includes("expired")) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Token expired",
        });
      } else if (error.message.includes("invalid")) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Invalid token",
        });
      }
    }
  } else {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid token or expired",
    });
  }
};
