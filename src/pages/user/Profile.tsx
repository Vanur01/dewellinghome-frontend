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
  Clock,
  ChevronRight,
  Upload,
  Pencil,
  X,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { profile, isLoading, fetchProfile, updateProfile, isUpdating, updateError, clearError } = useProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(!profile){ 
      fetchProfile();
    }
  }, [fetchProfile, profile]);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateProfile({
        ...formData,
        image: selectedImage || undefined,
      });
      setIsEditing(false);
      setPreviewImage(null);
      setSelectedImage(null);
      toast.success("Profile updated successfully");
    } catch {
      toast.error(updateError || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: profile.name || '',
      phone: profile.phone || '',
      address: profile.address || '',
    });
    setPreviewImage(null);
    setSelectedImage(null);
    clearError();
  };

  const InfoItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    name?: string;
    editable?: boolean;
  }> = ({ icon, label, value, name, editable }) => (
    <div className="flex items-center space-x-4 mb-4">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        {isEditing && editable ? (
          <Input
            name={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleInputChange}
            className="mt-1"
          />
        ) : (
          <p className="text-sm font-medium">{value}</p>
        )}
      </div>
    </div>
  );

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
                className={`w-32 h-32 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center relative overflow-hidden ${isEditing ? 'cursor-pointer hover:opacity-90' : ''}`}
                onClick={handleImageClick}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-white">
                    {profile.name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
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
                  profile.name || 'No Name Set'
                )}
              </h1>
              <p className="text-muted-foreground">
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </p>
            </div>
          </CardHeader>

          <Separator className="my-4" />

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <InfoItem
                  icon={<Mail className="w-5 h-5" />}
                  label="Email"
                  value={profile.email}
                />
                <InfoItem
                  icon={<Phone className="w-5 h-5" />}
                  label="Phone"
                  value={formData.phone || 'Not provided'}
                  name="phone"
                  editable
                />
              </div>
              <div>
                <InfoItem
                  icon={<MapPin className="w-5 h-5" />}
                  label="Address"
                  value={formData.address || 'Not provided'}
                  name="address"
                  editable
                />
                <InfoItem
                  icon={<Calendar className="w-5 h-5" />}
                  label="Member Since"
                  value={new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                />
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

        {/* Project Timeline */}
        {/* <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Project Updates</h2>
              <Link to="/dashboard/projects" className="text-sm text-red-500 hover:text-red-600 hover:underline">
                View All Projects
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <Clock className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="font-medium">Kitchen Renovation</p>
                  <p className="text-sm text-muted-foreground">Design phase completed</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <Clock className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="font-medium">Living Room Makeover</p>
                  <p className="text-sm text-muted-foreground">Material selection pending</p>
                  <p className="text-xs text-muted-foreground">5 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default Profile;
