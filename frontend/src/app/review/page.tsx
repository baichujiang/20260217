import ReviewForm from "@/components/ReviewForm"
import { Header } from "@/components/ui/Header" // ✅ Correct path to shared header

export default function ReviewPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header /> {/* ✅ Consistent top header */}
            <div className="p-6">
                <ReviewForm restaurantId="1" />
            </div>
        </main>
    )
}
