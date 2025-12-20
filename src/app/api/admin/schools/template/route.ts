import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const template = `name,type,address,city,state,pincode,email,phone,website,foundationYear,numberOfStudents,principalName,principalContact,affiliationNumber,facilities
Delhi Public School,private,Sector 45,Gurugram,Haryana,122003,contact@dps.edu,9876543210,https://dps.edu,1990,2500,Dr. Rama Sharma,9876543211,CBSE123456,Library;Computer Lab;Sports Ground;Science Lab
Government School,government,Main Road,Delhi,Delhi,110001,govt.school@gov.in,9876543220,,1975,1200,Mr. Rajesh Kumar,9876543221,CBSE789012,Library;Computer Lab`;

    return new NextResponse(template, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="schools_template.csv"',
        },
    });
}
