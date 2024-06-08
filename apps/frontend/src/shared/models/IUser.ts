export interface IUser {
  email: string;
  isAnalyzed: boolean;
  id: number;
  username: string;
  role: string;
  rank: string;
  ratingPlacement: number;
  grade?: string;
  nickname?: string;
  image?: string;
}
