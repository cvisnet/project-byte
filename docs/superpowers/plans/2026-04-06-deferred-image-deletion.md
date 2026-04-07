# Deferred Image Deletion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all Supabase bucket image deletions from immediate (on icon click) to deferred (on "Save Changes"), across news gallery images, featured images, and organization/trainee profile photos.

**Architecture:** Client forms track URLs to delete in local state. On save, server actions update the DB first, then best-effort delete from Supabase bucket. A shared `deleteFromSupabaseBucket` helper in `actions/actions.ts` extracts file paths from public URLs and calls `supabase.storage.remove()`.

**Tech Stack:** Next.js (App Router), React, Supabase Storage, Prisma ORM, Server Actions

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `actions/actions.ts` | Add `deleteFromSupabaseBucket` helper; update `updateNews`, `updateOrganization`, `updateTrainee` to accept deletion URLs and delete from bucket after DB update |
| Modify | `app/(admin-dashboard)/news-management/update-news/[id]/update-news-form-client.tsx` | Remove immediate Supabase delete call; track `featuredImageToDelete`; pass deletion URLs to server action on save |
| Modify | `app/(admin-dashboard)/organization-management/update-organization/[id]/update-org-form.tsx` | Track `profilePhotoToDelete`; pass to server action on save |
| Modify | `app/(admin-dashboard)/organization-management/trainees/[organizationId]/update-trainee/[id]/update-trainee-form.tsx` | Track `profilePhotoToDelete`; pass to server action on save |
| Delete | `app/api/supabase/news/delete/route.ts` | No longer needed — deletions handled by server actions |

---

### Task 1: Add `deleteFromSupabaseBucket` helper and update `updateNews` server action

**Files:**
- Modify: `actions/actions.ts:1-136`

- [ ] **Step 1: Add the Supabase import and helper function**

At the top of `actions/actions.ts`, add the import and helper after the existing imports (after line 3):

```typescript
import { supabase, BUCKET_NAME } from "@/lib/supabase";

async function deleteFromSupabaseBucket(urls: string[]): Promise<void> {
  if (urls.length === 0) return;

  const filePaths = urls
    .map((url) => {
      try {
        const parsed = new URL(url);
        const prefix = `/storage/v1/object/public/${BUCKET_NAME}/`;
        const pathname = decodeURIComponent(parsed.pathname);
        if (!pathname.startsWith(prefix)) return null;
        return pathname.slice(prefix.length);
      } catch {
        return null;
      }
    })
    .filter((p): p is string => p !== null);

  if (filePaths.length === 0) return;

  const { error } = await supabase.storage.from(BUCKET_NAME).remove(filePaths);
  if (error) {
    console.error("Failed to delete from Supabase bucket:", error.message);
  }
}
```

- [ ] **Step 2: Update `updateNews` signature to accept `featuredImageToDelete`**

Change the `updateNews` function signature (line 60) to:

```typescript
export async function updateNews(
  formData: FormData,
  id: string,
  uploadedImageUrl?: string,
  galleryUrls?: string[],
  imagesToDelete?: string[],
  featuredImageToDelete?: string,
) {
```

- [ ] **Step 3: Add bucket deletion after DB update in `updateNews`**

After the `prisma.newsPost.update` call (after line 124) and before the `revalidatePath` calls, add:

```typescript
    // Best-effort: delete images from Supabase bucket
    const urlsToDelete = [...(imagesToDelete || [])];
    if (featuredImageToDelete) {
      urlsToDelete.push(featuredImageToDelete);
    }
    await deleteFromSupabaseBucket(urlsToDelete);
```

- [ ] **Step 4: Verify the file compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: No errors in `actions/actions.ts`

- [ ] **Step 5: Commit**

```bash
git add actions/actions.ts
git commit -m "feat: add deleteFromSupabaseBucket helper and wire into updateNews"
```

---

### Task 2: Update news form — defer gallery deletion and track featured image deletion

**Files:**
- Modify: `app/(admin-dashboard)/news-management/update-news/[id]/update-news-form-client.tsx`

- [ ] **Step 1: Replace `handleDeleteGalleryImage` to remove the fetch call**

Replace the entire `handleDeleteGalleryImage` callback (lines 65-84) with:

```typescript
  const handleDeleteGalleryImage = React.useCallback((url: string) => {
    setExistingGallery((prev) => prev.filter((u) => u !== url));
    setImagesToDelete((prev) => (prev.includes(url) ? prev : [...prev, url]));
  }, []);
```

This removes the `async`, the `fetch` call, and the rollback/toast error logic. Deletion is now purely local state.

- [ ] **Step 2: Track the old featured image for deletion in `handleSubmit`**

In the `handleSubmit` function, right after the `if (selectedFile) { ... }` block that uploads the featured image and sets `finalImageUrl = url` (after line 118), add:

```typescript
      // Track old featured image for deletion if replaced
      const featuredToDelete = (selectedFile && initialData.featuredImage && finalImageUrl !== initialData.featuredImage)
        ? initialData.featuredImage
        : undefined;
```

- [ ] **Step 3: Pass `featuredToDelete` to the `updateNews` call**

Update the `updateNews` call (line 148) to pass the new parameter:

```typescript
      await updateNews(
        formData,
        initialData.id,
        finalImageUrl || undefined,
        galleryUrls.length > 0 ? galleryUrls : undefined,
        imagesToDelete.length > 0 ? imagesToDelete : undefined,
        featuredToDelete,
      );
```

- [ ] **Step 4: Verify the file compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: No errors in `update-news-form-client.tsx`

- [ ] **Step 5: Commit**

```bash
git add "app/(admin-dashboard)/news-management/update-news/[id]/update-news-form-client.tsx"
git commit -m "feat: defer gallery and featured image deletion to save in news form"
```

---

### Task 3: Update `updateOrganization` server action and organization form

**Files:**
- Modify: `actions/actions.ts:153-200`
- Modify: `app/(admin-dashboard)/organization-management/update-organization/[id]/update-org-form.tsx`

- [ ] **Step 1: Update `updateOrganization` signature and add bucket deletion**

Change the function signature (line 153) to:

```typescript
export async function updateOrganization(
  formData: FormData,
  id: string,
  uploadedImageUrl?: string,
  profilePhotoToDelete?: string,
) {
```

After the `prisma.organization.update` call (after line 189) and before the `revalidatePath` calls, add:

```typescript
    // Best-effort: delete old profile photo from Supabase bucket
    if (profilePhotoToDelete) {
      await deleteFromSupabaseBucket([profilePhotoToDelete]);
    }
```

- [ ] **Step 2: Update org form to track and pass old profile photo URL**

In `update-org-form.tsx`, update the `handleSubmit` function. After the `if (selectedPhoto)` block that uploads and sets `finalImageUrl` (after line 80), add:

```typescript
      // Track old profile photo for deletion if replaced
      const profileToDelete = (selectedPhoto && initialData.profilePhoto && finalImageUrl !== initialData.profilePhoto)
        ? initialData.profilePhoto
        : undefined;
```

Then update the `updateOrganization` call (line 82) to:

```typescript
      await updateOrganization(
        formData,
        initialData.id,
        finalImageUrl || undefined,
        profileToDelete,
      );
```

- [ ] **Step 3: Verify both files compile**

Run: `npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add actions/actions.ts "app/(admin-dashboard)/organization-management/update-organization/[id]/update-org-form.tsx"
git commit -m "feat: defer profile photo deletion to save in organization form"
```

---

### Task 4: Update `updateTrainee` server action and trainee form

**Files:**
- Modify: `actions/actions.ts:234-284`
- Modify: `app/(admin-dashboard)/organization-management/trainees/[organizationId]/update-trainee/[id]/update-trainee-form.tsx`

- [ ] **Step 1: Update `updateTrainee` signature and add bucket deletion**

Change the function signature (line 234) to:

```typescript
export async function updateTrainee(
  formData: FormData,
  id: string,
  uploadedImageUrl?: string,
  profilePhotoToDelete?: string,
) {
```

After the `prisma.trainee.update` call (after line 273) and before the `revalidatePath` call, add:

```typescript
    // Best-effort: delete old profile photo from Supabase bucket
    if (profilePhotoToDelete) {
      await deleteFromSupabaseBucket([profilePhotoToDelete]);
    }
```

- [ ] **Step 2: Update trainee form to track and pass old profile photo URL**

In `update-trainee-form.tsx`, update the `handleSubmit` function. After the `if (selectedPhoto)` block that uploads and sets `finalImageUrl` (after line 154), add:

```typescript
      // Track old profile photo for deletion if replaced
      const profileToDelete = (selectedPhoto && initialData.profilePhoto && finalImageUrl !== initialData.profilePhoto)
        ? initialData.profilePhoto
        : undefined;
```

Then update the `updateTrainee` call (line 156) to:

```typescript
      await updateTrainee(formData, initialData.id, finalImageUrl || undefined, profileToDelete);
```

- [ ] **Step 3: Verify both files compile**

Run: `npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add actions/actions.ts "app/(admin-dashboard)/organization-management/trainees/[organizationId]/update-trainee/[id]/update-trainee-form.tsx"
git commit -m "feat: defer profile photo deletion to save in trainee form"
```

---

### Task 5: Delete the old API route

**Files:**
- Delete: `app/api/supabase/news/delete/route.ts`

- [ ] **Step 1: Verify no other code references this route**

Run: `grep -r "supabase/news/delete" --include="*.ts" --include="*.tsx" .`

Expected: Only the route file itself and possibly the old news form (which was already updated in Task 2). If the news form still references it, Task 2 was not applied correctly — go back and fix.

- [ ] **Step 2: Delete the file**

```bash
rm app/api/supabase/news/delete/route.ts
```

- [ ] **Step 3: Remove empty directory if applicable**

```bash
rmdir app/api/supabase/news/delete 2>/dev/null || true
```

- [ ] **Step 4: Commit**

```bash
git add -A app/api/supabase/news/delete/
git commit -m "chore: remove unused news delete API route"
```

---

### Task 6: Manual Verification

No code changes — this is a manual testing checklist.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Test gallery image deletion**

1. Go to a news post with gallery images in the admin dashboard
2. Click the delete icon on one gallery image
3. Verify it disappears from the preview
4. Click "Save Changes"
5. Check the Supabase dashboard — the image file should be gone from `byte-images` bucket
6. Check the public news detail page — the deleted image should not appear

- [ ] **Step 3: Test featured image replacement**

1. Go to a news post with a featured image
2. Select a new image file (drag or click)
3. Click "Save Changes"
4. Check Supabase dashboard — old featured image file should be deleted, new one should exist
5. Check public news page — new image should render correctly

- [ ] **Step 4: Test organization profile photo replacement**

1. Go to an organization with a profile photo
2. Select a new photo
3. Click "Save Changes"
4. Check Supabase dashboard — old photo deleted, new one exists
5. Check public organizations page — new photo renders correctly

- [ ] **Step 5: Test trainee profile photo replacement**

1. Same flow as organization
2. Verify on public page

- [ ] **Step 6: Test cancel without saving**

1. Go to a news post with gallery images
2. Click delete on a gallery image
3. Navigate away without saving
4. Return to the form
5. Verify the image is still there in the preview and in Supabase

- [ ] **Step 7: Final commit**

```bash
git commit --allow-empty -m "chore: verified deferred image deletion working end-to-end"
```
