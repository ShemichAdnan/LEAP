import { useLocation, useNavigate } from "react-router-dom";
import { FloatingMenu } from "./FloatingMenu";
import { FloatingCreateAd } from "./FloatingCreateAd";
import { BrowseAds } from "./BrowseAds";
import { MyProfile } from "./MyProfile";
import { MyBookings } from "./MyBookings";
import { Messages } from "./Messages";
import { AIAssistant } from "./AIAssistant";
import { Communities } from "./Communities";
import { AllProfilesPage } from "./AllProfilesPage";
import type { User } from "../App";
import { UserProfilePage } from "./UserProfilePage";
import { useState } from "react";
import { AdPage } from "./AdPage";

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

export type Page =
  | "browse"
  | "profiles"
  | "profile"
  | "user-profile"
  | "adpage"
  | "bookings"
  | "messages"
  | "ai"
  | "communities";

export function Dashboard({ user, onLogout, onUserUpdate }: DashboardProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [browseAdsKey, setBrowseAdsKey] = useState(0);

  const getCurrentPage = (): Page => {
    const path = location.pathname;
    if (path === "/profile") return "profile";
    if (path.startsWith("/profiles/")) return "user-profile";
    if (path === "/profiles") return "profiles";
    if (path === "/bookings") return "bookings";
    if (path.startsWith("/ads/")) return "adpage";
    if (path === "/messages") return "messages";
    if (path === "/ai") return "ai";
    if (path === "/communities") return "communities";
    return "browse";
  };

  const getUserIdFromPath = (): string | null => {
    const path = location.pathname;
    if (path.startsWith("/profiles/")) {
      return path.replace("/profiles/", "");
    }
    if (path.startsWith("/ads/")) {
      return path.replace("/ads/", "");
    }
    return null;
  };

  const handleNavigate = (page: Page) => {
    const routes: Record<Page, string> = {
      browse: "/browse-ads",
      profiles: "/profiles",
      profile: "/profile",
      "user-profile": "/user-profile/",
      adpage: "/ads/",
      bookings: "/bookings",
      messages: "/messages",
      ai: "/ai",
      communities: "/communities",
    };
    navigate(routes[page]);
  };
  const handleAdCreated = () => {
    setBrowseAdsKey((prev) => prev + 1);
  };

  const currentPage = getCurrentPage();

  const renderPage = () => {
    switch (currentPage) {
      case "profile":
        return <MyProfile user={user} onUserUpdate={onUserUpdate} />;
      case "profiles":
        return <AllProfilesPage user={user} />;
      case "user-profile":
        const userId = getUserIdFromPath();
        return <UserProfilePage userId={userId} />;
      case 'adpage':
        return <AdPage adId={getUserIdFromPath()} user={user} />;
      case "bookings":
        return <MyBookings user={user} />;
      case "messages":
        return <Messages user={user} />;
      case "ai":
        return <AIAssistant user={user} />;
      case "communities":
        return <Communities user={user} />;
      case "browse":
      default:
        return <BrowseAds key={browseAdsKey} user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <main className="flex-1">
        {renderPage()}
        <FloatingMenu
          user={user}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={onLogout}
        />
        {currentPage === "browse" && (
          <FloatingCreateAd onAdCreated={handleAdCreated} />
        )}
      </main>
    </div>
  );
}
