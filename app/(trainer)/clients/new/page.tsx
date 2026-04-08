"use client";

import { useState } from "react";
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

      const { data: urlData } = supabase.storage
        .from("dog_photos")
        .getPublicUrl(fileName);

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
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <a
            href="/dashboard"
            className="text-hint hover:text-muted-foreground text-sm"
          >
            ← Back
          </a>
          <h1 className="text-xl font-bold text-foreground">Add Client</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl p-6 shadow-sm flex flex-col gap-6"
        >
          {/* Dog Photo */}
          <div className="flex flex-col items-center gap-3 pb-5 border-b border-border">
            <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center overflow-hidden">
              {preview ? (
                // blob URL from createObjectURL — Next.js Image does not support blob URLs
                <Image
                  src={preview}
                  alt="Dog preview"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">🐾</span>
              )}
            </div>
            <label className="cursor-pointer text-sm text-primary font-medium">
              Upload dog photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Dog Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="dogName" className="text-sm font-medium text-label">
              Dog&apos;s name <span className="text-danger">*</span>
            </label>
            <input
              id="dogName"
              type="text"
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              required
              placeholder="Buddy"
              className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Owner Name */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="ownerName"
              className="text-sm font-medium text-label"
            >
              Owner&apos;s name <span className="text-danger">*</span>
            </label>
            <input
              id="ownerName"
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              placeholder="Jane Smith"
              className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm font-medium text-label">
              Owner&apos;s phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(602) 555-0123"
              className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
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
            className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-3 text-sm font-medium hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Client"}
          </button>
        </form>
      </div>
    </div>
  );
}
