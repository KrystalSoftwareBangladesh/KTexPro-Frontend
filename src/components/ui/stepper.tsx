import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Step = {
  id: string
  title: string
  description?: string
}

type StepperProps = {
  steps: Step[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav aria-label='Progress' className={cn('w-full', className)}>
      <ol role='list' className='flex items-center justify-between'>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <li
              key={step.id}
              className={cn(
                'relative flex-1',
                index !== steps.length - 1 && 'pr-2 sm:pr-4'
              )}
            >
              <div className='group flex items-center'>
                <div className='flex items-center'>
                  <span
                    className={cn(
                      'relative flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      isCompleted &&
                        'border-primary bg-primary text-primary-foreground',
                      isCurrent &&
                        'border-primary bg-background text-primary',
                      isUpcoming && 'border-muted bg-background text-muted-foreground'
                    )}
                    aria-label={`Step ${index + 1}: ${step.title}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                  >
                    {isCompleted ? (
                      <CheckIcon className='size-4' />
                    ) : (
                      <span className='text-sm font-medium' aria-hidden='true'>{index + 1}</span>
                    )}
                  </span>
                </div>

                <div className='ml-2 min-w-0 flex-col'>
                  <span
                    className={cn(
                      'text-sm font-medium transition-colors',
                      'hidden sm:block',
                      isCurrent && 'text-foreground',
                      (isCompleted || isUpcoming) && 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                  <span className='sr-only sm:not-sr-only sm:hidden'>
                    {step.title}
                  </span>
                  {step.description && (
                    <span className='hidden text-xs text-muted-foreground sm:block'>
                      {step.description}
                    </span>
                  )}
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={cn(
                      'absolute left-8 top-4 -ml-px hidden h-0.5 w-full sm:block',
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    )}
                    aria-hidden='true'
                  />
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
