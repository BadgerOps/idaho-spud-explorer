export type SpotType = 'food' | 'hotspring';
export type SpotLocation = 'boise' | 'mccall' | 'both';
export interface Spot {
  id: string;
  name: string;
  type: SpotType;
  location: SpotLocation;
  description: string;
  color: string;
  favoriteCount: number;
  imageUrl?: string;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}