import React, { useState, useRef, useEffect } from 'react';
import { useProfileStore } from '../../store/user/ProfileStore';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Home,
  Shield,
  CreditCard,
  ChevronRight,
  Upload,
  Pencil,
  X,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorState {
  phone: string;
  address: string;
}

const Profile: React.FC = () => {
  const { profile, isLoading, fetchProfile, updateProfile, isUpdating, updateError, clearError } = useProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<ErrorState>({ 
    phone: '', 
    address: '' 
  });

  useEffect(() => {
    if(!profile){ 
      fetchProfile();
    }
  }, [fetchProfile, profile]);

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile?.name ?? '',
        phone: profile?.phone ?? '',
        address: profile?.address ?? '',
      });
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse bg-gray-200 h-[200px] rounded-lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl text-center">
          Please login to view your profile
        </h2>
      </div>
    );
  }

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateInput = (name: string, value: string): boolean => {
    switch (name) {
      case 'phone':
        if (!/^\d{10}$/.test(value)) {
          setErrors(prev => ({ ...prev, phone: 'Phone number must be exactly 10 digits' }));
          return false;
        }
        setErrors(prev => ({ ...prev, phone: '' }));
        return true;

      case 'address':
        if (value.length < 5) {
          setErrors(prev => ({ ...prev, address: 'Address must be at least 5 characters long' }));
          return false;
        }
        setErrors(prev => ({ ...prev, address: '' }));
        return true;

      default:
        return true;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Only allow digits
      const sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
      validateInput(name, sanitizedValue);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      validateInput(name, value);
    }
  };

  const handleSubmit = async () => {
    // Validate all fields before submission
    const isPhoneValid = validateInput('phone', formData.phone);
    const isAddressValid = validateInput('address', formData.address);

    if (!isPhoneValid || !isAddressValid) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      await updateProfile({
        ...formData,
        image: selectedImage || undefined,
      });
      setIsEditing(false);
      setPreviewImage(null);
      setSelectedImage(null);
      setErrors({ phone: '', address: '' });
      toast.success("Profile updated successfully");
    } catch {
      toast.error(updateError ?? "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: profile?.name ?? '',
      phone: profile?.phone ?? '',
      address: profile?.address ?? '',
    });
    setPreviewImage(null);
    setSelectedImage(null);
    setErrors({ phone: '', address: '' });
    clearError();
  };

  const QuickLinkCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    link: string;
  }> = ({ icon, title, description, link }) => (
    <Link to={link}>
      <Card className="hover:bg-red-50 transition-colors">
        <CardContent className="flex items-start space-x-4 pt-6">
          <div className="p-2 bg-red-50 rounded-lg">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-red-500" />
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <Card>
          <CardHeader>
            <div className="text-center relative">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div 
                className={`w-32 h-32 border-1 border-red-500 rounded-full mx-auto mb-4 flex items-center justify-center relative overflow-hidden ${isEditing ? 'cursor-pointer hover:opacity-90' : ''}`}
                onClick={handleImageClick}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : profile?.image ? (
                  <img
                    src={profile.image}
                    alt={profile?.name ?? 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-white">
                    {profile?.name?.[0]?.toUpperCase() ?? profile?.email?.[0]?.toUpperCase() ?? '?'}
                  </span>
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-0 right-0"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="absolute top-0 right-0 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
              <h1 className="text-3xl font-bold mt-4">
                {isEditing ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-center text-2xl font-bold"
                    placeholder="Your Name"
                  />
                ) : (
                  profile?.name ?? 'No Name Set'
                )}
              </h1>
            </div>
          </CardHeader>

          <Separator className="my-4" />

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-muted-foreground">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{profile?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-muted-foreground">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    {isEditing ? (
                      <div>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                          placeholder="Enter 10 digit phone number"
                          maxLength={10}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm font-medium">{formData.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Address</p>
                    {isEditing ? (
                      <div>
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`mt-1 ${errors.address ? 'border-red-500' : ''}`}
                          placeholder="Enter address (min 5 characters)"
                        />
                        {errors.address && (
                          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm font-medium">{formData.address || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-muted-foreground">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-sm font-medium">
                      {new Date(profile?.createdAt ?? '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickLinkCard
            icon={<Home className="w-5 h-5 text-red-500" />}
            title="My Projects"
            description="View and manage your ongoing and completed projects"
            link="/dashboard/projects"
          />
          <QuickLinkCard
            icon={<Shield className="w-5 h-5 text-red-500" />}
            title="Warranty Claims"
            description="Track and submit warranty claims for your projects"
            link="/dashboard/warranty"
          />
          <QuickLinkCard
            icon={<CreditCard className="w-5 h-5 text-red-500" />}
            title="Payments"
            description="View payment history and manage EMI details"
            link="/dashboard/payment"
          />
          <QuickLinkCard
            icon={<Send className="w-5 h-5 text-red-500" />}
            title="Refer & Earn"
            description="Refer a friend and earn rewards"
            link="/dashboard/refer&earn"
          />
        </div>

      </div>
    </div>
  );
};

export default Profile;