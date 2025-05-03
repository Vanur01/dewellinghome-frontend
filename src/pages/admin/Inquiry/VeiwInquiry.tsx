import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { inquiryApi } from "../../../utils/api";
import { CustomerInquiry } from "../../../store/admin/adminInquiry.store";
import { useInquiryStore } from "../../../store/admin/adminInquiry.store";

type InquiryStatus = "new" | "contacted" | "converted" | "closed";

const ViewInquiry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateInquiryStatus } = useInquiryStore();
  const [inquiry, setInquiry] = useState<CustomerInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        setLoading(true);
        const response = await inquiryApi.getInquiryById(id!);
        setInquiry(response.data.data.inquiry);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch inquiry");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [id]);

  const handleStatusUpdate = async (status: InquiryStatus) => {
    if (!inquiry) return;
    try {
      await updateInquiryStatus(inquiry._id, status);
      setInquiry({ ...inquiry, status });
    } catch (err) {
      // Error handling is done in the store
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error || "Inquiry not found"}</div>
        <Button onClick={() => navigate("/admin/inquiries")}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/inquiries")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Inquiry Details</h1>
        </div>
        <Select
          value={inquiry.status}
          onValueChange={(value) => handleStatusUpdate(value as InquiryStatus)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="font-medium">{inquiry.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium">{inquiry.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                <div className="font-medium">{`${inquiry.countryCode} ${inquiry.phone}`}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-medium">
                  {new Date(inquiry.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Address</div>
              <div className="font-medium">{inquiry.address || "-"}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Home Type</div>
                <div className="font-medium">{inquiry.homeType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Purpose</div>
                <div className="font-medium">{inquiry.purpose}</div>
              </div>
            </div>
            {inquiry.message && (
              <div>
                <div className="text-sm text-gray-500">Message</div>
                <div className="font-medium whitespace-pre-line">
                  {inquiry.message}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Items */}
        {inquiry.items && inquiry.items.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Requested Items</h2>
            <div className="space-y-4">
              {inquiry.items.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="font-medium">{item.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Category</div>
                      <div className="font-medium">{item.category}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Units</div>
                      <div className="font-medium">{item.units}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Size</div>
                      <div className="font-medium">{item.size}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Kitchen Configuration */}
        {inquiry.kitchenConfiguration && (
          <Card className="p-6 col-span-2">
            <h2 className="text-xl font-semibold mb-4">Kitchen Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Kitchen Layout</div>
                  <div className="font-medium">
                    {inquiry.kitchenConfiguration.kitchenLayout}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Cabinet Material</div>
                  <div className="font-medium">
                    {inquiry.kitchenConfiguration.cabinetMaterial}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Shutter Material</div>
                  <div className="font-medium">
                    {inquiry.kitchenConfiguration.shutterMaterial}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Wall Dimensions</div>
                  <div className="space-y-4 mt-2">
                    {/* Wall A */}
                    <div>
                      <div className="text-sm font-medium">Wall A</div>
                      <div className="grid grid-cols-2 gap-4 mt-1">
                        <div>
                          <div className="text-sm text-gray-500">Length</div>
                          <div className="font-medium">
                            {`${inquiry.kitchenConfiguration.wallDimensions.wallA.length.feet}'${inquiry.kitchenConfiguration.wallDimensions.wallA.length.inches}"`}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Height</div>
                          <div className="font-medium">
                            {`${inquiry.kitchenConfiguration.wallDimensions.wallA.height.feet}'${inquiry.kitchenConfiguration.wallDimensions.wallA.height.inches}"`}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wall B */}
                    {inquiry.kitchenConfiguration.wallDimensions.wallB && (
                      <div>
                        <div className="text-sm font-medium">Wall B</div>
                        <div className="grid grid-cols-2 gap-4 mt-1">
                          <div>
                            <div className="text-sm text-gray-500">Length</div>
                            <div className="font-medium">
                              {`${inquiry.kitchenConfiguration.wallDimensions.wallB.length.feet}'${inquiry.kitchenConfiguration.wallDimensions.wallB.length.inches}"`}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Height</div>
                            <div className="font-medium">
                              {`${inquiry.kitchenConfiguration.wallDimensions.wallB.height.feet}'${inquiry.kitchenConfiguration.wallDimensions.wallB.height.inches}"`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Wall C */}
                    {inquiry.kitchenConfiguration.wallDimensions.wallC && (
                      <div>
                        <div className="text-sm font-medium">Wall C</div>
                        <div className="grid grid-cols-2 gap-4 mt-1">
                          <div>
                            <div className="text-sm text-gray-500">Length</div>
                            <div className="font-medium">
                              {`${inquiry.kitchenConfiguration.wallDimensions.wallC.length.feet}'${inquiry.kitchenConfiguration.wallDimensions.wallC.length.inches}"`}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Height</div>
                            <div className="font-medium">
                              {`${inquiry.kitchenConfiguration.wallDimensions.wallC.height.feet}'${inquiry.kitchenConfiguration.wallDimensions.wallC.height.inches}"`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {inquiry.kitchenConfiguration.accessories &&
                  Object.entries(inquiry.kitchenConfiguration.accessories).length >
                    0 && (
                    <div>
                      <div className="text-sm text-gray-500">Accessories</div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {Object.entries(
                          inquiry.kitchenConfiguration.accessories
                        ).map(([key, value]) => (
                          <div key={key}>
                            <div className="text-sm text-gray-500">{key}</div>
                            <div className="font-medium">{String(value)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ViewInquiry;
