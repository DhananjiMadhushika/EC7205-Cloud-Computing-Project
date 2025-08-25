import { HttpException, ErrorCode } from "./root.js";

export class UnprocessableEntity extends HttpException {
  constructor(errors, message, errorCode) {
    super(message, errorCode, 422, errors);
  }
}