# Deferred Image Deletion Design

## Context

Images uploaded to Supabase storage (bucket: `byte-images`) are currently deleted inconsistently. The news gallery delete handler (`handleDeleteGalleryImage`) attempts immediate Supabase deletion on icon click, but:

1. Deleting a single gallery image throws an error
2. Deleting both gallery images removes them from the form UI but not from Supabase storage
3. Featured images and profile photos have no Supabase bucket deletion at all — replacing them leaves orphaned files
4. The public UI renders whatever is in the DB, so orphaned bucket files don't cause display issues, but deleted-from-bucket images that remain in the DB would break rendering

The goal is a consistent "delete on save" pattern across all image types: news (featured + gallery), organization profile photos, and trainee profile photos.

## Design

### Core Principle

Clicking the delete/remove icon **only updates local UI state**. All Supabase bucket deletions happen **server-side inside server actions** when the user clicks "Save Changes". This ensures atomicity — either everything saves or nothing does.

### Behavioral Rules

| Image Type | Delete Icon Visibility | On Icon Click | On Save |
|---|---|---|---|
| **Gallery images** | Always visible | Remove from preview, add URL to `imagesToDelete` list | Upload new images -> Update DB (remove deleted, add new) -> Delete from Supabase bucket |
| **Featured image** | Only when a replacement file is selected | Store old URL in `featuredImageToDelete`, clear preview | Upload replacement -> Update DB with new URL -> Delete old from Supabase bucket |
| **Profile photo** (org/trainee) | Only when a replacement file is selected | Store old URL in `profilePhotoToDelete`, clear preview | Upload replacement -> Update DB with new URL -> Delete old from Supabase bucket |

### File Changes

#### 1. `app/(admin-dashboard)/news-management/update-news/[id]/update-news-form-client.tsx`

**Gallery images:**
- Remove the `fetch("/api/supabase/news/delete")` call from `handleDeleteGalleryImage`
- Keep only the state updates: remove from `existingGallery`, add to `imagesToDelete`
- Pass `imagesToDelete` to `updateNews` server action (already done)

**Featured image:**
- Add `featuredImageToDelete` state (`string | null`)
- Pass `showRemoveForInitialImage={!!selectedFile}` so the delete icon only shows when a replacement is ready
- When the initial image is removed (user selects replacement then removes old), store the old URL
- Pass `featuredImageToDelete` to `updateNews` server action

#### 2. `app/(admin-dashboard)/organization-management/update-organization/[id]/update-org-form.tsx`

- Add `profilePhotoToDelete` state
- Pass `showRemoveForInitialImage={!!selectedPhoto}` to `SingleImageDropzone`
- When a new photo is selected and the form is saved, pass old URL as `profilePhotoToDelete`
- Update `updateOrganization` server action call to include `profilePhotoToDelete`

#### 3. `app/(admin-dashboard)/organization-management/trainees/[organizationId]/update-trainee/[id]/update-trainee-form.tsx`

- Same pattern as organization form

#### 4. `actions/actions.ts`

Add a shared helper function for Supabase bucket deletion:

```typescript
async function deleteFromSupabaseBucket(urls: string[]): Promise<void> {
  if (urls.length === 0) return;
  
  const filePaths = urls.map(url => {
    const parsed = new URL(url);
    const prefix = `/storage/v1/object/public/${BUCKET_NAME}/`;
    return decodeURIComponent(parsed.pathname).slice(prefix.length);
  });
  
  await supabase.storage.from(BUCKET_NAME).remove(filePaths);
}
```

**`updateNews`:**
- After successful DB update, call `deleteFromSupabaseBucket` with `imagesToDelete` URLs
- Accept new param `featuredImageToDelete?: string` — delete old featured image from bucket after DB update
- Deletion failures are logged but don't throw (DB is already updated correctly)

**`updateOrganization`:**
- Accept new param `profilePhotoToDelete?: string`
- After DB update, delete old profile photo from bucket

**`updateTrainee`:**
- Accept new param `profilePhotoToDelete?: string`
- After DB update, delete old profile photo from bucket

#### 5. `app/api/supabase/news/delete/route.ts`

- Delete this file — no longer needed. All deletions go through server actions.

### Order of Operations on Save

1. Upload new images to Supabase bucket (if any)
2. Update database (add new URLs, remove deleted URLs)
3. Delete old images from Supabase bucket (best-effort, log errors)

Step 3 is best-effort because the DB is the source of truth. If bucket deletion fails, we have an orphaned file in storage but the UI is correct. This is preferable to the reverse (deleted from bucket but still referenced in DB = broken images).

### Public UI Impact

No changes needed. The public pages read from the database:
- `app/(public)/news/[id]/page.tsx` — renders `post.imageGallery` and `post.featuredImage` from DB
- `app/(public)/news/news-list.tsx` — renders `post.featuredImage` from DB
- `app/(public)/organizations/organizations-list.tsx` — renders `org.profilePhoto` from DB
- `app/(public)/organizations/[id]/partials/trainee-cards.tsx` — renders trainee `profilePhoto` from DB

Once the DB is updated correctly on save, deleted images won't render. The "2x display" issue for gallery images will be resolved because the DB array will be the single source of truth.

## Verification

1. **Gallery deletion:** Open a news post with gallery images -> click delete on one -> verify it disappears from preview -> click Save -> verify image is gone from DB AND Supabase bucket
2. **Featured image replacement:** Open a news post with featured image -> select a new file -> verify delete icon appears on old image -> save -> verify old image deleted from bucket, new image in DB
3. **Profile photo replacement:** Same flow for organization and trainee forms
4. **Cancel without saving:** Delete a gallery image from preview -> navigate away without saving -> return to the form -> verify the image is still there (both in preview and Supabase)
5. **Public UI:** After each deletion+save, check the public page renders only the correct images with no duplicates
