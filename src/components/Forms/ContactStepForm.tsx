import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import InquiryStore from '@/store/InquiryStore';

interface UserDetails {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  countryCode?: string;
  pincode?: string;
  message?: string;
}

interface ContactStepFormProps {
  isEditing?: boolean;
  onComplete?: () => void;
  initialData?: UserDetails;
}

export default function ContactStepForm({ 
  isEditing = false,
  onComplete,
  initialData 
}: ContactStepFormProps) {
  const { userDetails, setUserDetails } = InquiryStore();
  const [formData, setFormData] = useState({
    name: initialData?.name || userDetails.name || '',
    email: initialData?.email || userDetails.email || '',
    phone: initialData?.phone || userDetails.phone || '',
    address: initialData?.address || userDetails.address || '',
    countryCode: initialData?.countryCode || userDetails.countryCode || '+91',
    pincode: initialData?.pincode || userDetails.pincode || '',
    message: initialData?.message || userDetails.message || ''
  });

  const handleChange = (field: string, value: string) => {
    // Add validation for phone (only numbers)
    if (field === 'phone') {
      value = value.replace(/\D/g, '');
      if (value.length > 10) value = value.slice(0, 10);
    }
    
    // Add validation for pincode (only numbers, max 6 digits)
    if (field === 'pincode') {
      value = value.replace(/\D/g, '');
      if (value.length > 6) value = value.slice(0, 6);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Update store in real-time as user types
    setUserDetails({
      ...userDetails,
      [field]: value
    });

    // If all required fields are filled and valid, call onComplete
    if (onComplete && field !== 'message') {
      const updatedData = {
        ...formData,
        [field]: value
      };
      
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedData.email);
      const isValidPhone = updatedData.phone.length === 10;
      const isValidPincode = updatedData.pincode.length === 6;
      
      if (
        updatedData.name.trim() &&
        isValidEmail &&
        isValidPhone &&
        isValidPincode
      ) {
        onComplete();
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          {isEditing ? 'Edit Contact Information' : 'Contact Information'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full h-9 px-0 border-b border-gray-300 focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-sm font-medium">
                Address
              </Label>
              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full h-9 px-0 border-b border-gray-300 focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full h-9 px-0 border-b border-gray-300 focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone
              </Label>
              <div className="flex gap-2">
                <Select 
                  value={formData.countryCode} 
                  onValueChange={(value) => handleChange('countryCode', value)}
                >
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">India (+91)</SelectItem>
                    <SelectItem value="+1">USA (+1)</SelectItem>
                    <SelectItem value="+44">UK (+44)</SelectItem>
                    <SelectItem value="+971">UAE (+971)</SelectItem>
                    <SelectItem value="+65">Singapore (+65)</SelectItem>
                    <SelectItem value="+61">Australia (+61)</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="flex-1 h-9 px-0 border-b border-gray-300 focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="Enter 10 digit mobile number"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pincode" className="text-sm font-medium">
                Pincode
              </Label>
              <input
                id="pincode"
                type="text"
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                className="w-full h-9 px-0 border-b border-gray-300 focus:outline-none focus:border-red-500 transition-colors"
                placeholder="Enter 6 digit pincode"
                maxLength={6}
                pattern="[0-9]{6}"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-sm font-medium">
              Additional Notes (Optional)
            </Label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              className="w-full min-h-[60px] p-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 transition-colors resize-y"
              rows={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
