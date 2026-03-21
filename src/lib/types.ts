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
  deadline: string | null;
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
