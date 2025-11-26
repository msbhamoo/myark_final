export type CustomTabType = 'rich-text' | 'list' | 'structured-data' | 'custom-json';

export interface CustomTab {
    id: string;
    label: string;
    type: CustomTabType;
    order: number;
    required: boolean;
    visible?: boolean;
    content: CustomTabContent;
}

export type CustomTabContent =
    | { type: 'rich-text'; html: string }
    | { type: 'list'; items: string[] }
    | { type: 'structured-data'; schema: Record<string, any> }
    | { type: 'custom-json'; data: Record<string, any> };

// Helper type guards
export function isRichTextContent(content: CustomTabContent): content is { type: 'rich-text'; html: string } {
    return content.type === 'rich-text';
}

export function isListContent(content: CustomTabContent): content is { type: 'list'; items: string[] } {
    return content.type === 'list';
}

export function isStructuredDataContent(content: CustomTabContent): content is { type: 'structured-data'; schema: Record<string, any> } {
    return content.type === 'structured-data';
}

export function isCustomJsonContent(content: CustomTabContent): content is { type: 'custom-json'; data: Record<string, any> } {
    return content.type === 'custom-json';
}
