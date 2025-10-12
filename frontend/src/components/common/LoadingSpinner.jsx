export default function LoadingSpinner({ size = 'md', color = 'purple' }) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  const colors = {
    purple: 'border-purple-600',
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    white: 'border-white',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-b-2 ${sizes[size]} ${colors[color]}`}
      ></div>
    </div>
  );
}
