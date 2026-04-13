"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function UpdateDogImage({ clientId }: { clientId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const fileExt = file.name.split(".").pop() ?? "jpg";
    const filePath = `dogs/${clientId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("dog_photos")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      setLoading(false);
      return;
    }

    const { data } = supabase.storage.from("dog_photos").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("clients")
      .update({ dog_photo_url: data.publicUrl })
      .eq("id", clientId);

    if (updateError) {
      console.error(updateError);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="text-primary focus-visible:ring-primary cursor-pointer rounded text-xs hover:underline focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Update photo"}
      </button>
      {/* Input is hidden from AT — the button above is the accessible control */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />
    </>
  );
}
