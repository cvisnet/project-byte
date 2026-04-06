"use client";

import * as React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { createNews } from "@/actions/actions";
import { useToast } from "@/contexts/toast-context";

export default function CreateNewsForm() {
  const [title, setTitle] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);

    try {
      const newsForm = new FormData(formRef.current);
      await createNews(newsForm);

      toast.success("News created successfully!");
      formRef.current.reset();
      setTitle("");
    } catch (error: any) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-20">
      <div className="w-full max-w-md">
        <form ref={formRef} onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>News Post</FieldLegend>
              <FieldDescription>Post an article for BYTE</FieldDescription>

              <Field>
                <FieldLabel>News Title</FieldLabel>
                <Input
                  name="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>
            </FieldSet>

            <FieldSet>
              <Field>
                <FieldLabel>Content</FieldLabel>
                <Textarea
                  name="content"
                  required
                  className="resize-none"
                />
              </Field>
            </FieldSet>

            <Field orientation="horizontal">
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
