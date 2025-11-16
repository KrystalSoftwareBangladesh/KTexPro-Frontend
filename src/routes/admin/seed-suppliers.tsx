import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle2, XCircle, Database } from 'lucide-react'
import api from '@/config/api'
import { seedSuppliers } from '@/data/seed-suppliers'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/seed-suppliers')({
  component: SeedSuppliersPage,
})

function SeedSuppliersPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [results, setResults] = useState<Array<{ name: string; status: 'success' | 'error'; message?: string }>>([])
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const handleSeed = async () => {
    setIsSeeding(true)
    setResults([])
    setProgress({ current: 0, total: seedSuppliers.length })

    const newResults: Array<{ name: string; status: 'success' | 'error'; message?: string }> = []

    for (let i = 0; i < seedSuppliers.length; i++) {
      const supplier = seedSuppliers[i]
      setProgress({ current: i + 1, total: seedSuppliers.length })

      try {
        const payload = {
          name: supplier.name,
          capabilities: supplier.capabilities,
          contact_persons: supplier.contact_persons.map((contact) => ({
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            username: contact.email.split('@')[0],
          })),
        }

        await api.post('/supplier/v1/suppliers/', payload)
        newResults.push({ name: supplier.name, status: 'success' })
        toast.success(`Created: ${supplier.name}`)
      } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Unknown error'
        newResults.push({ name: supplier.name, status: 'error', message })
        toast.error(`Failed: ${supplier.name}`)
      }

      setResults([...newResults])
    }

    setIsSeeding(false)
    
    const successCount = newResults.filter(r => r.status === 'success').length
    const failCount = newResults.filter(r => r.status === 'error').length
    
    if (successCount === seedSuppliers.length) {
      toast.success(`All ${successCount} suppliers created successfully!`)
    } else {
      toast.warning(`Created ${successCount} suppliers, ${failCount} failed`)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Seed Supplier Data
          </CardTitle>
          <CardDescription>
            Create {seedSuppliers.length} sample suppliers with realistic data for testing and development
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Sample Data Includes:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 8 diverse suppliers from Bangladesh, China, Pakistan, India, Vietnam</li>
              <li>• Mix of factories (7) and traders (2)</li>
              <li>• Various capabilities: Yarn, Knitting, Dyeing, Sewing, Printing, etc.</li>
              <li>• Real certifications: BSCI, WRAP, GOTS, OEKO-TEX, ISO standards</li>
              <li>• Complete contact persons and factory details</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleSeed}
              disabled={isSeeding}
              size="lg"
              className="flex-1"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding... ({progress.current}/{progress.total})
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Create All Suppliers
                </>
              )}
            </Button>
          </div>

          {results.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Results:</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      result.status === 'success'
                        ? 'bg-green-50 text-green-900'
                        : 'bg-red-50 text-red-900'
                    }`}
                  >
                    {result.status === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{result.name}</p>
                      {result.message && (
                        <p className="text-sm opacity-75">{result.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium">
                  Summary: {results.filter(r => r.status === 'success').length} succeeded,{' '}
                  {results.filter(r => r.status === 'error').length} failed
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
