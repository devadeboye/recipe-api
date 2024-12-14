export interface IRefreshToken {
  id?: string;

  /** the content of the refresh token */
  token: string;

  /** the user the token was issued to */
  userId: string;

  /** expiry date of the token */
  expiresAt: Date;

  /** tells if the token has been revoked */
  isRevoked: boolean;
}

export interface IRefreshTokenService {
  generateRefreshToken(): string;

  saveRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<IRefreshToken>;

  fetchRefreshToken(token: string): Promise<IRefreshToken | null>;
}
