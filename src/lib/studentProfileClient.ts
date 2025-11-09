import type {
  PublicStudentProfile,
  StudentProfile,
  StudentProfileUpdatePayload,
} from '@/types/studentProfile';

const STUDENT_PROFILE_ENDPOINT = '/api/student/profile';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let message = 'Something went wrong';
    try {
      const body = (await response.json()) as { error?: string };
      if (body?.error) {
        message = body.error;
      }
    } catch {
      // ignore parsing error
    }
    throw new Error(message);
  }

  const data = (await response.json()) as { item?: T };
  if (!data?.item) {
    throw new Error('Unexpected response from server');
  }
  return data.item;
};

export const fetchStudentProfile = async (token: string): Promise<StudentProfile> => {
  if (!token) {
    throw new Error('Missing auth token');
  }

  const response = await fetch(STUDENT_PROFILE_ENDPOINT, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  return handleResponse<StudentProfile>(response);
};

export const updateStudentProfile = async (
  token: string,
  payload: StudentProfileUpdatePayload,
): Promise<StudentProfile> => {
  if (!token) {
    throw new Error('Missing auth token');
  }

  const response = await fetch(STUDENT_PROFILE_ENDPOINT, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<StudentProfile>(response);
};

export const fetchPublicStudentProfile = async (
  slug: string,
): Promise<PublicStudentProfile> => {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) {
    throw new Error('Profile not found');
  }

  const response = await fetch(`/api/student/profile/public/${normalized}`, {
    method: 'GET',
    cache: 'no-store',
  });

  return handleResponse<PublicStudentProfile>(response);
};
