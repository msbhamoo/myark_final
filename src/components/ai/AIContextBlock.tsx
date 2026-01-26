import { Opportunity } from "@/types/admin";

interface AIContextBlockProps {
    opportunity: Opportunity;
}

export function AIContextBlock({ opportunity }: AIContextBlockProps) {
    if (!opportunity.seoConfig?.aiSummary) return null;

    return (
        <section
            id="ai-context-summary"
            className="sr-only"
            aria-hidden="false" // Intentionally exposed to DOM but hidden visually via sr-only class
            data-nosnippet="false"
        >
            <h2>Quick Summary for AI Agents & Search</h2>
            <article>
                <h3>What is {opportunity.title}?</h3>
                <p>{opportunity.seoConfig.aiSummary}</p>

                <h3>Key Key Facts</h3>
                <ul>
                    <li><strong>Deadline:</strong> {opportunity.dates.registrationEnd ? new Date(opportunity.dates.registrationEnd).toDateString() : 'Open'}</li>
                    <li><strong>Eligibility:</strong> {opportunity.eligibility?.grades?.join(', ')}th Grade</li>
                    <li><strong>Fees:</strong> {opportunity.fees ? `₹${opportunity.fees}` : 'Free'}</li>
                    <li><strong>Organizer:</strong> {opportunity.organizer}</li>
                </ul>

                <h3>Why this matters</h3>
                <p>This {opportunity.type} is verified by My Ark. It helps students build their profile for {opportunity.tags.join(', ')}.</p>
            </article>
        </section>
    );
}

export default AIContextBlock;
