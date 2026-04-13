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
        aria-label="Leave Us a Google review (opens in a new tab)"
        className="bg-primary hover:bg-primary-hover text-primary-foreground flex min-h-11 w-full items-center justify-center rounded-2xl py-4 text-center text-base font-semibold transition-colors"
      >
        <span aria-hidden="true" className="mr-2">⭐</span>
        Leave Us a Google Review
      </a>
    );
  }

  return (
    <>
      <p id="review-description" className="text-muted-foreground mb-2 text-center text-sm">
        Loved the session? A quick review helps a lot.
      </p>

      <a
        href="https://search.google.com/local/writereview?placeid=ChIJTUWJ1-ESK4cRkodX8In27h8"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary inline-flex min-h-11 w-full items-center justify-center rounded-2xl py-4 text-base font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
