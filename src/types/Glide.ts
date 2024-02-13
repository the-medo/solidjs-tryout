import { User } from './User';
import { Timestamp } from 'firebase/firestore';

export interface Glide {
  id: string;
  uid: string;
  content: string;
  user: User;
  likesCount: number;
  subglidesCount: number;
  date: Timestamp;
}
