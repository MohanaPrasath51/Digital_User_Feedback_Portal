
export enum FeedbackCategory {
  SUGGESTION = 'Suggestion',
  COMPLAINT = 'Complaint',
  APPRECIATION = 'Appreciation'
}

export enum FeedbackStatus {
  SUBMITTED = 'Submitted',
  IN_REVIEW = 'In Review',
  RESOLVED = 'Resolved'
}

export interface FeedbackItem {
  id: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  date: string;
  title: string;
  description: string;
  officialResponse?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  isAdmin: boolean;
}

export type Page = 'login' | 'home' | 'submit' | 'track' | 'admin';
