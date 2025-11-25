export const getStatusBadgeStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-50 text-green-700 border-green-200";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getPaymentBadgeStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "pending":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "partial":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};
