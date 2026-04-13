"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PawPrint } from "lucide-react";

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

  const inputClassName =
    "w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder:text-hint outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background";

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-hint hover:text-muted-foreground focus-visible:ring-primary/20 inline-flex items-center rounded-md text-sm transition focus-visible:ring-2 focus-visible:outline-none"
          >
            ← Back
          </Link>

          <h1 className="text-foreground text-xl font-bold">Add Client</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card flex flex-col gap-6 rounded-2xl p-6 shadow-sm"
        >
          <div className="border-border flex flex-col items-center gap-3 border-b pb-5">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="focus-visible:ring-primary/20 flex cursor-pointer flex-col items-center gap-3 rounded-xl p-2 transition hover:scale-[1.02] hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Upload dog photo"
            >
              <div className="bg-accent-subtle flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-gray-200">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Dog preview"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PawPrint className="text-primary h-10 w-10" aria-hidden="true" />
                )}
              </div>

              <span className="text-hint hover:text-foreground focus-visible:ring-primary/20 inline-flex items-center rounded-md text-sm transition focus-visible:ring-2 focus-visible:outline-none">
                Upload dog photo
              </span>
            </button>

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

          <div className="flex flex-col gap-1">
            <label htmlFor="dogName" className="text-label text-sm font-medium">
              Dog&apos;s name <span className="text-danger ml-1">*</span>
            </label>
            <input
              id="dogName"
              type="text"
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              required
              aria-required="true"
              placeholder="Buddy"
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="ownerName" className="text-label text-sm font-medium">
              Owner&apos;s name <span className="text-danger ml-1">*</span>
            </label>
            <input
              id="ownerName"
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              aria-required="true"
              placeholder="Jane Smith"
              className={inputClassName}
            />
          </div>

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
              autoComplete="tel"
              className={inputClassName}
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
            className="bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary/20 min-h-11 w-full rounded-lg px-4 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? "Saving..." : "Save Client"}
          </button>
        </form>
      </div>
    </div>
  );
}
