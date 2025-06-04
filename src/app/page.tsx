import OverviewReviewTab from '@/components/OverviewReviewTab'
import { Button } from '@/components/ui/button'
import Link from "next/link"


export default function Home() {
    return (
        <main className="p-6 flex flex-col items-start gap-6">
            {/* Navigate to rating page */}
            <Link href="/rating">
                <Button>Rating</Button>
            </Link>

            {/* Optional: Add review tab here */}
            <div className="w-full">
                <OverviewReviewTab />
            </div>
        </main>
    );
}
