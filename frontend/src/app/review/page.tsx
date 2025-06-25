import { Suspense } from "react";
import ReviewPageContent from "./ReviewPageContent"; // adjust path if needed

export default function ReviewPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading review form...</p>}>
      <ReviewPageContent />
    </Suspense>
  );
}
