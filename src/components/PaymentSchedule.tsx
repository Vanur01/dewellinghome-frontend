import { useState, useEffect } from 'react';

export default function PaymentSchedule() {
  const [view, setView] = useState('client'); // 'client' or 'admin'
  const [totalProjectValue, setTotalProjectValue] = useState(4950169); // Initial project value
  const [editMode, setEditMode] = useState(false);
  
  // Payment structure with percentages
  const paymentStructure = [
    {
      slNo: 1,
      timeline: "During Order Booking",
      percentage: 15,
    },
    {
      slNo: 2,
      timeline: "Before 3D Renders Sharing",
      percentage: 15,
    },
    {
      slNo: 3,
      timeline: "Before material Acquisition for Constructions",
      percentage: 60,
    },
    {
      slNo: 4,
      timeline: "After completing 80% of the work and before Outer laminate dispatch",
      percentage: 10,
    }
  ];
  
  // Payment status (what's been paid so far for each milestone)
  const [paymentStatus, setPaymentStatus] = useState([
    {
      slNo: 1,
      paid: 675323, // Example: client paid more than required for first milestone
    },
    {
      slNo: 2,
      paid: 0,
    },
    {
      slNo: 3,
      paid: 0,
    },
    {
      slNo: 4,
      paid: 0,
    }
  ]);
  
  // Derived payment data including recalculated amounts
  const [paymentData, setPaymentData] = useState([]);
  
  // Calculate payment data when project value or payment status changes
  useEffect(() => {
    let remainingOverpayment = 0;
    
    const newPaymentData = paymentStructure.map((item, index) => {
      const amount = Math.round(totalProjectValue * (item.percentage / 100));
      const currentPaid = paymentStatus[index]?.paid || 0;
      
      // Apply any overpayment from previous milestone
      const effectivePaid = currentPaid + remainingOverpayment;
      
      // Calculate if there's any overpayment for this milestone
      if (effectivePaid > amount) {
        remainingOverpayment = effectivePaid - amount;
      } else {
        remainingOverpayment = 0;
      }
      
      return {
        ...item,
        amount,
        paid: Math.min(effectivePaid, amount), // Cap displayed paid at the amount
        actualPaid: currentPaid, // Store the actual payment made at this milestone
        effectivePaid, // Total effective payment (including overpayments from previous)
        overpayment: Math.max(0, effectivePaid - amount), // How much was overpaid
        toBePaid: Math.max(0, amount - effectivePaid) // Remaining to be paid
      };
    });
    
    setPaymentData(newPaymentData);
  }, [totalProjectValue, paymentStatus]);
  
  const totalToBePaid = paymentData.reduce((sum, item) => sum + item.toBePaid, 0);
  const totalPaid = paymentData.reduce((sum, item) => sum + item.actualPaid, 0);
  
  // Calculate total overpayment correctly - the difference between total paid and what's needed
  const totalRequiredAmount = paymentData.reduce((sum, item) => sum + item.amount, 0);
  const totalOverpayment = Math.max(0, totalPaid - (totalRequiredAmount - totalToBePaid));
  
  // Format currency to Indian Rupee format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };
  
  // Update project total value
  const handleProjectValueChange = (e) => {
    setTotalProjectValue(Number(e.target.value));
  };
  
  // Handle marking a payment as paid (admin functionality)
  const handlePaymentUpdate = (slNo, newPaidAmount) => {
    setPaymentStatus(prev => 
      prev.map(item => 
        item.slNo === slNo ? { ...item, paid: Number(newPaidAmount) } : item
      )
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Toggle between admin and client view */}
      {view === 'admin' && (
        <div className="flex justify-end mb-4 space-x-4">
          <button 
            onClick={() => setEditMode(!editMode)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            {editMode ? 'Cancel Edit' : 'Edit Values'}
          </button>
          <button 
            onClick={() => setView('client')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Switch to Client View
          </button>
        </div>
      )}
      
      {view === 'client' && (
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setView('admin')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Switch to Admin View
          </button>
        </div>
      )}
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-red-600 text-white text-center py-3 text-xl font-bold">
          PAYMENT SCHEDULE
        </div>
        
        {view === 'admin' && (
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Project Value:</span>
              {editMode ? (
                <input 
                  type="number" 
                  value={totalProjectValue}
                  onChange={handleProjectValueChange}
                  className="border rounded px-3 py-1 w-64 text-right"
                />
              ) : (
                <span className="font-bold text-lg">{formatCurrency(totalProjectValue)}</span>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-semibold">Total Received:</span>
              <span className="font-bold text-lg">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {totalOverpayment > 0 && (
                <div className="text-green-600 font-semibold">
                  Client has overpaid by {formatCurrency(totalOverpayment)}, which has been applied to future milestones.
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 border">Sl No.</th>
                <th className="px-4 py-3 border">Payments Timelines and Services</th>
                <th className="px-4 py-3 border text-center">Percentage</th>
                <th className="px-4 py-3 border text-right">Amount</th>
                {view === 'admin' && (
                  <>
                    <th className="px-4 py-3 border text-right">Actual Paid</th>
                    <th className="px-4 py-3 border text-right">Effective Paid</th>
                  </>
                )}
                {view !== 'admin' && (
                  <th className="px-4 py-3 border text-right">Paid</th>
                )}
                <th className="px-4 py-3 border text-right">To be paid</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((item) => (
                <tr key={item.slNo} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">{item.slNo}</td>
                  <td className="px-4 py-3 border">{item.timeline}</td>
                  <td className="px-4 py-3 border text-center">{item.percentage}%</td>
                  <td className="px-4 py-3 border text-right">{formatCurrency(item.amount)}</td>
                  
                  {view === 'admin' && (
                    <>
                      <td className="px-4 py-3 border text-right">
                        {editMode ? (
                          <input 
                            type="number" 
                            value={item.actualPaid}
                            onChange={(e) => handlePaymentUpdate(item.slNo, e.target.value)}
                            className="border rounded px-2 py-1 w-32 text-right"
                          />
                        ) : (
                          item.actualPaid > 0 ? formatCurrency(item.actualPaid) : '-'
                        )}
                      </td>
                      <td className="px-4 py-3 border text-right">
                        {item.effectivePaid > 0 ? (
                          <div>
                            {formatCurrency(Math.min(item.effectivePaid, item.amount))}
                            {item.overpayment > 0 && (
                              <span className="text-green-600 ml-1">
                                (+{formatCurrency(item.overpayment)})
                              </span>
                            )}
                          </div>
                        ) : '-'}
                      </td>
                    </>
                  )}
                  
                  {view !== 'admin' && (
                    <td className="px-4 py-3 border text-right">
                      {item.effectivePaid > 0 ? formatCurrency(Math.min(item.effectivePaid, item.amount)) : '-'}
                    </td>
                  )}
                  
                  <td className={`px-4 py-3 border text-right ${item.toBePaid > 0 ? 'font-medium' : ''}`}>
                    {item.toBePaid > 0 ? formatCurrency(item.toBePaid) : 'Paid'}
                  </td>
                </tr>
              ))}
              <tr className="bg-green-100 font-bold">
                <td colSpan={view === 'admin' ? 4 : 3} className="px-4 py-3 border text-right">
                  Totals
                </td>
                {view === 'admin' && (
                  <>
                    <td className="px-4 py-3 border text-right">
                      {formatCurrency(totalPaid)}
                    </td>
                    <td className="px-4 py-3 border text-right">
                      {formatCurrency(totalPaid)}
                    </td>
                  </>
                )}
                {view !== 'admin' && (
                  <td className="px-4 py-3 border text-right">
                    {formatCurrency(totalPaid)}
                  </td>
                )}
                <td className="px-4 py-3 border text-right">
                  {formatCurrency(totalToBePaid)}
                </td>
              </tr>
              {view === 'admin' && (
                <tr className="bg-blue-50 font-bold">
                  <td colSpan={3} className="px-4 py-3 border text-right">
                    Total Project Value
                  </td>
                  <td colSpan={3} className="px-4 py-3 border text-right">
                    {formatCurrency(totalProjectValue)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {view === 'client' && (
          <div className="p-4 bg-blue-50 border-t">
            <h3 className="text-lg font-semibold mb-2">Payment Instructions</h3>
            <p className="text-gray-700">
              Please ensure timely payments according to the schedule above to avoid any delay in project completion.
              For any payment-related queries, contact our finance department.
            </p>
            {totalOverpayment > 0 && (
              <p className="text-green-600 font-medium mt-2">
                Note: Your advance payment of {formatCurrency(totalOverpayment)} has been applied to future milestones as shown in the table above.
              </p>
            )}
          </div>
        )}
        
        {view === 'admin' && (
          <div className="p-4 bg-gray-50 border-t">
            <h3 className="text-lg font-semibold mb-2">Admin Notes</h3>
            <p className="text-gray-700 mb-4">
              Track client payments status and manage project values. All milestone amounts automatically update
              based on percentage when project value changes.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="text-sm">
                <strong>Payment Summary:</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>Total Project Value: {formatCurrency(totalProjectValue)}</li>
                  <li>Total Received: {formatCurrency(totalPaid)}</li>
                  <li>Total Remaining: {formatCurrency(totalToBePaid)}</li>
                  {totalOverpayment > 0 && (
                    <li className="text-green-600">Overpayment: {formatCurrency(totalOverpayment)}</li>
                  )}
                </ul>
              </div>
              {!editMode && (
                <div className="flex space-x-4 mt-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Send Payment Reminder
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                    Generate Invoice
                  </button>
                </div>
              )}
              {editMode && (
                <button 
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}