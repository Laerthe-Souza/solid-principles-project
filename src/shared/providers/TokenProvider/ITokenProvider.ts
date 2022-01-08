export interface ITokenProvider {
  generateToken(data: string): string;
  verifyToken(token: string): string;
}
