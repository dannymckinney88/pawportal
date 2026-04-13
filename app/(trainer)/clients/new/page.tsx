"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NewClientPage() {
  const [ownerName, setOwnerName] = useState("");
  const [dogName, setDogName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    let dog_photo_url = null;

    if (photo) {
      const fileExt = photo.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("dog_photos")
        .upload(fileName, photo);

      if (uploadError) {
        setError("Photo upload failed");
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("dog_photos").getPublicUrl(fileName);

      dog_photo_url = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from("clients").insert({
      trainer_id: user.id,
      owner_name: ownerName,
      dog_name: dogName,
      phone,
      dog_photo_url,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <a href="/dashboard" className="text-hint hover:text-muted-foreground text-sm">
            ← Back
          </a>
          <h1 className="text-foreground text-xl font-bold">Add Client</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card flex flex-col gap-6 rounded-2xl p-6 shadow-sm"
        >
          {/* Dog Photo */}
          <div className="border-border flex flex-col items-center gap-3 border-b pb-5">
            <div className="bg-accent flex h-24 w-24 items-center justify-center overflow-hidden rounded-full">
              {preview ? (
                // blob URL from createObjectURL — Next.js Image does not support blob URLs
                <Image
                  src={preview}
                  alt="Dog preview"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl">🐾</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="text-primary focus-visible:ring-primary rounded text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
            >
              Upload dog photo
            </button>
            {/* Input hidden from AT — the button above is the accessible control */}
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              tabIndex={-1}
              aria-hidden="true"
              className="sr-only"
            />
          </div>

          {/* Dog Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="dogName" className="text-label text-sm font-medium">
              Dog&apos;s name <span className="text-danger">*</span>
            </label>
            <input
              id="dogName"
              type="text"
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              required
              aria-required="true"
              placeholder="Buddy"
              className="border-border focus:border-primary rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>

          {/* Owner Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="ownerName" className="text-label text-sm font-medium">
              Owner&apos;s name <span className="text-danger">*</span>
            </label>
            <input
              id="ownerName"
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              aria-required="true"
              placeholder="Jane Smith"
              className="border-border focus:border-primary rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-label text-sm font-medium">
              Owner&apos;s phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(602) 555-0123"
              className="border-border focus:border-primary rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="text-danger text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary-hover w-full rounded-lg px-4 py-3 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Client"}
          </button>
        </form>
      </div>
    </div>
  );
}
