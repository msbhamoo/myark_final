import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface OpportunityDetails {
    description: string;
    eligibility: string[];
    benefits: string[];
    registrationProcess: string[];
    timeline: { stage: string; date: string }[];
    fee: string;
    mode: string;
    gradeEligibility: string;
    ageEligibility: string;
    contactInfo: {
        website: string;
        email: string;
        phone: string;
    };
    registrationDeadline: string;
    startDate: string;
    endDate: string;
}

interface ConfidenceScores {
    [key: string]: number;
}

interface FetchResponse {
    success: boolean;
    data: Partial<OpportunityDetails>;
    confidence: ConfidenceScores;
    unfilledFields: string[];
    extraContent: string;
    error?: string;
}

const SYSTEM_PROMPT = `You are an expert at finding and extracting information about educational opportunities, competitions, olympiads, scholarships, and similar events for school students.

Given an opportunity name, search the web and provide detailed, accurate information. Return the data in the following JSON format:

{
  "data": {
    "description": "Detailed description of the opportunity (2-3 paragraphs in HTML format)",
    "eligibility": ["List of eligibility criteria"],
    "benefits": ["List of benefits, prizes, or rewards"],
    "registrationProcess": ["Step-by-step registration process"],
    "timeline": [{"stage": "Stage name", "date": "Date or date range"}],
    "fee": "Registration fee (e.g., 'Free', '₹200', 'Varies by level')",
    "mode": "online/offline/hybrid",
    "gradeEligibility": "Grade range (e.g., '6-12', '9-10')",
    "ageEligibility": "Age range if applicable (e.g., '10-18 years')",
    "contactInfo": {
      "website": "Official website URL",
      "email": "Contact email",
      "phone": "Contact phone"
    },
    "registrationDeadline": "Date in YYYY-MM-DD format or empty if TBD",
    "startDate": "Date in YYYY-MM-DD format or empty if TBD",
    "endDate": "Date in YYYY-MM-DD format or empty if TBD"
  },
  "confidence": {
    "description": 0-100,
    "eligibility": 0-100,
    "benefits": 0-100,
    "registrationProcess": 0-100,
    "timeline": 0-100,
    "fee": 0-100,
    "mode": 0-100,
    "gradeEligibility": 0-100,
    "contactInfo": 0-100,
    "dates": 0-100
  },
  "unfilledFields": ["List of fields you couldn't find information for"],
  "extraContent": "Any additional important information in HTML format that doesn't fit the above fields (prizes breakdown, past winners, special categories, etc.)"
}

Important:
- Use current year's information when available
- If you can't find specific information, set confidence to 0 and add to unfilledFields
- Always verify with official sources when possible
- Format HTML content properly with appropriate tags
- Be precise with dates - use YYYY-MM-DD format`;

export async function POST(request: Request) {
    try {
        if (!GEMINI_API_KEY) {
            return NextResponse.json({
                success: false,
                error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.',
            } as FetchResponse, { status: 500 });
        }

        const body = await request.json();
        const { title } = body;

        if (!title || title.trim().length < 3) {
            return NextResponse.json({
                success: false,
                error: 'Please provide an opportunity title with at least 3 characters.',
            } as FetchResponse, { status: 400 });
        }

        // Call Gemini API with grounding
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: `Find detailed information about this educational opportunity/competition: "${title}"\n\nSearch the web for the most current and accurate information available.`,
                            },
                        ],
                    },
                ],
                systemInstruction: {
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                generationConfig: {
                    temperature: 0.2,
                    topP: 0.8,
                    topK: 40,
                    maxOutputTokens: 4096,
                    responseMimeType: 'application/json',
                },
                tools: [
                    {
                        googleSearch: {},
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            return NextResponse.json({
                success: false,
                error: `AI service error: ${response.status}. Please try again.`,
            } as FetchResponse, { status: 500 });
        }

        const geminiResponse = await response.json();

        // Extract the text content from Gemini response
        const textContent = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textContent) {
            return NextResponse.json({
                success: false,
                error: 'No response from AI. Please try again.',
            } as FetchResponse, { status: 500 });
        }

        // Parse the JSON response from Gemini
        let parsedData;
        try {
            // Clean the response - sometimes Gemini adds markdown code blocks
            let cleanedContent = textContent.trim();
            if (cleanedContent.startsWith('```json')) {
                cleanedContent = cleanedContent.slice(7);
            }
            if (cleanedContent.startsWith('```')) {
                cleanedContent = cleanedContent.slice(3);
            }
            if (cleanedContent.endsWith('```')) {
                cleanedContent = cleanedContent.slice(0, -3);
            }
            parsedData = JSON.parse(cleanedContent.trim());
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', textContent);
            return NextResponse.json({
                success: false,
                error: 'Failed to parse AI response. Please try again.',
            } as FetchResponse, { status: 500 });
        }

        // Return the structured data
        return NextResponse.json({
            success: true,
            data: parsedData.data || {},
            confidence: parsedData.confidence || {},
            unfilledFields: parsedData.unfilledFields || [],
            extraContent: parsedData.extraContent || '',
        } as FetchResponse);

    } catch (error) {
        console.error('Error fetching opportunity details:', error);
        return NextResponse.json({
            success: false,
            error: 'An unexpected error occurred. Please try again.',
        } as FetchResponse, { status: 500 });
    }
}
