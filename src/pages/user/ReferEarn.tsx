import { useEffect, useState } from 'react';
import ReferralForm from '../../components/Forms/ReferralForm';
import { referralApi } from '../../utils/api';
import { Users, CheckCircle, Gift, Clipboard, Loader2, UserPlus } from 'lucide-react';

const ReferEarn = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReferrals = async () => {
    try {
      const res = await referralApi.getReferrals();
      // If using axios, data is in res.data
      setReferrals(res?.data?.data ?? []);
    } catch (error) {
      console.error('Failed to fetch referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  // Helper function to get status badge styling
  const getStatusBadge = (status) => {
    let badgeStyle = "";
    
    switch(status?.toLowerCase()) {
      case "pending":
        badgeStyle = "bg-yellow-100 text-yellow-800 border border-yellow-200";
        break;
      case "processing":
        badgeStyle = "bg-blue-100 text-blue-800 border border-blue-200";
        break;
      case "completed":
        badgeStyle = "bg-green-100 text-green-800 border border-green-200";
        break;
      case "rejected":
        badgeStyle = "bg-red-100 text-red-800 border border-red-200";
        break;
      default:
        badgeStyle = "bg-gray-100 text-gray-800 border border-gray-200";
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyle}`}>
        {status ?? 'unknown'}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-medium mb-6 text-gray-800">Refer & Earn</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <div className="text-center p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Invite Friends & Family</h2>
          <p className="text-gray-600 mb-4">Share the benefits and earn rewards for every successful referral</p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="bg-white rounded-full p-2 mr-3">
                <UserPlus className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-left">
                <p className="text-xs text-red-500 font-medium">Step 1</p>
                <p className="text-sm text-gray-600">Invite a friend</p>
              </div>
            </div>
            
            <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="bg-white rounded-full p-2 mr-3">
                <CheckCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-left">
                <p className="text-xs text-red-500 font-medium">Step 2</p>
                <p className="text-sm text-gray-600">They Book an Order</p>
              </div>
            </div>
            
            <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="bg-white rounded-full p-2 mr-3">
                <Gift className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-left">
                <p className="text-xs text-red-500 font-medium">Step 3</p>
                <p className="text-sm text-gray-600">You earn rewards</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <ReferralForm onSuccess={fetchReferrals} />
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
          <Clipboard className="h-5 w-5 mr-2 text-red-600" />
          Your Referrals
        </h3>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
          </div>
        ) : referrals?.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 mb-2">No referrals yet.</p>
            <p className="text-gray-400 text-sm">Start inviting friends to see your referrals here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {referrals?.map(ref => {
              const cardStyle = "bg-white";
              
              return (
                <div key={ref?._id} className={`border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow ${cardStyle}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-lg text-gray-800">{ref?.referralName}</p>
                      <p className="text-gray-500 text-sm">Ref ID: <span className="font-mono">{ref?.refId}</span></p>
                    </div>
                    <div>
                      {getStatusBadge(ref?.status)}
                    </div>
                  </div>
                  
                  {ref?.rewardMessage && ref?.status === "completed" && (
                    <div className="mt-3 p-3 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center">
                      <Gift className="h-5 w-5 mr-2 text-green-500" />
                      <span>{ref?.rewardMessage}</span>
                    </div>
                  )}
                  
                  <div className="mt-3 text-sm text-gray-500">
                    {ref?.status === "pending" && "Waiting for your friend to sign up."}
                    {ref?.status === "processing" && "Your friend has signed up! Processing your reward."}
                    {ref?.status === "completed" && "Referral complete! Reward has been issued."}
                    {ref?.status === "rejected" && "This referral was not eligible for a reward."}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferEarn;