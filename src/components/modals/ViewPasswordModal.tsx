import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { userApi } from "@/api/user.api";
import { toast } from "sonner";

interface ViewPasswordModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const ViewPasswordModal = ({
  open,
  onClose,
  userId,
  userName,
}: ViewPasswordModalProps) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleViewPassword = async () => {
    try {
      setLoading(true);
      const response = await userApi.viewUserPassword(userId);
      console.log("📝 Password Response:", response.data); // Debug log

      // Backend response structure: { success: true, data: { viewPassword: "..." }, message: "..." }
      const fetchedPassword =
        response.data.data?.viewPassword ||
        response.data.data ||
        response.data.password;

      setPassword(fetchedPassword);
      console.log("🔐 Password Set:", fetchedPassword); // Debug log
      toast.success("Password retrieved successfully");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to retrieve password";
      console.error("❌ Password Error:", error); // Debug log
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Password copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setPassword("");
    setShowPassword(false);
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>View User Password</DialogTitle>
          <DialogDescription>
            View the password for user: <strong>{userName}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!password ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Click the button below to retrieve the user's password.
              </p>
              <Button
                onClick={handleViewPassword}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Loading..." : "View Password"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Password
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      readOnly
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopyPassword}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> Keep this password secure and do not
                  share it with unauthorized individuals.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPasswordModal;
