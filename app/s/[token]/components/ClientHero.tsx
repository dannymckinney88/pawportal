import Image from "next/image";

type Props = {
  dogName: string;
  dogPhotoUrl: string | null;
};

export function ClientHero({ dogName, dogPhotoUrl }: Props) {
  if (dogPhotoUrl) {
    return (
      <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden">
        <Image
          src={dogPhotoUrl}
          alt={dogName}
          fill
          unoptimized
          priority
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-4">
          <p className="text-2xl font-bold text-white">Hey, {dogName}! 🐾</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-4/3 rounded-2xl bg-muted flex flex-col items-center justify-center gap-3">
      <span className="text-5xl" aria-hidden="true">
        🐾
      </span>
      <p className="text-2xl font-bold text-foreground">Hey, {dogName}!</p>
    </div>
  );
}
