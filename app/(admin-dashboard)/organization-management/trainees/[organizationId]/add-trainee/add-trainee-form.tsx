"use client";

import * as React from "react";
import { createTrainee } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/contexts/toast-context";

export default function AddTraineeForm({
  organizationId,
}: {
  organizationId: string;
}) {
  const [fullName, setFullName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);

    try {
      const traineeForm = new FormData(formRef.current);
      await createTrainee(traineeForm);

      toast.success("Trainee added successfully");
      formRef.current.reset();
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add trainee",
      );
      console.log(error instanceof Error ? error.message : "Failed to add trainee",);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          <span>Add Trainee</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form ref={formRef} onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <Separator />
            <Input
              type="hidden"
              id="organizationId"
              name="organizationId"
              value={organizationId}
            />

            <DialogDescription className="font-medium text-foreground">
              Full Name
            </DialogDescription>
            <Input
              id="fullName"
              name="fullName"
              placeholder="(First Name, Middle Initial, Last Name)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <DialogDescription className="font-medium text-foreground">
              Email
            </DialogDescription>
            <Input id="email" name="email" placeholder="Email" />

            <DialogDescription className="font-medium text-foreground">
              Phone Number
            </DialogDescription>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Phone Number"
            />

            <DialogDescription className="font-medium text-foreground">
              Address
            </DialogDescription>
            <Input id="address" name="address" placeholder="Address" />

            <div className="relative flex justify-end gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Adding Trainee..." : "Add Trainee"}
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </div>
          </DialogHeader>
        </form>
      </DialogContent>
    </Dialog>
  );
}
