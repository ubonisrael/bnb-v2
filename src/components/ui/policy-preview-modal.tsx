import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface Policy {
  type: string;
  policy: string;
}

interface PolicyPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  policies: Policy[];
  title: string;
}

export function PolicyPreviewModal({
  isOpen,
  onClose,
  policies,
  title,
}: PolicyPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title} Policies Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {policies.map((policy, index) => (
            <div key={index} className="text-sm">
              <p className="text-[#6E6E73]">{policy.policy}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}