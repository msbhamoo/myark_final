export type StudentProfileVisibility = 'private' | 'teachers' | 'public';

export type StudentProfileCompletionStep =
  | 'profile'
  | 'school'
  | 'academicHistory'
  | 'achievements'
  | 'competitions'
  | 'visibility';

export interface StudentProfileStats {
  currentClass?: string | null;
  gpa?: number | null;
  averageScore?: number | null;
  totalAwards?: number | null;
  competitionsParticipated?: number | null;
}

export interface StudentProfileAcademicSubject {
  id: string;
  name: string;
  marks?: number | null;
  maxMarks?: number | null;
  grade?: string | null;
  teacherComment?: string | null;
}

export interface StudentProfileAcademicYear {
  id: string;
  session?: string | null;
  grade?: string | null;
  board?: string | null;
  schoolName?: string | null;
  summary?: string | null;
  teacherComments?: string | null;
  subjects: StudentProfileAcademicSubject[];
}

export type StudentProfileAchievementLevel =
  | 'school'
  | 'district'
  | 'state'
  | 'national'
  | 'international'
  | 'other';

export interface StudentProfileAchievement {
  id: string;
  title: string;
  description?: string | null;
  level?: StudentProfileAchievementLevel | null;
  year?: string | null;
  certificateUrl?: string | null;
  tags?: string[] | null;
  approved?: boolean | null;
}

export type StudentProfileEventStatus = 'upcoming' | 'ongoing' | 'completed';

export interface StudentProfileCompetition {
  id: string;
  name: string;
  category?: string | null;
  result?: string | null;
  date?: string | null;
  status?: StudentProfileEventStatus | null;
  description?: string | null;
  location?: string | null;
}

export interface StudentProfileExtracurricular {
  id: string;
  name: string;
  role?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: StudentProfileEventStatus | null;
}

export interface StudentProfileSettings {
  allowDownload: boolean;
  showProgressBar: boolean;
}

export interface StudentProfileCompletion {
  percent: number;
  completedSteps: StudentProfileCompletionStep[];
  totalSteps: number;
}

export interface StudentProfile {
  uid: string;
  displayName: string;
  photoUrl?: string | null;
  bannerUrl?: string | null;
  tagline?: string | null;
  bio?: string | null;
  location?: string | null;
  interests: string[];
  visibility: StudentProfileVisibility;
  slug?: string | null;
  shareablePath?: string | null;
  stats: StudentProfileStats;
  schoolId?: string | null;
  schoolInfo: {
    schoolName?: string | null;
    board?: string | null;
    className?: string | null;
    otherSchoolName?: string | null;
    otherBoard?: string | null;
  };
  academicHistory: StudentProfileAcademicYear[];
  achievements: StudentProfileAchievement[];
  competitions: StudentProfileCompetition[];
  extracurriculars: StudentProfileExtracurricular[];
  settings: StudentProfileSettings;
  completion: StudentProfileCompletion;
  createdAt: string | null;
  updatedAt: string | null;
}

export type StudentProfileUpdatePayload = Partial<
  Omit<
    StudentProfile,
    'uid' | 'completion' | 'createdAt' | 'updatedAt' | 'shareablePath'
  >
>;

export interface PublicStudentProfile {
  displayName: string;
  slug: string;
  tagline?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  bannerUrl?: string | null;
  stats: StudentProfileStats;
  schoolInfo: StudentProfile['schoolInfo'];
  academicHighlights: StudentProfileAcademicYear[];
  achievements: StudentProfileAchievement[];
  competitions: StudentProfileCompetition[];
  extracurriculars: StudentProfileExtracurricular[];
  interests: string[];
  createdAt: string | null;
  updatedAt: string | null;
}
