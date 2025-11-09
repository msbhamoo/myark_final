export type BulkEntity = 'opportunities' | 'schools' | 'organizers';

export const BULK_ENTITIES: BulkEntity[] = ['opportunities', 'schools', 'organizers'];

export const isBulkEntity = (value: string): value is BulkEntity =>
  BULK_ENTITIES.includes(value as BulkEntity);
