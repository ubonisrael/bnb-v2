// Generate random colors for programs without banner images
export function getRandomColor(id: string) {
  const colors = [
    "bg-gradient-to-r from-purple-500 to-pink-500",
    "bg-gradient-to-r from-blue-500 to-cyan-500",
    "bg-gradient-to-r from-green-500 to-teal-500",
    "bg-gradient-to-r from-orange-500 to-red-500",
    "bg-gradient-to-r from-indigo-500 to-purple-500",
    "bg-gradient-to-r from-yellow-500 to-orange-500",
  ];
  const index = parseInt(id) % colors.length;
  return colors[index];
};