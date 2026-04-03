"use client";

interface LoadingOverlayProps {
  message?: string;
  isVisible: boolean;
}

export default function LoadingOverlay({ message = "Loading...", isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-xl flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-on-surface font-medium">{message}</p>
      </div>
    </div>
  );
}
