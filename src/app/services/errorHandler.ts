export const defaultError = "Unknown error occured";
export const defaultErrorCode = 400;

export class VeytError extends Error {
  code: number;
  message: string;

  constructor(code: number, message: string) {
    super();
    
    this.code = code;
    this.message = message;
  }
}