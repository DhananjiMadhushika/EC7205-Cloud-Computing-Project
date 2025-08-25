import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { ErrorCode } from "../exceptions/root.js";

export default function adminMiddleware(req, res, next) {
  const user = req.user;
  if (user && user.role === "ADMIN") {
    return next();
  }
  return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
}
