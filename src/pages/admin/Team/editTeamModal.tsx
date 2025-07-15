import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';

interface SocialForm {
  linkedin: string;
  twitter: string;
  instagram: string;
}

interface LeadershipForm {
  name: string;
  position: string;
  image: string;
  bio: string;
  social: SocialForm;
}

interface EmployeeForm {
  name: string;
  position: string;
  image: string;
}

type TeamMemberForm = LeadershipForm | EmployeeForm;

interface EditTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: TeamMemberForm, image: File | null) => void;
  loading?: boolean;
  initialValues?: TeamMemberForm;
  isLeadership?: boolean;
}

export const EditTeamModal: React.FC<EditTeamModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  loading,
  initialValues,
  isLeadership = false,
}) => {
  const defaultForm: TeamMemberForm = isLeadership
    ? { name: '', position: '', image: '', bio: '', social: { linkedin: '', twitter: '', instagram: '' } }
    : { name: '', position: '', image: '' };
  const [form, setForm] = React.useState<TeamMemberForm>(initialValues || defaultForm);
  const [image, setImage] = React.useState<File | null>(null);

  React.useEffect(() => {
    setForm(initialValues || defaultForm);
    setImage(null);
    // eslint-disable-next-line
  }, [initialValues, open, isLeadership]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLeadership ? 'Edit Leadership' : 'Edit Employee'}</DialogTitle>
        </DialogHeader>
        <Input
          className="mb-2"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <Input
          className="mb-2"
          placeholder="Position"
          value={form.position}
          onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
        />
        {isLeadership && 'bio' in form && 'social' in form && (
          <>
            <Textarea
              className="mb-2"
              placeholder="Bio"
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            />
            <Input
              className="mb-2"
              placeholder="LinkedIn"
              value={('social' in form ? form.social.linkedin : '')}
              onChange={e => setForm(f => 'social' in f ? { ...f, social: { ...f.social, linkedin: e.target.value } } : f)}
            />
            <Input
              className="mb-2"
              placeholder="Twitter"
              value={('social' in form ? form.social.twitter : '')}
              onChange={e => setForm(f => 'social' in f ? { ...f, social: { ...f.social, twitter: e.target.value } } : f)}
            />
            <Input
              className="mb-2"
              placeholder="Instagram"
              value={('social' in form ? form.social.instagram : '')}
              onChange={e => setForm(f => 'social' in f ? { ...f, social: { ...f.social, instagram: e.target.value } } : f)}
            />
          </>
        )}
        <Input
          type="file"
          className="mb-2"
          accept="image/*"
          onChange={e => setImage(e.target.files?.[0] || null)}
        />
        <div className="flex gap-2 mt-2">
          <Button
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            onClick={() => onSubmit(form, image)}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
