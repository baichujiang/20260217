import { Suspense } from "react"
import SearchResultsContent from "./SearchResultsContent"

export default function SearchResultsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={<div className="p-6">Loading restaurant details...</div>}>
        <SearchResultsContent />
      </Suspense>
    </main>
  )
}
