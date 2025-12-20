import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface CareerDetails {
    shortDescription: string;
    fullDescription: string;
    keywords: string[];
    roadmap: { title: string; description: string }[];
    salary: { min: number; max: number };
    salaryNote: string;
    exams: string[];
    collegesIndia: string[];
    collegesGlobal: string[];
    degrees: string[];
    relatedCareers: string[];
    didYouKnow: string[];
    goodStuff: string[];
    challenges: string[];
}

interface ConfidenceScores {
    [key: string]: number;
}

interface FetchResponse {
    success: boolean;
    data: Partial<CareerDetails>;
    confidence: ConfidenceScores;
    unfilledFields: string[];
    error?: string;
}

const SYSTEM_PROMPT = `You are a career guidance expert. Your goal is to provide comprehensive, accurate, and inspiring information about various career paths for students in India.

Given a career title, search the web and provide detailed information according to the structure below. Return ONLY a valid JSON object.

Structure:
{
  "data": {
    "shortDescription": "A 2-3 sentence engaging summary of the career",
    "fullDescription": "A detailed 3-4 paragraph overview in HTML format, covering what they do, work environment, and future outlook.",
    "keywords": ["5-7 relevant keywords for SEO"],
    "roadmap": [
      { "title": "Step title (e.g. Class 12th)", "description": "What to do in this stage" },
      { "title": "Step title (e.g. Graduation)", "description": "Degrees and subjects to choose" },
      { "title": "Step title (e.g. Specialization)", "description": "Higher studies or certifications" },
      { "title": "Step title (e.g. Entry Level)", "description": "How to get the first job" }
    ],
    "salary": { "min": number (annual in INR, e.g. 500000), "max": number (annual in INR, e.g. 1500000) },
    "salaryNote": "A sentence about growth and top-tier salaries",
    "exams": ["List of entrance exams required in India"],
    "collegesIndia": ["Top 3-5 colleges/universities in India for this career"],
    "collegesGlobal": ["Top 3 world-renowned universities for this career"],
    "degrees": ["Bachelor's/Master's degrees required"],
    "relatedCareers": ["3-5 similar career paths"],
    "didYouKnow": ["2-3 interesting facts about this career"],
    "goodStuff": ["3-5 pros/benefits of this career"],
    "challenges": ["3-5 cons/challenges of this career"]
  },
  "confidence": {
    "description": 0-100,
    "roadmap": 0-100,
    "salary": 0-100,
    "exams": 0-100,
    "colleges": 0-100
  },
  "unfilledFields": ["List of fields you couldn't find information for"]
}

Important:
- Use current data for India (salaries in INR).
- Format fullDescription with standard HTML tags like <p>, <ul>, <li>, <strong>.
- Ensure the roadmap is progressive and clear.
- Be realistic about salary ranges.`;

export async function POST(request: Request) {
    try {
        if (!GEMINI_API_KEY) {
            return NextResponse.json({
                success: false,
                error: 'Gemini API key not configured.',
            } as FetchResponse, { status: 500 });
        }

        const body = await request.json();
        const { title } = body;

        if (!title || title.trim().length < 3) {
            return NextResponse.json({
                success: false,
                error: 'Please provide a career title with at least 3 characters.',
            } as FetchResponse, { status: 400 });
        }

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: `Provide detailed career information for: "${title}"` }],
                    },
                ],
                systemInstruction: {
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                generationConfig: {
                    temperature: 0.2,
                    responseMimeType: 'application/json',
                },
                tools: [{ googleSearch: {} }],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            return NextResponse.json({
                success: false,
                error: `AI service error: ${response.status}.`,
            } as FetchResponse, { status: 500 });
        }

        const geminiResponse = await response.json();
        const textContent = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textContent) {
            return NextResponse.json({
                success: false,
                error: 'No response from AI.',
            } as FetchResponse, { status: 500 });
        }

        const parsedData = JSON.parse(textContent);

        return NextResponse.json({
            success: true,
            data: parsedData.data || {},
            confidence: parsedData.confidence || {},
            unfilledFields: parsedData.unfilledFields || [],
        } as FetchResponse);

    } catch (error) {
        console.error('Error fetching career details:', error);
        return NextResponse.json({
            success: false,
            error: 'An unexpected error occurred.',
        } as FetchResponse, { status: 500 });
    }
}
