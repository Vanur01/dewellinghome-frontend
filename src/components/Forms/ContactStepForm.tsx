import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InquiryStore from '@/store/public/InquiryStore';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .trim()
    .min(1, { message: 'Name is required' }),
  email: z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email' })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: 'Please enter a valid email address'
    }),
  phone: z.string()
    .min(1, { message: 'Phone number is required' })
    .regex(/^\d{10}$/, { message: 'Please enter a valid 10-digit phone number' }),
  address: z.string()
    .min(5, { message: 'Please enter a complete address' })
    .trim()
    .min(1, { message: 'Address is required' }),
  pincode: z.string()
    .min(1, { message: 'Pincode is required' })
    .regex(/^\d{6}$/, { message: 'Please enter a valid 6-digit pincode' }),
  message: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface ContactStepFormProps {
  isEditing?: boolean;
  onComplete?: () => void;
  initialData?: FormValues;
  onUserValidationChange?: (isValid: boolean) => void;
}

export default function ContactStepForm({ 
  isEditing = false,
  initialData ,
  onUserValidationChange
}: ContactStepFormProps) {
  const { userDetails, setUserDetails } = InquiryStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || userDetails.name || '',
      email: initialData?.email || userDetails.email || '',
      phone: initialData?.phone || userDetails.phone || '',
      address: initialData?.address || userDetails.address || '',
      pincode: initialData?.pincode || userDetails.pincode || '',
      message: initialData?.message || userDetails.message || ''
    },
    mode: 'all' // Change to 'all' for more aggressive validation
  });

  // Add a watch for form values
  const formValues = form.watch();

  // Add form validation check
  const isFormValid = form.formState.isValid;

  const onSubmit = (data: FormValues) => {
    // Only proceed if form is valid
    if (!isFormValid) {
      return;
    }
    onUserValidationChange?.(true);
    setUserDetails(data);
    
  };

  // Add effect to update store only when form is valid
  useEffect(() => {
    if (isFormValid) {
      setUserDetails(formValues);
      onUserValidationChange?.(true);
    } else {
      onUserValidationChange?.(false);
    }
  }, [isFormValid]);

  const getInputClassName = (fieldName: keyof FormValues) => {
    const baseClass = "w-full h-9 px-0 border-b focus:outline-none transition-colors";
    return `${baseClass} ${form.formState.errors[fieldName] ? 'border-red-500' : 'border-gray-300 focus:border-red-500'}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          {isEditing ? 'Edit Contact Information' : 'Contact Information'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">Name</Label>
              <input
                {...form.register('name')}
                id="name"
                type="text"
                className={getInputClassName('name')}
                placeholder="Enter your full name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-sm font-medium">Address</Label>
              <input
                {...form.register('address')}
                id="address"
                type="text"
                className={getInputClassName('address')}
                placeholder="Enter your complete address"
              />
              {form.formState.errors.address && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.address.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <input
                {...form.register('email')}
                id="email"
                type="email"
                className={getInputClassName('email')}
                placeholder="Enter your email address"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
              <input
                {...form.register('phone', {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  }
                })}
                id="phone"
                type="tel"
                className={getInputClassName('phone')}
                placeholder="Enter 10 digit mobile number"
                maxLength={10}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pincode" className="text-sm font-medium">Pincode</Label>
              <input
                {...form.register('pincode', {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  }
                })}
                id="pincode"
                type="text"
                className={getInputClassName('pincode')}
                placeholder="Enter 6 digit pincode"
                maxLength={6}
              />
              {form.formState.errors.pincode && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.pincode.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-sm font-medium">
              Additional Notes (Optional)
            </Label>
            <textarea
              {...form.register('message')}
              id="message"
              className="w-full min-h-[60px] p-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 transition-colors resize-y"
              placeholder="Write any additional information or special requirements here"
              rows={2}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
