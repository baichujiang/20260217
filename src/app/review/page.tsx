import ReviewForm from "@/components/ReviewForm"
import TopActionBar from "@/components/TopActionBar"

export default function ReviewPage() {
  return (
    <main>
      <TopActionBar />
      <div className="p-6">
        <ReviewForm restaurantId="1"/>
      </div>
    </main>
  )
}