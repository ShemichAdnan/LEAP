import { useState } from "react";
import { FloatingMenu } from "./FloatingMenu";
import { FloatingCreateAd } from "./FloatingCreateAd";
import { BrowseAds } from "./BrowseAds";
import { MyProfile } from "./MyProfile";
import { MyBookings } from "./MyBookings";
import { Messages } from "./Messages";
import { AIAssistant } from "./AIAssistant";
import { Communities } from "./Communities";
import type { User } from "../App";

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

export type Page =
  | "browse"
  | "profile"
  | "bookings"
  | "messages"
  | "ai"
  | "communities";

export function Dashboard({ user, onLogout, onUserUpdate }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<Page>("browse");

  const renderPage = () => {
    switch (currentPage) {
      case "browse":
        return <BrowseAds user={user} />;
      case "profile":
        return <MyProfile user={user} onUserUpdate={onUserUpdate} />;
      case "bookings":
        return <MyBookings user={user} />;
      case "messages":
        return <Messages user={user} />;
      case "ai":
        return <AIAssistant user={user} />;
      case "communities":
        return <Communities user={user} />;
      default:
        return <BrowseAds user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <main className="flex-1">
        {renderPage()}
        <FloatingMenu
          user={user}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={onLogout}
        />
        <FloatingCreateAd user={user} />
      </main>
    </div>
  );
}
