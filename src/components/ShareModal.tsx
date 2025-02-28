
import React from "react";
import { Copy, Mail, Facebook, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  poemText: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, poemText }) => {
  const { toast } = useToast();
  const mobile = useIsMobile();

  if (!isOpen) return null;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(poemText);
    toast({
      title: "Poem copied!",
      description: "The poem has been copied to your clipboard.",
    });
    onClose();
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("A Beautiful Poem for You");
    const body = encodeURIComponent(poemText);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    onClose();
  };

  const handleMessengerShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/dialog/send?app_id=936619743392459&link=${url}&redirect_uri=${url}`);
    onClose();
  };

  const handleSMSShare = () => {
    if (mobile) {
      const body = encodeURIComponent(poemText);
      window.open(`sms:?body=${body}`);
      onClose();
    }
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div className="bg-[#1A2040] border border-white/10 rounded-lg p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-xl font-semibold mb-4 gradient-text">Share this poem</h3>
        
        <div className="space-y-3">
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center w-full rounded-md hover:bg-white/5 transition-colors p-3"
          >
            <Copy size={20} className="mr-3 text-primary" />
            <span>Copy to clipboard</span>
          </button>
          
          <button
            onClick={handleEmailShare}
            className="flex items-center w-full rounded-md hover:bg-white/5 transition-colors p-3"
          >
            <Mail size={20} className="mr-3 text-primary" />
            <span>Share via Email</span>
          </button>
          
          <button
            onClick={handleMessengerShare}
            className="flex items-center w-full rounded-md hover:bg-white/5 transition-colors p-3"
          >
            <Facebook size={20} className="mr-3 text-primary" />
            <span>Share on Messenger</span>
          </button>
          
          {mobile && (
            <button
              onClick={handleSMSShare}
              className="flex items-center w-full rounded-md hover:bg-white/5 transition-colors p-3"
            >
              <MessageSquare size={20} className="mr-3 text-primary" />
              <span>Send via SMS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
