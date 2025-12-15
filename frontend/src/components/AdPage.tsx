import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdById, getAds } from "../services/adApi";
import type { User } from "../App";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  MapPin,
  Mail,
  DollarSign,
  ArrowLeft,
  User as UserIcon,
} from "lucide-react";

interface AdPageProps {
  adId: string | null;
  user: User;
}

export const AdPage = ({ adId, user }: AdPageProps) => {
  const [ad, setAd] = useState<any>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAd = async () => {
      if (!adId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getAdById(adId);
        setAd(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch ad");
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [adId]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const fetchAds = async () => {
      if (!adId) return;
      try {
        const adsData = await getAds({});
        const filteredAds = adsData.filter((a) => a.id !== adId);
        setAds(filteredAds);
      } catch (err: any) {
        console.error("Failed to fetch other ads:", err);
      }
    };
    fetchAds();
  }, [adId]);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400">Loading ad...</p>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="bg-gray-900 min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/browse-ads")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
          <Card className="bg-red-500/10 border-red-500/50">
            <CardContent className="pt-6 text-center py-12">
              <p className="text-red-400">{error || "Ad not found"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900  p-6 ">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/browse-ads")}
          className="mb-6 hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Badge
                  variant={ad.type === "tutor" ? "default" : "secondary"}
                  className="px-3 py-1"
                >
                  {ad.type === "tutor" ? "👨‍🏫 Tutor" : "🎓 Student"}
                </Badge>
                {user && user.id === ad.userId && (
                  <Badge
                    variant="outline"
                    className="bg-green-500/20 text-green-400 border-green-500/50 px-3 py-1"
                  >
                    ✨ Your Ad
                  </Badge>
                )}
              </div>
              {ad.pricePerHour && (
                <div className="flex items-center gap-1 text-green-400">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-bold text-lg">
                    {ad.pricePerHour}/hr
                  </span>
                </div>
              )}
            </div>

            <CardTitle className="text-3xl mb-2">{ad.subject}</CardTitle>
            <div className="flex items-center gap-4 text-gray-300">
              <div className="flex items-center gap-1.5">
                <span>📚</span>
                <span className="font-medium">{ad.level}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>
                  {ad.location === "online" && "Online"}
                  {ad.location === "in-person" && (ad.city || "In-person")}
                  {ad.location === "both" &&
                    `Online & In-person${ad.city ? ` (${ad.city})` : ""}`}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {ad.areas && ad.areas.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                  Areas of Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ad.areas.map((area: string) => (
                    <Badge key={area} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                Description
              </h3>
              <p className="text-gray-300 leading-relaxed">{ad.description}</p>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                Posted by
              </h3>
              <div className="flex items-center gap-4 mb-4">
                {ad.user.avatarUrl ? (
                  <img
                    src={
                      ad.user.avatarUrl.startsWith("http")
                        ? ad.user.avatarUrl
                        : `http://localhost:4000${ad.user.avatarUrl}`
                    }
                    alt={ad.user.name}
                    className="w-16 h-16 rounded-full border-2 border-gray-700 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-700">
                    <span className="text-2xl font-bold text-white">
                      {getInitials(ad.user.name)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-xl font-bold text-white">{ad.user.name}</p>
                  {ad.user.experience && (
                    <p className="text-gray-400">
                      {ad.user.experience} years of experience
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{ad.user.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 max-w-md">
                <Button
                  onClick={() => navigate(`/profiles/${ad.userId}`)}
                  variant="outline"
                  className=" hover:bg-gray-800"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
                {user && user.id !== ad.userId && (
                    <Button className="bg-blue-600 hover:bg-blue-700">
                    Contact
                    </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {ads.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Other Available Ads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((otherAd) => (
                <Card
                  key={otherAd.id}
                  onClick={() => navigate(`/ads/${otherAd.id}`)}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2 flex-wrap">
                        <Badge
                          variant={
                            otherAd.type === "tutor" ? "default" : "secondary"
                          }
                        >
                          {otherAd.type === "tutor" ? "👨‍🏫 Tutor" : "🎓 Student"}
                        </Badge>
                        {user && user.id === otherAd.userId && (
                          <Badge
                            variant="outline"
                            className="bg-green-500/20 text-green-400 border-green-500/50"
                          >
                            ✨ Your Ad
                          </Badge>
                        )}
                      </div>
                      {otherAd.pricePerHour && (
                        <div className="flex items-center gap-1 text-green-400">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">
                            {otherAd.pricePerHour}/hr
                          </span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl">{otherAd.subject}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="font-medium text-gray-300">
                          {otherAd.user.name}
                        </span>
                        {otherAd.user.experience && (
                          <span className="text-gray-500">
                            • {otherAd.user.experience}y exp
                          </span>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {otherAd.areas.slice(0, 3).map((area: string) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                      {otherAd.areas.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{otherAd.areas.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                      {otherAd.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>📚 {otherAd.level}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {otherAd.location === "online" && "Online"}
                        {otherAd.location === "in-person" &&
                          (otherAd.city || "In-person")}
                        {otherAd.location === "both" && "Online & In-person"}
                      </span>
                    </div>

                    <Button className="w-full" variant="outline" size="sm">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
