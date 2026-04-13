"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PawPrint } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LandingFocus } from "@/app/components/LandingFocus";
import { setFocusIntent } from "@/lib/focus-intent";

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

    setFocusIntent({ targetId: "dashboard-heading", visible: true });
    router.push("/dashboard");
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <LandingFocus />
          <Link
            href="/dashboard"
            className="text-hint hover:text-muted-foreground focus-visible:ring-primary/20 inline-flex items-center rounded-md text-sm transition focus-visible:ring-2 focus-visible:outline-none"
            onClick={(e) => {
              setFocusIntent(
                e.currentTarget.matches(":focus-visible")
                  ? { targetId: "dashboard-heading", visible: true }
                  : { targetId: "main-content", visible: false }
              );
            }}
          >
            <span aria-hidden="true">← </span>
            Back
          </Link>

          <h1 id="new-client-heading" tabIndex={-1} className="text-foreground text-xl font-bold focus:outline-none">
            Add Client
          </h1>
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
              <div className="bg-accent-subtle border-border flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border">
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
            <Input
              id="dogName"
              type="text"
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              required
              aria-required="true"
              placeholder="Buddy"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="ownerName" className="text-label text-sm font-medium">
              Owner&apos;s name <span className="text-danger ml-1">*</span>
            </label>
            <Input
              id="ownerName"
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              aria-required="true"
              placeholder="Jane Smith"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-label text-sm font-medium">
              Owner&apos;s phone
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(602) 555-0123"
              autoComplete="tel"
            />
          </div>

          {error && (
            <p role="alert" className="text-danger text-sm">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Client"}
          </Button>
        </form>
      </div>
    </div>
  );
}
