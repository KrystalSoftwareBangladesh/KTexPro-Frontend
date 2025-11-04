"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Edit, Mail, MapPin, MoreVertical, Phone, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import LeadActivityTimeline from "./lead-activity-timeline"
// import LeadContactInfo from "./lead-contact-info"
import LeadDealPipeline from "./lead-deal-pipeline"

export default function LeadsDetailsPage() {
  const [lead] = useState({
    id: "LEAD-001",
    name: "Sarah Johnson",
    company: "Tech Innovations Inc",
    email: "sarah.johnson@techinnovations.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    status: "Qualified",
    dealValue: "$50,000",
    dealStage: "Proposal",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    source: "LinkedIn",
    lastContact: "2 days ago",
    nextFollowUp: "2024-10-25",
  })

  const activities = [
    {
      id: 1,
      type: "email",
      title: "Email sent",
      description: "Sent proposal document",
      timestamp: "2 days ago",
      user: "You",
    },
    {
      id: 2,
      type: "call",
      title: "Call completed",
      description: "Discussed pricing and timeline",
      timestamp: "5 days ago",
      user: "You",
    },
    {
      id: 3,
      type: "meeting",
      title: "Meeting scheduled",
      description: "Initial discovery call",
      timestamp: "1 week ago",
      user: "You",
    },
    {
      id: 4,
      type: "note",
      title: "Note added",
      description: "Lead is very interested in Q4 implementation",
      timestamp: "1 week ago",
      user: "You",
    },
  ]

  return (
    <div className="min-h-screen bg-background">


      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Lead Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lead Overview Card */}
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={lead.avatar || "/placeholder.svg"} alt={lead.name} />
                    <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{lead.name}</CardTitle>
                    <CardDescription className="text-base">{lead.company}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Lead
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Lead
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="flex justify-between">
                <div className="flex justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{lead.status}</Badge>
                    <span className="text-sm text-muted-foreground">Status</span>
                  </div>
                  <div className="flex items-center gap-2 ml-5 mr-15">
                    <Badge variant="secondary">{lead.source}</Badge>
                    <span className="text-sm text-muted-foreground">Source</span>
                  </div>
                </div>
                <div>
                  <Button
                    variant="outline"
                    className="ml-auto  bg-transparent"
                  >
                    <span className="text-lg">⋯</span>
                    <span className="ml-2">Edit</span>
                  </Button>
                </div>
              </CardContent>
              {/* Contact Information Section */}
              <CardContent className="pt-6 pb-6 border-t mx-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Email */}
                  <div className="flex items-start gap-3 min-w-0">
                    <Mail className="h-5 w-5 text-slate-600 mt-5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-slate-600 mb-1">Email</p>
                      <p className="text-slate-600 font-medium break-words">{lead.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3 min-w-0 md:border-l md:pl-5">
                    <Phone className="h-5 w-5 text-slate-600 mt-5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-slate-600 mb-1">Phone</p>
                      <p className="text-slate-600 font-medium break-words">{lead.phone}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 min-w-0 lg:border-l lg:pl-5">
                    <MapPin className="h-5 w-5 text-slate-600 mt-5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-slate-600 mb-1">Location</p>
                      <p className="text-slate-600 font-medium break-words">{lead.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            {/* <LeadContactInfo lead={lead} /> */}

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Recent interactions with this lead</CardDescription>
              </CardHeader>
              <CardContent>
                <LeadActivityTimeline activities={activities} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Deal & Actions */}
          <div className="space-y-6">
            {/* Deal Pipeline */}
            <LeadDealPipeline lead={lead} />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Lead
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </CardContent>
            </Card>

            {/* Lead Score */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lead Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Score</span>
                      <span className="text-2xl font-bold text-primary">85/100</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[85%] rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engagement</span>
                      <span className="font-medium">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget Fit</span>
                      <span className="font-medium">Good</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timeline</span>
                      <span className="font-medium">Q4 2024</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
