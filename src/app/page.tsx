import OverviewReviewTab from '@/components/OverviewReviewTab'
import { Button } from '@/components/ui/button'
import Link from "next/link"


export default async function Home() {
  return (
    <><main>
      <Link href={'/rating'}>
        <Button>Rating</Button>
      </Link>
    </main>
    
     <main>
        <Link href={'/tree'}>
          <Button>tree</Button>
        </Link>
      </main>

      <main>
        <Link href={'/moretrees'}>
          <Button>moretrees</Button>
        </Link>
      </main>

      <main>
        <Link href={'/badges'}>
          <Button>badges</Button>
        </Link>
      </main>
      </>
  )
}
