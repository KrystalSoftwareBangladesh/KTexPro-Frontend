import { Mail, Phone, Calendar, FileText } from "lucide-react"

interface Activity {
  id: number
  type: string
  title: string
  description: string
  timestamp: string
  user: string
}

interface LeadActivityTimelineProps {
  activities: Activity[]
}

export default function LeadActivityTimeline({ activities }: LeadActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "call":
        return <Phone className="h-4 w-4" />
      case "meeting":
        return <Calendar className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              {getActivityIcon(activity.type)}
            </div>
            {index < activities.length - 1 && <div className="mt-2 h-12 w-0.5 bg-border" />}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
