import { User } from './User';
import { DocumentReference, Timestamp } from 'firebase/firestore';

export interface Glide {
  id: string;
  uid: string;
  content: string;
  user: User | DocumentReference;
  likesCount: number;
  subglidesCount: number;
  date: Timestamp;
}
