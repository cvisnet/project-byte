"use client";

import { updateTrainee } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { UploaderProvider } from "@/components/upload/uploader-provider";
import { useToast } from "@/contexts/toast-context";
import { useRouter } from "next/navigation";
import React from "react";
import MultiSelect from "./partials/checkbox-input";

interface UpdateTraineeData {
  id: string;
  profilePhoto: string | null;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  skills: string[];
  organizationId: string;
}

interface Props {
  initialData: UpdateTraineeData;
}

export const skillCategories = [
  {
    category: "Linux & Servers",
    skills: [
      { id: "linux", name: "Linux", value: "Linux" },
      { id: "linux_commands", name: "Linux Commands", value: "Linux Commands" },
      { id: "linux_server", name: "Linux Server", value: "Linux Server" },
      {
        id: "server_administration",
        name: "Server Administration",
        value: "Server Administration",
      },
    ],
  },
  {
    category: "Networking",
    skills: [
      { id: "networking", name: "Networking", value: "Networking" },
      { id: "tcp_ip", name: "TCP/IP", value: "TCP/IP" },
      {
        id: "network_troubleshooting",
        name: "Network Troubleshooting",
        value: "Network Troubleshooting",
      },
    ],
  },
  {
    category: "Computer Hardware",
    skills: [
      {
        id: "computer_assembly",
        name: "Computer Assembly",
        value: "Computer Assembly",
      },
      {
        id: "computer_disassembly",
        name: "Computer Disassembly",
        value: "Computer Disassembly",
      },
      {
        id: "hardware_troubleshooting",
        name: "Hardware Troubleshooting",
        value: "Hardware Troubleshooting",
      },
    ],
  },
  {
    category: "Web & Programming",
    skills: [
      { id: "wordpress", name: "WordPress", value: "WordPress" },
      {
        id: "web_development",
        name: "Web Development",
        value: "Web Development",
      },
      { id: "programming", name: "Programming", value: "Programming" },
    ],
  },
  {
    category: "Artificial Intelligence",
    skills: [
      {
        id: "artificial_intelligence",
        name: "Artificial Intelligence (AI)",
        value: "Artificial Intelligence (AI)",
      },
    ],
  },
];

export default function UpdateTraineeForm({ initialData }: Props) {
  const [fullName, setFullName] = React.useState(initialData.fullName);
  const [email, setEmail] = React.useState(initialData.email ?? "");
  const [phoneNumber, setPhoneNumber] = React.useState(
    initialData.phoneNumber ?? "",
  );
  const [address, setAddress] = React.useState(initialData.address ?? "");
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>(
    initialData.skills ?? [],
  );
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

  const noopUploadFn = React.useCallback(async () => ({ url: "" }), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      let finalImageUrl = initialData.profilePhoto;

      if (selectedPhoto) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedPhoto);
        uploadFormData.append("fullName", fullName);
        uploadFormData.append("organizationId", initialData.organizationId);

        const uploadRes = await fetch("/api/supabase/trainees/upload", {
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

      // Track old profile photo for deletion if replaced
      const profileToDelete = (selectedPhoto && initialData.profilePhoto && finalImageUrl !== initialData.profilePhoto)
        ? initialData.profilePhoto
        : undefined;

      await updateTrainee(formData, initialData.id, finalImageUrl || undefined, profileToDelete);

      toast.success("Trainee updated successfully!");
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
                    : "Upload New Profile Photo (Optional)"}
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
                      maxSize: 1024 * 1024 * 5,
                      accept: { "image/*": [] },
                    }}
                  />
                </UploaderProvider>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel>Phone Number</FieldLabel>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel>Address</FieldLabel>
                  <Input
                    id="address"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel>Skills</FieldLabel>
                  <MultiSelect
                    categories={skillCategories}
                    placeholder="Select skills..."
                    name="skills"
                    value={selectedSkills}
                    onChange={setSelectedSkills}
                  />
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
                onClick={() =>
                  router.push(
                    `/organization-management/trainees/${initialData.organizationId}`,
                  )
                }
              >
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
