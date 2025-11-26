# Bulk Upload Template Guide

This document explains the expected format for bulk uploading opportunities via Excel or CSV files.

## File Format

- **Supported formats**: `.xlsx`, `.xls`, `.csv`
- **First row**: Must contain column headers
- **Each subsequent row**: Represents one opportunity

## Column Headers

Below are the column headers you can use. **Required fields** are marked with *.

### Basic Information
| Column Header | Type | Description | Example |
|---------------|------|-------------|---------|
| `title` * | Text | Opportunity title | "National Science Olympiad 2025" |
| `category` * | Text | Category name | "Science" |
| `organizer` * | Text | Organizer name | "National Science Foundation" |
| `description` | Text | Detailed description | "A competition for science enthusiasts..." |
| `image` | URL | Image URL for the opportunity | "https://example.com/image.jpg" |

### Eligibility
| Column Header | Type | Description | Example |
|---------------|------|-------------|---------|
| `gradeEligibility` * | Text | Grade eligibility | "Grades 6-12" |
| `eligibilityType` | Text | Type: grade, age, or both | "grade" |
| `ageEligibility` | Text | Age eligibility (if applicable) | "14-18 years" |

### Mode & Location
| Column Header | Type | Description | Example |
|---------------|------|-------------|---------|
| `mode` * | Text | online, offline, or hybrid | "online" |
| `state` | Text | State name (for offline/hybrid) | "Maharashtra" |

### Dates
| Column Header | Type | Description | Example |
|---------------|------|-------------|---------|
| `startDate` | Date | Start date (YYYY-MM-DD) | "2025-03-15" |
| `endDate` | Date | End date (YYYY-MM-DD) | "2025-03-17" |
| `registrationDeadline` | Date | Registration deadline | "2025-02-28" |
| `startDateTBD` | Boolean | Mark start date as TBD | "true" or "false" |
| `endDateTBD` | Boolean | Mark end date as TBD | "true" or "false" |
| `registrationDeadlineTBD` | Boolean | Mark registration deadline as TBD | "true" or "false" |

### Fee & Registration
| Column Header | Type | Description | Example |
|---------------|------|-------------|---------|
| `fee` | Text | Fee details | "₹500" or "Free" |
| `applicationUrl` | URL | External application URL | "https://example.com/register" |

### Array Fields (use delimiters: `,` `;` or `|`)
| Column Header | Type | Description | Example |
|---------------|------|-------------|---------|
| `eligibility` | Text | Eligibility criteria (comma-separated) | "Open to all students, Must be enrolled in school" |
| `benefits` | Text | Benefits (comma-separated) | "Certificate, Cash prize ₹10,000, Internship opportunity" |
| `registrationProcess` | Text | Registration steps | "Visit website, Fill form, Pay fee" |
| `segments` | Text | Home page segments | "weekly-spotlight, trending" |
| `searchKeywords` | Text | Search keywords | "science, olympiad, STEM" |

### Timeline (special format)
| Column Header | Format | Description | Example |
|---------------|--------|-------------|---------|
| `timeline` | `date\|event\|status;...` | Timeline events separated by `;`, fields separated by `\|` | "2025-02-28\|Registration Opens\|completed; 2025-03-15\|Exam Date\|upcoming" |

- **Status values**: `completed`, `active`, or `upcoming`

## Sample Excel Template

| title | category | organizer | gradeEligibility | mode | startDate | endDate | registrationDeadline | fee | benefits | timeline |
|-------|----------|-----------|------------------|------|-----------|---------|---------------------|-----|----------|----------|
| National Science Olympiad 2025 | Science | NSF | Grades 6-12 | online | 2025-03-15 | 2025-03-17 | 2025-02-28 | ₹500 | Certificate, Cash prize, Internship | 2025-02-01\|Registration Opens\|completed; 2025-03-15\|Exam Date\|upcoming |

## Important Notes

1. **Categories & Organizers**: The system will validate these against existing records. Missing categories/organizers can be added during manual approval.

2. **Dates**: Use format `YYYY-MM-DD` or any standard date format Excel recognizes. The system will parse it automatically.

3. **Array Fields**: Separate multiple values with commas (`,`), semicolons (`;`), or pipes (`|`).

4. **Timeline Format**: Each event is 3 fields separated by `|`: `date|event_name|status`. Multiple events are separated by `;`.

5. **All opportunities are saved as "draft" status** by default and need manual approval before publishing.

## Validation

The system will validate:
- Required fields are present
- Dates are valid and logical (end date > start date)
- URLs are properly formatted
- Categories and organizers exist (warnings only)
- Mode is one of: online, offline, hybrid
- Timeline format is correct

## After Upload

1. Review the preview table
2. Fix any validation errors using the inline editor
3. Delete unwanted rows
4. Download error report if needed
5. Submit when all rows are valid
6. Opportunities will be saved as drafts
7. Review and publish from the Opportunity Manager
