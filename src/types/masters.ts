
export interface Organizer {
  id: string;
  name: string;
  shortName?: string;
  address: string;
  website: string;
  foundationYear: number | null;
  type: 'government' | 'private' | 'ngo' | 'international' | 'school' | 'other';
  visibility?: 'public' | 'private';
  isVerified?: boolean;
  logoUrl?: string;
  contactUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWebsite?: string;
  description?: string;
  opportunityTypeIds?: string[];
  country?: string;
  state?: string;
  city?: string;
  schoolLogoUrl?: string;
}

export interface OpportunityCategory {
  id: string;
  name: string;
  description: string;
}

export interface Country {
  id: string;
  name: string;
}

export interface State {
  id: string;
  name: string;
  countryId: string;
}

export interface City {
  id: string;
  name: string;
  stateId: string;
}

export interface CategoryIconConfig {
  emoji?: string;
  icon?: string;
  type: 'emoji' | 'icon' | 'image';
  url?: string;
}

export interface OpportunityCategoryWithMeta extends OpportunityCategory {
  icon?: CategoryIconConfig;
  color?: string;
  gradient?: {
    from: string;
    to: string;
  };
  displayOrder?: number;
  isActive?: boolean;
}
