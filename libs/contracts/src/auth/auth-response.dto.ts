export class AuthResponseDto {
  declare accessToken: string;
  declare user: {
    id: string;
    email: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
}