import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import {
  AlertCircle,
  Clock,
  CreditCard,
  FileText,
  Phone,
  Mail,
  Calendar,
  Shield,
} from 'lucide-react';

const RefundCancellation: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Shield className="h-10 w-10 text-red-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Refund & Cancellation Policy</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            At Dewelling Home, we follow a strict no-refund and no-cancellation policy for all interior design and turnkey project services. Please review the terms below carefully before proceeding with any payment.
          </p>
          <div className="mt-4">
            <Badge variant="secondary" className="text-sm">
              Effective from: January 1, 2025
            </Badge>
          </div>
        </div>

        <div className="space-y-8">
          {/* Cancellation Policy */}
          <Card className="shadow-md">
            <CardHeader className="bg-red-600 text-white rounded-t-md">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <CardTitle className="text-lg">Cancellation Policy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <p className="text-gray-700">
                All payments made toward design consultations, project booking, execution, or furniture manufacturing are non-cancellable. Once payment is processed, the project is considered confirmed and cannot be cancelled for any reason.
              </p>
              <p className="text-gray-700">
                This includes but is not limited to advance payments, milestone payments, and full project payments.
              </p>
            </CardContent>
          </Card>

          {/* Refund Policy */}
          <Card className="shadow-md">
            <CardHeader className="bg-red-700 text-white rounded-t-md">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                <CardTitle className="text-lg">Refund Policy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <p className="text-gray-700">
                Due to the nature of interior design and execution, all payments made to Dewelling Home are strictly non-refundable. This applies to all services, including site visits, design planning, modular furniture, civil work, and third-party product procurement.
              </p>
              <Separator />
              <p className="text-gray-700">
                We urge clients to fully understand project timelines, deliverables, and scope before initiating payment. Once a project is initiated, significant resources are allocated and orders are placed — making refunds operationally unviable.
              </p>
            </CardContent>
          </Card>

          {/* Project Holds & Delays */}
          <Card className="shadow-md">
            <CardHeader className="bg-purple-700 text-white rounded-t-md">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <CardTitle className="text-lg">Project Holds & Delays</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <ul className="space-y-3 list-disc list-inside text-gray-700">
                <li>
                  A project may be paused (on request) for up to 30 days without charge. Beyond this, storage or reactivation charges may apply.
                </li>
                <li>
                  No refunds are offered for delays caused due to client-side changes, site inaccessibility, or rescheduling.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="shadow-md bg-white">
            <CardHeader>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <CardTitle className="text-lg text-gray-900">Contact & Queries</CardTitle>
              </div>
              <p className="text-gray-600 mt-2">
                For any clarification regarding this policy, please reach out via the channels below.
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-md border">
                  <Mail className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <p className="text-sm text-gray-600">hello@dewellinghome.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-md border">
                  <Phone className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-800">Phone</p>
                    <p className="text-sm text-gray-600">+91 83289 73166</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-200">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Official Requests Only</p>
                    <p className="text-sm text-gray-700">
                      All communication regarding this policy must be submitted in writing via email. Verbal conversations or WhatsApp messages will not be considered for official processing.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-gray-500">
          This policy may be updated from time to time. Clients are requested to review it prior to engaging with our services.
        </div>
      </div>
    </div>
  );
};

export default RefundCancellation;
