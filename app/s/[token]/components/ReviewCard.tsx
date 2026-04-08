type Props = {
  googleReviewUrl: string | null | undefined;
};

export function ReviewCard({ googleReviewUrl }: Props) {
  if (googleReviewUrl) {
    return (
      <a
        href={googleReviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-2xl py-4 text-center text-base min-h-11 flex items-center justify-center transition-colors"
      >
        ⭐ Leave Us a Google Review
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled
      className="w-full bg-primary text-primary-foreground font-semibold rounded-2xl py-4 text-center text-base min-h-11 opacity-50 cursor-not-allowed"
    >
      ⭐ Leave Us a Google Review
    </button>
  );
}
