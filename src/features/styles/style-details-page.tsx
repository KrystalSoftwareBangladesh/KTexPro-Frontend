import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Calendar,
  Check,
  Edit,
  FileText,
  Layers,
  Package,
  Send,
  Trash2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { Separator } from '@/components/ui/separator'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { useStyleDetails } from './hooks/use-style-details'
import { useStyleStatusTransition } from './hooks/use-style-mutations'
import { STATUS_LABELS } from './lib/status-labels'
import { StyleFormDialog } from './components/style-form-dialog'
import { StyleDeleteDialog } from './components/style-delete-dialog'
import type { StyleStatus } from '@/types/style'

interface PhaseStep {
  id: number
  title: string
  status: StyleStatus[]
  icon: React.ElementType
}

const phases: PhaseStep[] = [
  {
    id: 1,
    title: 'Inquiry & Setup',
    status: ['draft', 'basic_info_entered', 'inquiry_received'],
    icon: FileText,
  },
  {
    id: 2,
    title: 'Inquiry Processing',
    status: ['technical_details_defined', 'sent_to_supplier', 'quantity_planned'],
    icon: Send,
  },
  {
    id: 3,
    title: 'Sample Development',
    status: [
      'sample_material_received',
      'sample_cutting_sent',
      'sample_delivery_planned',
      'sample_sent_to_buyer',
      'awaiting_buyer_feedback',
    ],
    icon: Layers,
  },
  {
    id: 4,
    title: 'Approval & Production',
    status: [
      'documentation_sent',
      'running',
      'drop',
      'place_with_others',
      'production_planned',
    ],
    icon: Package,
  },
]

export function StyleDetailsPage() {
  const { id } = useParams({ from: '/_authenticated/styles/$id' })
  const navigate = useNavigate()
  const { data: style, isLoading, isError } = useStyleDetails(Number(id))
  const [activePhase, setActivePhase] = useState(1)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const statusTransitionMutation = useStyleStatusTransition()

  const getNextStatus = (currentStatus: StyleStatus): StyleStatus | null => {
    const statusFlow: StyleStatus[] = [
      'draft',
      'basic_info_entered',
      'inquiry_received',
      'technical_details_defined',
      'sent_to_supplier',
      'quantity_planned',
      'sample_material_received',
      'sample_cutting_sent',
      'sample_delivery_planned',
      'sample_sent_to_buyer',
      'awaiting_buyer_feedback',
      'documentation_sent',
      'running',
    ]
    const currentIndex = statusFlow.indexOf(currentStatus)
    if (currentIndex >= 0 && currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1]
    }
    return null
  }

  const handleStatusTransition = async (newStatus: StyleStatus) => {
    if (!style) return
    try {
      await statusTransitionMutation.mutateAsync({
        id: style.id,
        data: {
          targetStatus: newStatus,
          notes: `Status transitioned from ${STATUS_LABELS[style.currentStatus]} to ${STATUS_LABELS[newStatus]}`,
        },
      })
    } catch (error) {
      console.error('Error transitioning status:', error)
    }
  }

  if (isLoading) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main fixed>
          <div className='flex items-center justify-center py-12'>
            <p className='text-muted-foreground'>Loading style details...</p>
          </div>
        </Main>
      </>
    )
  }

  if (isError || !style) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main fixed>
          <div className='flex flex-col items-center justify-center py-12'>
            <p className='mb-4 text-muted-foreground'>
              Style not found or error loading data
            </p>
            <Button onClick={() => navigate({ to: '/styles' })}>
              Back to Styles
            </Button>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='mb-6'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate({ to: '/styles' })}
            className='mb-4'
          >
            <ArrowLeft className='mr-2 size-4' />
            Back to Styles
          </Button>

          <div className='flex items-start justify-between'>
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>
                {style.styleNumber}
              </h1>
              <p className='text-lg text-muted-foreground'>{style.styleName}</p>
            </div>
            <div className='flex gap-2'>
              <Badge className='text-sm'>{STATUS_LABELS[style.currentStatus]}</Badge>
              {getNextStatus(style.currentStatus) && (
                <Button
                  variant='default'
                  size='sm'
                  onClick={() => {
                    const next = getNextStatus(style.currentStatus)
                    if (next) handleStatusTransition(next)
                  }}
                  disabled={statusTransitionMutation.isPending}
                >
                  <Send className='mr-2 size-4' />
                  Advance to {STATUS_LABELS[getNextStatus(style.currentStatus)!]}
                </Button>
              )}
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className='mr-2 size-4' />
                Edit
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className='mr-2 size-4' />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-4'>
          {/* Phase Stepper - Left Column */}
          <div className='lg:col-span-1'>
            <Card>
              <CardHeader>
                <CardTitle>Workflow Phases</CardTitle>
                <CardDescription>Track your style progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {phases.map((phase) => {
                    const isActive = phase.status.includes(style.currentStatus)
                    const Icon = phase.icon

                    return (
                      <button
                        key={phase.id}
                        onClick={() => setActivePhase(phase.id)}
                        className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors ${
                          activePhase === phase.id
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div
                          className={`mt-0.5 rounded-full p-2 ${
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {isActive ? (
                            <Check className='size-4' />
                          ) : (
                            <Icon className='size-4' />
                          )}
                        </div>
                        <div className='flex-1'>
                          <p className='font-medium'>{phase.title}</p>
                          <p className='text-xs text-muted-foreground'>
                            Phase {phase.id}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Phase Details - Right Column */}
          <div className='space-y-6 lg:col-span-3'>
            {/* Phase 1: Inquiry & Setup */}
            {activePhase === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Phase 1: Inquiry & Initial Setup</CardTitle>
                  <CardDescription>
                    Basic information and inquiry tracking
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <label className='text-sm font-medium'>Style Number</label>
                      <p className='mt-1'>{style.styleNumber}</p>
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Style Name</label>
                      <p className='mt-1'>{style.styleName}</p>
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Buyer</label>
                      <p className='mt-1'>{style.buyerSummary?.name || '-'}</p>
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Supplier</label>
                      <p className='mt-1'>
                        {style.supplierSummary?.supplierName || '-'}
                      </p>
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Merchandiser</label>
                      <p className='mt-1'>
                        {style.merchandiserSummary?.fullName || '-'}
                      </p>
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Season</label>
                      <p className='mt-1'>{style.season}</p>
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Brand</label>
                      <p className='mt-1'>{style.brand}</p>
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Department</label>
                      <p className='mt-1'>{style.department}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className='mb-4 font-semibold'>Inquiry Dates</h3>
                    <div className='grid gap-4 md:grid-cols-2'>
                      <div>
                        <label className='text-sm font-medium'>
                          Inquiry Received
                        </label>
                        <p className='mt-1 flex items-center gap-2 text-sm'>
                          <Calendar className='size-4 text-muted-foreground' />
                          {style.inquiryDates.received
                            ? format(
                                new Date(style.inquiryDates.received),
                                'MMM dd, yyyy'
                              )
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <label className='text-sm font-medium'>
                          Sent to Supplier
                        </label>
                        <p className='mt-1 flex items-center gap-2 text-sm'>
                          <Calendar className='size-4 text-muted-foreground' />
                          {style.inquiryDates.sentToSupplier
                            ? format(
                                new Date(style.inquiryDates.sentToSupplier),
                                'MMM dd, yyyy'
                              )
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Phase 2: Inquiry Processing */}
            {activePhase === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Phase 2: Inquiry Processing</CardTitle>
                  <CardDescription>
                    Technical details and quantity planning
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div>
                    <h3 className='mb-4 font-semibold'>Technical Details</h3>
                    <div className='grid gap-4 md:grid-cols-2'>
                      <div>
                        <label className='text-sm font-medium'>Garment Type</label>
                        <p className='mt-1'>
                          {style.technicalDetails.garmentType || '-'}
                        </p>
                      </div>
                      <div>
                        <label className='text-sm font-medium'>
                          Fabric Details
                        </label>
                        <p className='mt-1'>
                          {style.technicalDetails.fabricDetails || '-'}
                        </p>
                      </div>
                      <div className='md:col-span-2'>
                        <label className='text-sm font-medium'>Items</label>
                        <p className='mt-1'>
                          {style.technicalDetails.items?.join(', ') || '-'}
                        </p>
                      </div>
                      <div className='md:col-span-2'>
                        <label className='text-sm font-medium'>Colors</label>
                        <p className='mt-1'>
                          {style.technicalDetails.colors?.join(', ') || '-'}
                        </p>
                      </div>
                      <div className='md:col-span-2'>
                        <label className='text-sm font-medium'>
                          Buyer Comments
                        </label>
                        <p className='mt-1'>
                          {style.technicalDetails.buyerComments || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className='mb-4 font-semibold'>Quantity Planning</h3>
                    <div className='grid gap-4 md:grid-cols-3'>
                      <div>
                        <label className='text-sm font-medium'>MOQ</label>
                        <p className='mt-1'>{style.quantityPlan.moq || '-'}</p>
                      </div>
                      <div>
                        <label className='text-sm font-medium'>MCQ</label>
                        <p className='mt-1'>{style.quantityPlan.mcq || '-'}</p>
                      </div>
                      <div>
                        <label className='text-sm font-medium'>
                          Target Price (FOB)
                        </label>
                        <p className='mt-1'>
                          {style.quantityPlan.targetPriceFob
                            ? `${style.quantityPlan.currency || 'USD'} ${style.quantityPlan.targetPriceFob}`
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Phase 3: Sample Development */}
            {activePhase === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Phase 3: Sample Development</CardTitle>
                  <CardDescription>
                    Sample tracking and delivery management
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div>
                    <h3 className='mb-4 font-semibold'>Sample Dates</h3>
                    <div className='grid gap-4 md:grid-cols-2'>
                      <div>
                        <label className='text-sm font-medium'>
                          Sample/Fabric Received in BD
                        </label>
                        <p className='mt-1 flex items-center gap-2 text-sm'>
                          <Calendar className='size-4 text-muted-foreground' />
                          {style.inquiryDates.sampleReceived
                            ? format(
                                new Date(style.inquiryDates.sampleReceived),
                                'MMM dd, yyyy'
                              )
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <label className='text-sm font-medium'>
                          Sample Cutting Sent to Supplier
                        </label>
                        <p className='mt-1 flex items-center gap-2 text-sm'>
                          <Calendar className='size-4 text-muted-foreground' />
                          {style.inquiryDates.sampleCuttingSent
                            ? format(
                                new Date(style.inquiryDates.sampleCuttingSent),
                                'MMM dd, yyyy'
                              )
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <label className='text-sm font-medium'>
                          Sample Sending Date
                        </label>
                        <p className='mt-1 flex items-center gap-2 text-sm'>
                          <Calendar className='size-4 text-muted-foreground' />
                          {style.inquiryDates.sampleSendingDate
                            ? format(
                                new Date(style.inquiryDates.sampleSendingDate),
                                'MMM dd, yyyy'
                              )
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <label className='text-sm font-medium'>
                          Sample Comments Received
                        </label>
                        <p className='mt-1 flex items-center gap-2 text-sm'>
                          <Calendar className='size-4 text-muted-foreground' />
                          {style.inquiryDates.sampleCommentsReceived
                            ? format(
                                new Date(style.inquiryDates.sampleCommentsReceived),
                                'MMM dd, yyyy'
                              )
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className='mb-4 font-semibold'>Sample Delivery Planning</h3>
                    <div className='grid gap-4 md:grid-cols-2'>
                      <div>
                        <label className='text-sm font-medium'>
                          Delivery Request Date
                        </label>
                        <p className='mt-1 flex items-center gap-2 text-sm'>
                          <Calendar className='size-4 text-muted-foreground' />
                          {style.sampleLog.deliveryRequestDate
                            ? format(
                                new Date(style.sampleLog.deliveryRequestDate),
                                'MMM dd, yyyy'
                              )
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <label className='text-sm font-medium'>
                          Target Delivery Date
                        </label>
                        <p className='mt-1 flex items-center gap-2 text-sm'>
                          <Calendar className='size-4 text-muted-foreground' />
                          {style.sampleLog.targetDeliveryDate
                            ? format(
                                new Date(style.sampleLog.targetDeliveryDate),
                                'MMM dd, yyyy'
                              )
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Phase 4: Approval & Production */}
            {activePhase === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Phase 4: Approval & Production Preparation</CardTitle>
                  <CardDescription>
                    Documentation and production planning
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div>
                    <h3 className='mb-4 font-semibold'>Documentation</h3>
                    <div className='grid gap-4 md:grid-cols-3'>
                      <div>
                        <label className='text-sm font-medium'>
                          S/O Sending Date
                        </label>
                        <p className='mt-1 flex items-center gap-2 text-sm'>
                          <Calendar className='size-4 text-muted-foreground' />
                          {style.documentation.soSendingDate
                            ? format(
                                new Date(style.documentation.soSendingDate),
                                'MMM dd, yyyy'
                              )
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <label className='text-sm font-medium'>
                          H/L Sending Date
                        </label>
                        <p className='mt-1 flex items-center gap-2 text-sm'>
                          <Calendar className='size-4 text-muted-foreground' />
                          {style.documentation.hlSendingDate
                            ? format(
                                new Date(style.documentation.hlSendingDate),
                                'MMM dd, yyyy'
                              )
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <label className='text-sm font-medium'>
                          Wash Panel Sending Date
                        </label>
                        <p className='mt-1 flex items-center gap-2 text-sm'>
                          <Calendar className='size-4 text-muted-foreground' />
                          {style.documentation.washPanelSendingDate
                            ? format(
                                new Date(style.documentation.washPanelSendingDate),
                                'MMM dd, yyyy'
                              )
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className='mb-4 font-semibold'>Production Planning</h3>
                    <div className='grid gap-4 md:grid-cols-2'>
                      <div>
                        <label className='text-sm font-medium'>
                          OPD (Original Production Date)
                        </label>
                        <p className='mt-1 flex items-center gap-2 text-sm'>
                          <Calendar className='size-4 text-muted-foreground' />
                          {style.productionPlanning?.opdDate
                            ? format(
                                new Date(style.productionPlanning.opdDate),
                                'MMM dd, yyyy'
                              )
                            : '-'}
                        </p>
                      </div>
                      <div className='md:col-span-2'>
                        <label className='text-sm font-medium'>
                          Final Remarks
                        </label>
                        <p className='mt-1'>
                          {style.productionPlanning?.remarks || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className='mb-4 font-semibold'>Inquiry Status Decision</h3>
                    <Badge
                      variant={
                        style.currentStatus === 'running'
                          ? 'default'
                          : style.currentStatus === 'drop'
                            ? 'destructive'
                            : 'outline'
                      }
                      className='text-base'
                    >
                      {STATUS_LABELS[style.currentStatus]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Status Timeline</CardTitle>
                <CardDescription>
                  Complete history of status changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {style.statusHistory?.map((entry, index) => (
                    <div key={index} className='flex gap-4'>
                      <div className='flex flex-col items-center'>
                        <div className='rounded-full bg-primary p-1'>
                          <Check className='size-3 text-primary-foreground' />
                        </div>
                        {index < style.statusHistory.length - 1 && (
                          <div className='h-full w-px bg-border' />
                        )}
                      </div>
                      <div className='pb-4'>
                        <p className='font-medium'>{STATUS_LABELS[entry.status]}</p>
                        <p className='text-sm text-muted-foreground'>
                          {format(new Date(entry.changedAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                        {entry.note && (
                          <p className='mt-1 text-sm'>{entry.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>

      <StyleFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        style={style}
      />

      <StyleDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        style={style}
        onSuccess={() => navigate({ to: '/styles' })}
      />
    </>
  )
}
