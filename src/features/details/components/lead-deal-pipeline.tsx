import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"

interface LeadDealPipelineProps {
  lead: {
    dealValue: string
    dealStage: string
    nextFollowUp: string
  }
}

export default function LeadDealPipeline({ lead }: LeadDealPipelineProps) {
  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"]
  const currentStageIndex = stages.indexOf(lead.dealStage)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Deal Pipeline
        </CardTitle>
        <CardDescription>Current deal status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Deal Value</span>
            <span className="text-lg font-bold text-primary">{lead.dealValue}</span>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium">Pipeline Stage</p>
          <div className="space-y-2">
            {stages.map((stage, index) => (
              <div key={stage} className="flex items-center gap-2">
                <div className={`h-2 flex-1 rounded-full ${index <= currentStageIndex ? "bg-primary" : "bg-muted"}`} />
                <span
                  className={`text-xs font-medium ${
                    index <= currentStageIndex ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {stage}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Next Follow-up</p>
          <Badge variant="outline">{lead.nextFollowUp}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
