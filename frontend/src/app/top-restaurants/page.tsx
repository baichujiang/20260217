import { Suspense } from "react"
import TopRestaurantsContent from "./TopRestaurantsContent"

export default function SearchResultsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={<div className="p-6">Loading restaurant details...</div>}>
        <TopRestaurantsContent />
      </Suspense>
    </main>
  )
}
