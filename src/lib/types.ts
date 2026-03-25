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
