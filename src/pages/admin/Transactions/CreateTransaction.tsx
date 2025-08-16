"use client"

import { useNavigate, useParams } from "react-router-dom"
import { useAdminTransactionStore } from "@/store/admin/adminTransaction.store"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CreateManualTransactionData } from "@/api/types"
import CreateTransactionForm from "@/components/forms/CreateTransactionForm"

export default function CreateTransaction() {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId?: string }>()
  const { createManualTransaction, loading } = useAdminTransactionStore()

  const handleSubmit = async (data: CreateManualTransactionData) => {
    try {
      const result = await createManualTransaction(data)
      if (result) {
        navigate('/admin/transactions')
      }
    } catch (error) {
      console.error("Error creating transaction:", error)
    }
  }

  const handleCancel = () => {
    navigate('/admin/transactions')
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/transactions')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Transactions
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold">Create Manual Transaction</h1>
          <p className="text-muted-foreground">
            Record a manual payment transaction for a project
          </p>
        </div>
      </div>

      <CreateTransactionForm
        preSelectedProjectId={projectId}
        onSubmit={handleSubmit}
        loading={loading}
        onCancel={handleCancel}
      />
    </div>
  )
}
