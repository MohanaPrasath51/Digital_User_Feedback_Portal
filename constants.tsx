
import { FeedbackCategory, FeedbackStatus, FeedbackItem } from './types';

export const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    id: 'FB-1021',
    category: FeedbackCategory.SUGGESTION,
    status: FeedbackStatus.SUBMITTED,
    date: 'Oct 24, 2023',
    title: 'Dark Mode Support',
    description: 'It would be great to have a native dark mode for the dashboard to reduce eye strain at night.'
  },
  {
    id: 'FB-1022',
    category: FeedbackCategory.COMPLAINT,
    status: FeedbackStatus.IN_REVIEW,
    date: 'Oct 22, 2023',
    title: 'Mobile App Lag',
    description: 'The mobile app seems to lag when switching between the feedback tracking and submission screens.'
  },
  {
    id: 'FB-1023',
    category: FeedbackCategory.APPRECIATION,
    status: FeedbackStatus.RESOLVED,
    date: 'Oct 15, 2023',
    title: 'Great UI Update',
    description: 'Just wanted to say the new dashboard layout is much more intuitive than the previous one!',
    officialResponse: 'Thank you for the kind words! We are glad you like the new interface. We worked hard on making it cleaner for all users.'
  },
  {
    id: 'FB-1024',
    category: FeedbackCategory.SUGGESTION,
    status: FeedbackStatus.RESOLVED,
    date: 'Sep 28, 2023',
    title: 'Bulk Export',
    description: 'Would love an option to export all my feedback history as a CSV file.',
    officialResponse: 'We have implemented the export feature! You can now find a "Download CSV" button at the bottom of your history page.'
  }
];
