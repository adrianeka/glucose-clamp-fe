import { AlertTriangle } from "lucide-react";

const ConfirmationWarning = () => (
  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 mb-6">
    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
    <p className="text-amber-700 text-xs font-medium leading-relaxed">
      After confirmation, the submitted data cannot be modified.
    </p>
  </div>
);

export default ConfirmationWarning;