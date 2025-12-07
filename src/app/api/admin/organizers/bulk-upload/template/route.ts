import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
    try {
        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();

        // Define headers matching the expected columns
        const headers = [
            'Name',
            'Short Name',
            'Description',
            'Website',
            'Address',
            'Foundation Year',
            'Type',
            'Logo URL',
            'Contact URL',
            'Contact Email',
            'Contact Phone',
            'Opportunity Types',
        ];

        // Sample data row
        const sampleData = [
            'National Science Foundation',
            'NSF',
            'A government agency supporting science education and research',
            'https://example.com',
            '123 Main Street, New Delhi, India',
            '1990',
            'government',
            'https://example.com/logo.png',
            'https://example.com/contact',
            'contact@example.com',
            '+91-9876543210',
            'Scholarship, Competition, Olympiad',
        ];

        // Create worksheet with headers and sample row
        const worksheetData = [headers, sampleData];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // Set column widths for better readability
        worksheet['!cols'] = [
            { wch: 30 }, // Name
            { wch: 15 }, // Short Name
            { wch: 50 }, // Description
            { wch: 30 }, // Website
            { wch: 40 }, // Address
            { wch: 15 }, // Foundation Year
            { wch: 15 }, // Type
            { wch: 40 }, // Logo URL
            { wch: 40 }, // Contact URL
            { wch: 25 }, // Contact Email
            { wch: 20 }, // Contact Phone
            { wch: 30 }, // Opportunity Types
        ];

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Organizers');

        // Create instructions sheet
        const instructionsData = [
            ['Organizers Bulk Upload Template'],
            [''],
            ['Instructions:'],
            ['1. Fill in the organizer details in the "Organizers" sheet'],
            ['2. The "Name" column is required, all others are optional'],
            ['3. For "Type", use one of: government, private, ngo, international, other'],
            ['4. For "Opportunity Types", enter comma-separated values (e.g., "Scholarship, Competition")'],
            ['5. Foundation Year should be a 4-digit year (e.g., 1990)'],
            ['6. Delete the sample row before uploading'],
            [''],
            ['Column Descriptions:'],
            ['Name', 'Organization/Company name (Required)'],
            ['Short Name', 'Abbreviation (e.g., CBSE, NCERT)'],
            ['Description', 'Brief description of the organization'],
            ['Website', 'Main website URL'],
            ['Address', 'Physical address'],
            ['Foundation Year', 'Year established (e.g., 1990)'],
            ['Type', 'government | private | ngo | international | other'],
            ['Logo URL', 'URL to organization logo image'],
            ['Contact URL', 'Support/contact page URL'],
            ['Contact Email', 'Contact email address'],
            ['Contact Phone', 'Contact phone number'],
            ['Opportunity Types', 'Comma-separated list of opportunity types conducted'],
        ];

        const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
        instructionsSheet['!cols'] = [{ wch: 25 }, { wch: 60 }];
        XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Return as downloadable file
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="organizers_template.xlsx"',
            },
        });
    } catch (error) {
        console.error('Template generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate template' },
            { status: 500 }
        );
    }
}
