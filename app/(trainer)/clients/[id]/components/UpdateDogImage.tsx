"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function UpdateDogImage({ clientId }: { clientId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    <label className="cursor-pointer text-center">
      <span className="text-xs text-primary hover:underline">
        {loading ? "Uploading..." : "Update photo"}
      </span>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </label>
  );
}
