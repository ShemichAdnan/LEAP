import { useNavigate } from "react-router-dom";
import type { Ad } from "../App";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { DollarSign, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { FloatingCreateAd } from "./FloatingCreateAd";
import { deleteAd, getAdById } from "../services/adApi";

interface AdCardProps {
  ad: Ad;
  onAdUpdated?: () => void;
}
export const AdCard = ({ ad: initialAd, onAdUpdated }: AdCardProps) => {
  const navigate = useNavigate();
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const { currentUser: user } = useAuth();
  const [ad, setAd] = useState<Ad>(initialAd);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  

  useEffect(() => {
    setAd(initialAd);
  }, [initialAd]);

  const handleAdUpdated = async () => {
    try {
      const updatedAd = await getAdById(ad.id);
      setAd(updatedAd);
    } catch (error) {
      console.error("Failed to refetch ad:", error);
    }

    if (onAdUpdated) {
      onAdUpdated();
    }
  };

  const handleCancelPassword = () => {
    setShowDeleteConfirm(false);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    if(!currentPassword) {
      setError("Please enter your current password");
      return;
    }
    setDeleting(true);
    setError(null);
    try{
      await deleteAd(ad.id,currentPassword);
    }
    catch(err:any){
      setError(err.response?.data?.message || "Failed to delete ad");
      setDeleting(false);
      return;
    }
    setDeleting(false);
    setShowDeleteConfirm(false);
    setCurrentPassword("");
    if(onAdUpdated) {
      onAdUpdated();
    }
  };
    

  return (
    <>
      <Card
        key={ad.id}
        onClick={() => navigate(`/ads/${ad.id}`)}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer"
      >
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex gap-2 flex-wrap">
              <Badge variant={ad.type === "tutor" ? "default" : "secondary"}>
                {ad.type === "tutor" ? "👨‍🏫 Tutor" : "🎓 Student"}
              </Badge>
              {user && user.id === ad.userId && (
                <Badge
                  variant="outline"
                  className="bg-green-500/20 text-green-400 border-green-500/50"
                >
                  ✨ Your Ad
                </Badge>
              )}
            </div>
            {ad.pricePerHour && (
              <div className="flex items-center gap-1 text-green-400">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">{ad.pricePerHour}/hr</span>
              </div>
            )}
          </div>
          <CardTitle className="text-xl">{ad.subject}</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-1 mt-1">
              <span className="font-medium text-gray-300">{ad.user.name}</span>
              {ad.user.experience && (
                <span className="text-gray-500">
                  • {ad.user.experience}y exp
                </span>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {ad.areas.slice(0, 3).map((area: string) => (
              <Badge key={area} variant="outline" className="text-xs">
                {area}
              </Badge>
            ))}
            {ad.areas.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{ad.areas.length - 3} more
              </Badge>
            )}
          </div>

          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {ad.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span>📚 {ad.level}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {ad.location === "online" && "Online"}
              {ad.location === "in-person" && (ad.city || "In-person")}
              {ad.location === "both" && "Online & In-person"}
            </span>
          </div>

          {user && user.id !== ad.userId ? (
            <Button
              className="w-full cursor-pointer"
              variant="outline"
              size="sm"
            >
              View Details
            </Button>
          ) : (
            <div className="space-x-2 flex flex">
            <Button
              className="w-1/2 cursor-pointer"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditPanelOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              className="w-1/2 cursor-pointer"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {isEditPanelOpen && (
        <FloatingCreateAd
          mode="edit"
          adId={ad.id}
          onClose={() => setIsEditPanelOpen(false)}
          onAdCreated={handleAdUpdated}
        />
      )}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCancelPassword}
        >
          <Card
            className="border-blue-500/50 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="text-lg">Confirm Changes</CardTitle>
              <CardDescription>
                Enter your current password to save your profile changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 caret-white"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleConfirmDelete();
                    }
                  }}
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelPassword}
                  disabled={deleting}
                  className="border-gray-600 text-gray-200 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting || !currentPassword}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Confirm & Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
export default AdCard;
