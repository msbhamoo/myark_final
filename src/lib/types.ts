export interface Category {
  id: string;
  slug: string;
  label: string;
  icon_name: string;
  bg_color: string;
  text_color: string;
  sort_order: number;
  created_at: string;
}

export interface Organiser {
  id: string;
  name: string;
  slug: string;
  website_url: string | null;
  logo_url: string | null;
  description: string | null;
  created_at: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Opportunity {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  organiser_id: string;
  description: string;
  eligibility_classes: number[];
  eligibility_text: string;
  registration_url: string;
  registration_opens: string | null;
  registration_opens_tentative: string | null;
  deadline: string | null;
  deadline_tentative: string | null;
  event_date: string | null;
  event_date_tentative: string | null;
  is_ongoing: boolean;
  fee_text: string;
  prize_text: string | null;
  how_to_apply: string;
  faqs: FAQ[];
  image_url: string | null;
  is_featured: boolean;
  is_verified: boolean;
  is_published: boolean;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  category?: Category;
  organiser?: Organiser;
}

export interface Student {
  id: string;
  name: string;
  student_class: string;
  mobile: string;
  school_name: string;
  city: string | null;
  email: string | null;
  created_at: string;
}

export interface Registration {
  id: string;
  student_id: string;
  opportunity_id: string;
  created_at: string;
  // Joined relations
  student?: Student;
  opportunity?: Opportunity;
}

export interface ClassRange {
  slug: string;
  label: string;
  classes: number[];
}

export interface Olympiad {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  organiser: string;
  type: string;
  eligibility_classes: string;
  eligibility_age: string | null;
  registration_month: string | null;
  exam_month: string | null;
  fee: string | null;
  prizes: string | null;
  website: string;
  level: string;
  pathway: string | null;
  stage: string | null;
  description: string;
  short_description: string;
  registration_process: string | null;
  tags: string[];
  subject: string | null;
  is_school_registration: boolean;
  is_individual_registration: boolean;
  is_online: boolean;
  is_free: boolean;
  is_government: boolean;
  is_international: boolean;
  difficulty: string | null;
  organiser_group: string | null;
  related_opportunity_slug: string | null;
  is_published: boolean;
  created_at: string;
}

export interface Career {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string | null;
  stream_required: string;
  short_description: string;
  full_description: string;
  what_you_do: string;
  is_this_for_you: string;
  how_to_prepare_in_school: string;
  salary_entry: string;
  salary_mid: string;
  salary_senior: string;
  salary_global: string | null;
  entrance_exams: string[];
  degree_required: string;
  duration: string;
  colleges_india: string[];
  colleges_global: string[];
  top_employers: string[];
  skills_needed: string[];
  rarity_level: string;
  demand_level: string;
  competition_level: string;
  tags: string[];
  related_careers: string[];
  is_published: boolean;
  created_at: string;
}

export interface QuizSubject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  colour: string | null;
  is_active: boolean;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  subject_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation: string | null;
  difficulty: string;
  class_level: string | null;
  tags: string[] | null;
  times_shown: number;
  times_correct: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
}

export interface Quiz {
  id: string;
  title: string;
  slug: string;
  subject_id: string;
  description: string | null;
  quiz_type: string;
  cadence: string | null;
  questions_per_attempt: number;
  time_limit_seconds: number;
  total_questions_in_bank: number;
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
  show_leaderboard_at: string | null;
  leaderboard_revealed: boolean;
  prize_description: string | null;
  badge_name: string | null;
  created_at: string;

  // Joined relation
  subject?: QuizSubject;
}

export interface QuizPeriod {
  id: string;
  quiz_id: string;
  period_number: number;
  period_label: string;
  start_time: string;
  end_time: string;
  questions_used: string[] | null;
  leaderboard_revealed: boolean;
  total_participants: number;
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  period_id: string;
  session_id: string;
  student_name: string | null;
  student_class: string | null;
  school: string | null;
  city: string | null;
  questions_shown: string[];
  answers: Record<string, string>;
  score: number;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  skipped_answers: number;
  time_taken_seconds: number;
  speed_bonus: number;
  final_score: number;
  rank: number | null;
  percentile: number | null;
  completed_at: string;
}

export interface QuizLeaderboard {
  id: string;
  quiz_id: string;
  period_id: string;
  attempt_id: string;
  rank: number;
  student_name: string | null;
  student_class: string | null;
  school: string | null;
  city: string | null;
  score: number | null;
  correct_answers: number | null;
  time_taken_seconds: number | null;
  final_score: number | null;
  badge_earned: string | null;
  created_at: string;
}

export interface QuizBadge {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  colour: string | null;
  criteria: string | null;
  quiz_id: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  author: string;
  is_published: boolean;
  is_featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  read_time_minutes: number;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

