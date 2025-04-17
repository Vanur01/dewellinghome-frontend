import { Check, TicketIcon } from 'lucide-react';
import { useState } from 'react';

const ReferEarn = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("FRIEND2024");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-medium mb-6 text-gray-800">Refer & Earn</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="space-y-6">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Invite Friends & Family</h2>
            <p className="text-gray-600">Share the benefits and earn rewards for every successful referral</p>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
            <input 
              type="text" 
              value="FRIEND2024" 
              readOnly 
              className="bg-gray-50 px-4 py-2 rounded w-2/3 focus:outline-none"
            />
            <button 
              onClick={handleCopy}
              className={`${
                copied ? 'bg-slate-600 hover:bg-slate-700' : 'bg-rose-600 hover:bg-rose-700'
              } text-white px-6 py-2 rounded transition-colors duration-200`}
            >
              
              {copied ? <div className='flex justify-center items-center gap-2'>Copied<Check/></div> : 'Copy Code'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 text-2xl mb-2">$50</h3>
              <p className="text-gray-600">Per Referral</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 text-2xl mb-2">0</h3>
              <p className="text-gray-600">Total Referrals</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 text-2xl mb-2">$0</h3>
              <p className="text-gray-600">Total Earned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferEarn;