import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs_underline"
import CommentCards from "./CommentCards"

export default async function OverviewReviewTab() {
    return (
        <Tabs defaultValue="Overview" className="w-[400px]">
        <TabsList>
            <TabsTrigger value="Overview">Overview</TabsTrigger>
            <TabsTrigger value="Review">Review</TabsTrigger>
        </TabsList>
        <TabsContent value="Overview">Make changes to your account here.</TabsContent>
        <TabsContent value="Review">
            <CommentCards></CommentCards>
        </TabsContent>
        </Tabs>
    )
}