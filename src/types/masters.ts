
export interface Organizer {
  id: string;
  name: string;
  address: string;
  website: string;
  foundationYear: number | null;
  type: 'government' | 'private' | 'other';
  visibility?: 'public' | 'private';
  isVerified?: boolean;
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
