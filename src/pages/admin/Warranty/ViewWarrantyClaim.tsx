import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { WarrantyClaim } from "../../../store/admin/adminWarranty.store";

interface ViewWarrantyClaimProps {
  claim: WarrantyClaim | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewWarrantyClaim = ({
  claim,
  isOpen,
  onOpenChange,
}: ViewWarrantyClaimProps) => {
  const getStatusBadgeVariant = (
    status: WarrantyClaim["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "pending":
        return "secondary";
      case "in-review":
        return "secondary";
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "resolved":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Warranty Claim Details</DialogTitle>
        </DialogHeader>
        {!claim ? (
          <div className="py-8 text-center text-muted-foreground">
            No claim data available
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Ticket and Status */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Ticket ID</h3>
                <p className="text-sm text-muted-foreground">
                  {claim.ticketId}
                </p>
              </div>
              <Badge variant={getStatusBadgeVariant(claim.status)}>
                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
              </Badge>
            </div>

            {/* Customer Details */}
            <div className="grid gap-2">
              <h3 className="font-semibold">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p>{claim.user?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{claim.user?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{claim.user?.phone || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Project and Item Details */}
            <div className="grid gap-2">
              <h3 className="font-semibold">Claim Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Project</p>
                  <p>{claim.project}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Item</p>
                  <p>{claim.item}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <h3 className="font-semibold">Description</h3>
              <p className="text-sm">{claim.description}</p>
            </div>

            {/* Images */}
            {claim.images && claim.images.length > 0 && (
              <div className="grid gap-2">
                <h3 className="font-semibold">Attached Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {claim.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video w-full overflow-hidden rounded-lg"
                    >
                      <img
                        src={image}
                        alt={`Warranty claim image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {claim.adminNotes && (
              <div className="grid gap-2">
                <h3 className="font-semibold">Admin Notes</h3>
                <p className="text-sm">{claim.adminNotes}</p>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p>Created: {new Date(claim.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p>Updated: {new Date(claim.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewWarrantyClaim;
