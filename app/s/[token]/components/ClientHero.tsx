import Image from "next/image";
import { PawPrint } from "lucide-react";

type Props = {
  dogName: string;
  dogPhotoUrl: string | null;
};

export function ClientHero({ dogName, dogPhotoUrl }: Props) {
  const heading = `${dogName}'s Training Recap`;

  if (dogPhotoUrl) {
    return (
      <>
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl">
          <Image
            src={dogPhotoUrl}
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 100vw, 680px"
            className="object-cover"
          />
        </div>
        <h1
          id="page-heading"
          tabIndex={-1}
          className="text-foreground text-2xl font-bold focus:outline-none focus-visible:outline-none"
        >
          {heading}
        </h1>
      </>
    );
  }

  return (
    <div className="bg-muted flex aspect-4/3 w-full flex-col items-center justify-center gap-3 rounded-2xl">
      <PawPrint className="text-primary h-6 w-6 shrink-0" aria-hidden="true" />
      <h1 id="page-heading" tabIndex={-1} className="text-foreground text-2xl font-bold">
        {heading}
      </h1>
    </div>
  );
}
