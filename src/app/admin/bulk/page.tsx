"use client";

import { BulkUploadManager } from './BulkUploadManager';

export default function AdminBulkUploadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground dark:text-white">Bulk Uploads</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Import opportunities, schools, and organizers in bulk using CSV templates. Review the preview before committing data to the database.
        </p>
      </div>
      <BulkUploadManager />
    </div>
  );
}



