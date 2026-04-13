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
    <>
      <p
        id="review-description"
        className="text-sm text-muted-foreground text-center mb-2"
      >
        Loved the session? A quick review helps a lot.
      </p>

      <a
        href="https://search.google.com/local/writereview?placeid=ChIJTUWJ1-ESK4cRkodX8In27h8"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold rounded-2xl py-4 text-base min-h-11 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition"
        aria-describedby="review-description"
        aria-label="Leave Us a Google review for Rob's Dogs (opens in a new tab)"
      >
        <span aria-hidden="true" className="mr-2">
          ⭐
        </span>
        Leave Us a Google Review
      </a>
    </>
  );
}
