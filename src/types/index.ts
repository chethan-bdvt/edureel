export type GradeLevel =
  | 'Nursery & Pre-K'
  | 'Grade 1-2'
  | 'Grade 3-5'
  | 'Grade 6-8';

export type SubjectCategory =
  | 'Mathematics'
  | 'Science'
  | 'English'
  | 'Social Studies'
  | 'Computer Science'
  | 'Languages'
  | 'Nursery & Pre-K'
  | 'Other / Custom';

export type AnimationType =
  | 'space'
  | 'biology'
  | 'math'
  | 'safari'
  | 'science'
  | 'history';

export interface QuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Author {
  name: string;
  handle: string;
  avatar?: string;
  gradeBadge?: string;
  verified?: boolean;
  isOfficialAdmin?: boolean;
  followers?: string;
  isFollowing?: boolean;
}

export interface ReelVideo {
  id: string;
  title: string;
  subtitle: string;
  subject: SubjectCategory;
  grade: GradeLevel;
  duration: string;
  author: Author;
  likes: number;
  commentsCount: number;
  sharesCount: number;
  tags: string[];
  summary: string;
  keyPoints: string[];
  audioScript: string;
  quiz: QuizItem;
  imageAsset?: string;
  animationType: AnimationType;
  isUserCreated?: boolean;
  createdAt?: string;
  isLiked?: boolean;
  isSaved?: boolean;
  channelId?: string; // Optional reference to teacher's community channel
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
  isLiked?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  max: number;
  category: string;
}

export interface LearningGoal {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  unit: string;
  completed: boolean;
}

export interface UserProfile {
  name: string;
  grade: GradeLevel;
  avatar: string;
  overallProgress: number;
  videosWatched: number;
  quizzesCompleted: number;
  badgesEarned: number;
  subjectProgress: Record<string, number>;
  screenTimeLimitMinutes: number;
  screenTimeUsedMinutes: number;
  parentalPin: string;
  parentalControlsActive: boolean;
  language: string;
}

export interface AdData {
  id: string;
  sponsorName: string;
  headline: string;
  tagline: string;
  imageAsset: string;
  ctaText: string;
  durationSeconds: number;
}

export type ScreenId =
  | 'feed'
  | 'detail'
  | 'ai-assistant'
  | 'request-video'
  | 'explore'
  | 'community'
  | 'progress'
  | 'achievements'
  | 'settings'
  | 'admin-dashboard'
  | 'admin-post';

// === User Roles, Authentication & Community Channels ===
export type UserRole = 'student' | 'teacher';

export interface StudentProfile {
  id: string;
  name: string;
  username: string; // Unique username e.g. @chethan
  age: number;
  grade: GradeLevel;
  avatar: string;
  overallProgress: number;
  videosWatched: number;
  isPrimary?: boolean;
}

export interface TeacherProfile {
  id: string;
  name: string;
  subjects: SubjectCategory[]; // Multiple subjects allowed!
  schoolOrOrg?: string;
  avatar: string;
  verified: boolean;
}

export interface EnrolledStudent {
  id: string;
  name: string;
  username: string;
  age: number;
  grade: GradeLevel;
  joinedAt: string;
}

export interface JoinRequest {
  id: string;
  studentId: string;
  studentName: string;
  username: string;
  age: number;
  grade: GradeLevel;
  requestedAt: string;
}

export interface CommunityChannel {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean; // Public or Private
  passcode?: string;
  inviteLink: string; // Shareable invite link e.g. learnloop.edu/join/chan_stem_lab
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  subjects: SubjectCategory[];
  enrolledStudents: EnrolledStudent[];
  pendingRequests: JoinRequest[]; // Students requesting to join via link
  videoIds: string[];
  coverColor: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  authMethod: 'password' | 'verification_link';
  teacherProfile?: TeacherProfile;
  students: StudentProfile[]; // Primary student + siblings
  activeStudentId?: string; // Currently active sibling profile
  joinedChannelIds: string[];
}
