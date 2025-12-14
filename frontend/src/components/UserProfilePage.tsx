import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
interface UserProfilePageProps {
  userId: string | null;
}

interface Profile {
  id: string;
  name: string;
  avatarUrl?: string | null;
  email: string;
  bio?: string;
}

interface Ad {
  id: string;
  type: string;
  subject: string;
  areas: string[];
  level: string;
  pricePerHour?: number;
  location: string;
  city?: string;
  description: string;
  availableTimes?: string[];
  userId: string;
  createdAt: string;
}

export const UserProfilePage = ({ userId }: UserProfilePageProps) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        const profileResponse = await fetch(
          `http://localhost:4000/api/profiles/${userId}`
        );
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile");
        }
        const profileData = await profileResponse.json();
        setProfile(profileData);

        const adsResponse = await fetch(
          `http://localhost:4000/api/ads/user/${userId}`
        );
        if (!adsResponse.ok) {
          throw new Error("Failed to fetch user ads");
        }
        const adsData = await adsResponse.json();
        setAds(adsData);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-gray-900 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-red-900/20 border-red-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400">{error || "Profile not found"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6 overflow-auto no-scrollbar">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/profiles")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Profiles
        </button>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500/50 flex-shrink-0">
                {profile.avatarUrl ? (
                  <img
                    src={
                      profile.avatarUrl.startsWith("http")
                        ? profile.avatarUrl
                        : `http://localhost:4000${profile.avatarUrl}`
                    }
                    className="w-full h-full object-cover"
                    alt={profile.name}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-4xl font-semibold">
                      {getInitials(profile.name)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {profile.name}
                </h1>
                <p className="text-gray-400 mb-4">{profile.email}</p>
                {profile.bio && (
                  <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">
            Ads ({ads.length})
          </h2>
          <p className="text-gray-400">All active ads from this user</p>
        </div>

        {ads.length === 0 ? (
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <CardContent className="py-16">
              <div className="text-center">
                <p className="text-gray-400 text-lg">
                  This user currently has no active ads
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <Card
                key={ad.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500/50 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        ad.type === "tutor"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {ad.type === "tutor" ? "👨‍🏫 Tutor" : "🎓 Student"}
                    </span>
                    <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                      {ad.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {ad.subject}
                  </h3>
                  <p className="text-gray-400 mb-3 line-clamp-2">
                    {ad.description}
                  </p>
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-400 flex-wrap">
                    {ad.areas.slice(0, 3).map((area, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-800 rounded text-xs"
                      >
                        {area}
                      </span>
                    ))}
                    {ad.areas.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{ad.areas.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-gray-700 pt-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>
                        {ad.location === "online"
                          ? "💻 Online"
                          : ad.location === "in-person"
                          ? "🏫 In-Person"
                          : "🔄 Both"}
                      </span>
                    </div>
                    {ad.pricePerHour && (
                      <span className="text-green-400 font-semibold">
                        ${ad.pricePerHour}/h
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
