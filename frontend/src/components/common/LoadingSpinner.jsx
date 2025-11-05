export default function LoadingSpinner({ size = "md", color = "blush" }) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  const colors = {
    blush: "border-blush-600",
    raspberry_rose: "border-raspberry_rose-600",
    salmon_pink: "border-salmon_pink-600",
    light_orange: "border-light_orange-600",
    chocolate_cosmos: "border-chocolate_cosmos-600",
    white: "border-white",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-b-2 ${sizes[size]} ${colors[color] || colors.blush}`}
      ></div>
    </div>
  );
}
