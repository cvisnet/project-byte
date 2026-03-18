"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { updateNews } from "@/actions/actions";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { ImageUploader } from "@/components/upload/multi-image";
import { UploaderProvider } from "@/components/upload/uploader-provider";
import { slugify } from "@/lib/slugify";
import * as React from "react";
import { useToast } from "@/contexts/toast-context";

interface UpdateNewsData {
  id: string;
  title: string;
  content: string | null;
  featuredImage: string | null;
  imageGallery: string[];
  status: boolean;
}

interface Props {
  initialData: UpdateNewsData;
}

export default function UpdateNewsFormClient({ initialData }: Props) {
  const [title, setTitle] = React.useState(initialData.title);
  const [content, setContent] = React.useState(initialData.content || "");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = React.useState<File[]>([]);
  const [existingGallery, setExistingGallery] = React.useState(initialData.imageGallery);
  const [imagesToDelete, setImagesToDelete] = React.useState<string[]>([]);
  const [isPublished, setIsPublished] = React.useState(initialData.status);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const toProxiedImageUrl = React.useCallback(
    (url: string) => `/api/image-proxy?url=${encodeURIComponent(url)}`,
    []
  );
  const featuredPreviewUrl = initialData.featuredImage
    ? toProxiedImageUrl(initialData.featuredImage)
    : null;

  const handleFileChange = React.useCallback(({ allFiles }: { allFiles: any[] }) => {
    const file = allFiles[0];
    setSelectedFile(file?.file || null);
  }, []);

  const handleGalleryChange = React.useCallback(({ allFiles }: { allFiles: any[] }) => {
    const files = allFiles
      .filter((f: any) => f.status === "PENDING" && f.file)
      .map((f: any) => f.file);
    setGalleryFiles(files);
  }, []);

  // Dummy upload function - we handle uploads manually in handleSubmit
  const noopUploadFn = React.useCallback(async () => ({ url: "" }), []);

  const handleDeleteGalleryImage = React.useCallback(async (url: string) => {
    setExistingGallery((prev) => prev.filter((u) => u !== url));
    setImagesToDelete((prev) => (prev.includes(url) ? prev : [...prev, url]));

    try {
      const deleteRes = await fetch("/api/nextcloud/news/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!deleteRes.ok) {
        throw new Error("Failed to delete image from Nextcloud");
      }
    } catch {
      setExistingGallery((prev) => (prev.includes(url) ? prev : [...prev, url]));
      setImagesToDelete((prev) => prev.filter((u) => u !== url));
      toast.error("Failed to remove gallery image.");
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      // Update status in formData based on toggle state
      formData.set("status", String(isPublished));

      let finalImageUrl = initialData.featuredImage; // Keep existing by default
      const slug = slugify(title);

      // Only upload featured image if user selected a new file
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        uploadFormData.append("slug", slug);
        uploadFormData.append("folder", "featured");

        const uploadRes = await fetch("/api/nextcloud/news/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error || "Featured image upload failed");
        }

        const { url } = await uploadRes.json();
        finalImageUrl = url;
      }

      // Upload gallery images in parallel
      const galleryUrls: string[] = [];
      if (galleryFiles.length > 0) {
        const galleryUploads = galleryFiles.map(async (file) => {
          const uploadFormData = new FormData();
          uploadFormData.append("file", file);
          uploadFormData.append("slug", slug);
          uploadFormData.append("folder", "gallery");

          const uploadRes = await fetch("/api/nextcloud/news/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadRes.ok) {
            const data = await uploadRes.json();
            throw new Error(data.error || `Gallery image upload failed: ${file.name}`);
          }

          const { url } = await uploadRes.json();
          return url;
        });

        const uploadedUrls = await Promise.all(galleryUploads);
        galleryUrls.push(...uploadedUrls);
      }

      // Call server action with gallery URLs and images to delete
      await updateNews(
        formData,
        initialData.id,
        finalImageUrl || undefined,
        galleryUrls.length > 0 ? galleryUrls : undefined,
        imagesToDelete.length > 0 ? imagesToDelete : undefined
      );

      toast.success("News updated successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center my-20">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {/* Error display */}
            {error && (
              <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Featured Image */}
            <FieldSet>
              <FieldGroup>
                <FieldLabel>
                  {selectedFile
                    ? "New Featured Image"
                    : "Upload New Featured Image"}
                </FieldLabel>
                <UploaderProvider autoUpload={false} onChange={handleFileChange} uploadFn={noopUploadFn}>
                  <SingleImageDropzone
                    width={200}
                    height={200}
                    initialImageUrl={featuredPreviewUrl}
                    dropzoneOptions={{
                      maxSize: 1024 * 1024 * 5, // 5 MB
                      accept: { "image/*": [] },
                    }}
                  />
                </UploaderProvider>
              </FieldGroup>
            </FieldSet>

            {/* Title */}
            <FieldSet>
              <FieldLegend>News Post</FieldLegend>
              <FieldDescription>Update the article for BYTE</FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="news-title">News Title</FieldLabel>
                  <Input
                    id="news-title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* Content */}
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="news-content">Content</FieldLabel>
                  <Textarea
                    id="news-content"
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add any additional comments"
                    className="resize-none"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* Image Gallery */}
            <FieldSet>
              <FieldGroup>
                <FieldLabel>Image Gallery</FieldLabel>
                <p className="text-sm text-muted-foreground mb-2">
                  Add or remove images (up to 10 new uploads)
                </p>
                <UploaderProvider autoUpload={false} onChange={handleGalleryChange} uploadFn={noopUploadFn}>
                  <ImageUploader
                    maxFiles={10}
                    maxSize={1024 * 1024 * 5}
                    existingImages={existingGallery}
                    onRemoveExistingImage={handleDeleteGalleryImage}
                    resolveExistingImageSrc={toProxiedImageUrl}
                  />
                </UploaderProvider>
              </FieldGroup>
            </FieldSet>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-base">Publish Status</Label>
                <p className="text-sm text-muted-foreground">
                  {isPublished ? "This post is visible to readers" : "This post is saved as draft"}
                </p>
              </div>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>

            {/* Status (hidden field for form submission) */}
            <input type="hidden" name="status" value={String(isPublished)} />

            <Field orientation="horizontal">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Save Changes"}
              </Button>
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
