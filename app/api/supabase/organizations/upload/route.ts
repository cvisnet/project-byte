import { NextRequest, NextResponse } from "next/server";
import { supabase, BUCKET_NAME } from "@/lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const slug = formData.get("slug") as string | null;
    const folder = formData.get("folder") as string | null;

    if (!file || !slug || !folder) {
      return NextResponse.json(
        { error: "Missing required fields: file, slug, folder" },
        { status: 400 }
      );
    }

    if (file.type !== "image/webp") {
      return NextResponse.json(
        { error: "Only .webp images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    if (folder !== "profile") {
      return NextResponse.json(
        { error: "Folder must be 'profile'" },
        { status: 400 }
      );
    }

    const sanitizedSlug = slug.replace(/[^a-z0-9-]/g, "");
    if (sanitizedSlug.includes("..")) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `organizations/${sanitizedSlug}/${folder}/${sanitizedName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      filename: sanitizedName,
      url: urlData.publicUrl,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Server error: ${err}` },
      { status: 500 }
    );
  }
}
