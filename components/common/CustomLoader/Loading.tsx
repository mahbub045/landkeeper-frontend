import { LoaderPinwheel } from 'lucide-react';

interface LoadingProps {
  size?: number;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 24, className = '' }) => {
  return (
    <LoaderPinwheel
      size={size}
      className={`text-primary animate-spin ${className}`}
    />
  );
};

export default Loading;
