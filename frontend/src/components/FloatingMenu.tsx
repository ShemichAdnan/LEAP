import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  Menu,
  LogOut,
  Search,
  Calendar,
  MessageSquare,
  Sparkles,
  Users,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { useAuth } from "../contexts/AuthContext";

const menuItems = [
  { path: "/browse", label: "Browse Ads", icon: Search },
  { path: "/profiles", label: "All Profiles", icon: Users },
  { path: "/bookings", label: "My Bookings", icon: Calendar },
  { path: "/messages", label: "Messages", icon: MessageSquare },
  { path: "/ai", label: "AI Assistant", icon: Sparkles },
  { path: "/communities", label: "Communities", icon: Users },
  { path: "/profile", label: "My Profile", icon: User },
];

export function FloatingMenu() {
  const { currentUser: user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="icon"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-gray-800 text-white border-gray-700 w-64 p-0 flex flex-col overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl text-white">LearnConnect</span>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "bg-blue-900/30 text-blue-400"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <Separator className="bg-gray-700" />

          <div className="p-4 space-y-3">
            {user && (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    className="object-contain"
                    src={
                      user.avatarUrl
                        ? `http://localhost:4000${user.avatarUrl}`
                        : undefined
                    }
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-white">{user.name}</div>
                </div>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-700 text-gray-300 cursor-pointer hover:bg-gray-700"
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate("/login");
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
