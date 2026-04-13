import Image from "next/image";

type Props = {
  dogName: string;
  dogPhotoUrl: string | null;
};

export function ClientHero({ dogName, dogPhotoUrl }: Props) {
  if (dogPhotoUrl) {
    return (
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl">
        <Image
          src={dogPhotoUrl}
          alt={`${dogName} photo`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 680px"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-4">
          <p className="text-2xl font-bold text-white">Hey, {dogName}! 🐾</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted flex aspect-4/3 w-full flex-col items-center justify-center gap-3 rounded-2xl">
      <span className="text-5xl" aria-hidden="true">
        🐾
      </span>
      <p className="text-foreground text-2xl font-bold">Hey, {dogName}!</p>
    </div>
  );
}
