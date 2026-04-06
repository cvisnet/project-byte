"use client";

import { updateOrganization } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { UploaderProvider } from "@/components/upload/uploader-provider";
import { useToast } from "@/contexts/toast-context";
import { slugify } from "@/lib/slugify";
import { useRouter } from "next/navigation";
import React from "react";

interface UpdateOrganizationData {
  id: string;
  profilePhoto: string | null;
  acronym: string | null;
  name: string;
  location: string;
  trainingStartedAt: Date;
}

interface Props {
  initialData: UpdateOrganizationData;
}

export default function UpdateOrgForm({ initialData }: Props) {
  const [acronym, setAcronym] = React.useState(initialData.acronym || "");
  const [name, setName] = React.useState(initialData.name);
  const [location, setLocation] = React.useState(initialData.location);
  const trainingStartedAt = initialData.trainingStartedAt.toLocaleDateString();
  const [selectedPhoto, setSelectedPhoto] = React.useState<File | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const profilePreviewUrl = initialData.profilePhoto || null;

  const handlePhotoChange = React.useCallback(
    ({ allFiles }: { allFiles: any[] }) => {
      const file = allFiles[0];
      setSelectedPhoto(file?.file || null);
    },
    [],
  );

  // Dummy upload function - we handle uploads manually in handleSubmit
  const noopUploadFn = React.useCallback(async () => ({ url: "" }), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      let finalImageUrl = initialData.profilePhoto; // Keep existing by default
      const slug = slugify(name);

      // Only upload profile photo if user selected a new file
      if (selectedPhoto) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedPhoto);
        uploadFormData.append("slug", slug);
        uploadFormData.append("folder", "profile");

        const uploadRes = await fetch("/api/supabase/organizations/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error || "Profile photo upload failed");
        }

        const { url } = await uploadRes.json();
        finalImageUrl = url;
      }

      await updateOrganization(
        formData,
        initialData.id,
        finalImageUrl || undefined,
      );

      toast.success("Organization updated successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="flex justify-center my-20">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                  {error}
                </div>
              )}

              <FieldSet>
                <FieldGroup>
                  <FieldLabel>
                    {selectedPhoto
                      ? "New Profile Photo"
                      : "Upload New Profile Photo"}
                  </FieldLabel>

                  <UploaderProvider
                    autoUpload={false}
                    onChange={handlePhotoChange}
                    uploadFn={noopUploadFn}
                  >
                    <SingleImageDropzone
                      width={200}
                      height={200}
                      initialImageUrl={profilePreviewUrl}
                      dropzoneOptions={{
                        maxSize: 1024 * 1024 * 5, // 5 MB
                        accept: { "image/*": [] },
                      }}
                    />
                  </UploaderProvider>
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Organization Acronym</FieldLabel>
                    <Input
                      id="acronym"
                      name="acronym"
                      value={acronym}
                      onChange={(e) => setAcronym(e.target.value)}
                      placeholder="Organization Acronym"
                      required
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Organization Name</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Organization Name"
                      required
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Location</FieldLabel>
                    <Input
                      id="location"
                      name="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                      required
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel className="font-medium text-foreground">
                      Joined At
                    </FieldLabel>
                    <Button
                      variant="outline"
                      type="button"
                      className="justify-start font-normal bg-muted"
                      disabled
                    >
                      <input
                        type="hidden"
                        name="joined"
                        value={trainingStartedAt}
                      />
                      {trainingStartedAt}
                    </Button>
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Field orientation={"horizontal"} className="flex justify-end">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isUpdating}
                  onClick={() => router.push("/organization-management")}
                >
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </div>
    </>
  );
}
