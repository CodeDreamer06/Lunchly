"use client";

import { useToast } from "./ToastProvider";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  text: string;
  subject?: string;
}

export default function ShareModal({ isOpen, onClose, title = "Share", text, subject = "Lunchly Report" }: ShareModalProps) {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: subject, text });
        showToast("Shared successfully!");
      } else {
        handleCopy();
      }
    } catch {
      // User cancelled
    }
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    } catch {
      showToast("Could not copy", "error");
    }
    onClose();
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    showToast("Opening WhatsApp...");
    onClose();
  };

  const handleEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    showToast("Opening email...");
    onClose();
  };

  const handlePrint = () => {
    window.print();
    showToast("Print dialog opened");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-headline font-bold">{title}</h3>
          <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant hover:text-error">
            close
          </button>
        </div>

        <div className="space-y-3">
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-4 bg-primary text-white rounded-3xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
            >
              <span className="material-symbols-outlined">share</span>
              Share
            </button>
          )}

          <button
            onClick={handleWhatsApp}
            className="w-full py-4 bg-[#25D366] text-white rounded-3xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
          >
            <span className="material-symbols-outlined">chat</span>
            WhatsApp
          </button>

          <button
            onClick={handleEmail}
            className="w-full py-4 bg-tertiary text-on-tertiary rounded-3xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
          >
            <span className="material-symbols-outlined">mail</span>
            Email
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-4 bg-surface-container-high text-on-surface rounded-3xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
          >
            <span className="material-symbols-outlined">content_copy</span>
            Copy Text
          </button>

          <button
            onClick={handlePrint}
            className="w-full py-4 bg-surface-container-high text-on-surface rounded-3xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
          >
            <span className="material-symbols-outlined">print</span>
            Print / PDF
          </button>
        </div>
      </div>
    </div>
  );
}
