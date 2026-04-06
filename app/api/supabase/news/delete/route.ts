import { NextRequest, NextResponse } from "next/server";
import { supabase, BUCKET_NAME } from "@/lib/supabase";

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    // Extract the storage path from the full public URL
    const bucketPrefix = `/storage/v1/object/public/${BUCKET_NAME}/`;
    const pathIndex = url.indexOf(bucketPrefix);
    if (pathIndex === -1) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const filePath = decodeURIComponent(url.slice(pathIndex + bucketPrefix.length));

    // Security: only allow deleting gallery images
    if (!filePath.includes("/gallery/")) {
      return NextResponse.json(
        { error: "Only gallery images can be deleted" },
        { status: 403 }
      );
    }

    if (filePath.includes("..")) {
      return NextResponse.json(
        { error: "Invalid file path" },
        { status: 400 }
      );
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      return NextResponse.json(
        { error: `Delete failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, deleted: filePath });
  } catch (err) {
    return NextResponse.json(
      { error: `Server error: ${err}` },
      { status: 500 }
    );
  }
}
