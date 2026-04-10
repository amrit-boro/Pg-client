import { useState } from "react";
import { useReviews } from "../../../hooks/useReviews";

const StarRating = ({ score }) => {
  const full = Math.round(score);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < full ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const Avatar = ({ url, name }) => {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-[#1f1fe0]/10 text-[#1f1fe0] flex items-center justify-center text-xs font-bold ring-2 ring-slate-100">
      {initials}
    </div>
  );
};

const formatDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso.trim());
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Per-card comment toggle
const ReviewCard = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const WORD_LIMIT = 30;
  const words = review.comment?.split(" ") ?? [];
  const isLong = words.length > WORD_LIMIT;
  const displayedComment =
    isLong && !expanded
      ? words.slice(0, WORD_LIMIT).join(" ") + "..."
      : review.comment;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 flex flex-col gap-3 hover:border-slate-200 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar url={review.avatar_url} name={review.name} />
        <div>
          <p className="text-xs font-semibold text-slate-800 leading-tight">
            {review.name}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {formatDate(review.created_at)}
          </p>
        </div>
        {review.avg_overall && (
          <div className="ml-auto flex items-center gap-1">
            <StarRating score={parseFloat(review.avg_overall)} />
            <span className="text-[10px] font-bold text-slate-600">
              {parseFloat(review.avg_overall).toFixed(1)}
            </span>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        {displayedComment}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="self-start text-[11px] font-semibold text-[#1f1fe0] hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default function ReviewsSection({ listingId }) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReviews(listingId);

  const reviews = data?.pages?.flat() ?? [];
  const firstReview = reviews[0];

  return (
    <section className="mt-10 py-6 border-t border-slate-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <h3 className="text-sm font-bold">Reviews</h3>
        {firstReview?.avg_overall && (
          <div className="flex items-center gap-1.5">
            <StarRating score={parseFloat(firstReview.avg_overall)} />
            <span className="text-xs font-semibold text-slate-700">
              {parseFloat(firstReview.avg_overall).toFixed(1)}
            </span>
            {firstReview.total_reviews && (
              <span className="text-xs text-slate-400">
                · {firstReview.total_reviews} review
                {firstReview.total_reviews !== "1" ? "s" : ""}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 p-4 space-y-3 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100" />
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                  <div className="h-2.5 w-16 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded" />
              <div className="h-3 w-3/4 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <p className="text-xs text-slate-400 py-4">
          Could not load reviews at this time.
        </p>
      )}

      {!isLoading && !isError && reviews.length === 0 && (
        <p className="text-xs text-slate-400 py-4">No reviews yet.</p>
      )}

      {/* Review Cards */}
      {!isLoading && !isError && reviews.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Load More */}
          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:border-[#1f1fe0] hover:text-[#1f1fe0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFetchingNextPage ? "Loading..." : "Show more reviews"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
