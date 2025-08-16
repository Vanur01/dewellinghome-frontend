
"use client"

import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAdminTransactionStore } from "@/store/admin/adminTransaction.store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { UpdateTransactionData, Transaction } from "@/api/types"
import EditTransactionForm from "@/components/forms/EditTransactionForm"
import {  transactionApi } from "@/api"

export default function EditTransaction() {
  const navigate = useNavigate()
  const { transactionId } = useParams<{ transactionId: string }>()
  const { updateTransaction, loading } = useAdminTransactionStore()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [fetchLoading, setFetchLoading] = useState(true)

  // Fetch transaction details
  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) {
        navigate('/admin/transactions')
        return
      }

      try {
        setFetchLoading(true)
        const response =await transactionApi.getTransactionById(transactionId)
        if (response.status === 200) { 
          const transactionData = response.data.data.transaction
          setTransaction(transactionData)
        } else {
          throw new Error('Failed to fetch transaction')
        }
      } catch (error) {
        console.error("Error fetching transaction:", error)
        navigate('/admin/transactions')
      } finally {
        setFetchLoading(false)
      }
    }

    fetchTransaction()
  }, [transactionId])

  const handleSubmit = async (data: UpdateTransactionData) => {
    try {
      if (!transactionId) return
      
      const result = await updateTransaction(transactionId, data)
      if (result) {
        navigate('/admin/transactions')
      }
    } catch (error) {
      console.error("Error updating transaction:", error)
    }
  }

  const handleCancel = () => {
    navigate('/admin/transactions')
  }

  if (fetchLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading transaction...</span>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Transaction Not Found</h1>
          <Button onClick={() => navigate('/admin/transactions')}>
            Back to Transactions
          </Button>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold">Edit Transaction</h1>
          <p className="text-muted-foreground">
            Modify the details of transaction {transaction.transactionId}
          </p>
        </div>
      </div>

      <EditTransactionForm
        initialData={transaction}
        onSubmit={handleSubmit}
        loading={loading}
        onCancel={handleCancel}
      />
    </div>
  )
}
