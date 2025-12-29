import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Loader2, AlertCircle, MapPin, Calendar, Briefcase, Mail } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { AdCard } from "./AdCard"
import { getAds } from "../services/adApi"

import type { User, Ad } from "../App"
import { getProfileById } from "../services/profileServices"

export const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<User | null>(null)
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!userId) return
    try {
      setLoading(true)
      setError(null)

      const profileResponse = await getProfileById(userId)
      setProfile(profileResponse)

      const adsResponse = await getAds({})
      const filteredAds = adsResponse.filter((ad) => ad.userId === userId)

      setAds(filteredAds)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [userId])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
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
    )
  }

  return (
    <div className="bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/profiles")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Profiles
        </button>

        <Card className="relative bg-gray-800/80 border-gray-700 mb-8 overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />

          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Left: Avatar section */}
              <div className="flex flex-col items-center ">
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-gradient-to-br from-teal-500/40 to-emerald-500/40 rounded-full blur-sm" />
                  <div className="relative w-36 h-36 rounded-full overflow-hidden ring-2 ring-gray-700">
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
                      <div className="w-full h-full bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center">
                        <span className="text-white text-4xl font-semibold">{getInitials(profile.name)}</span>
                      </div>
                    )}
                  </div>
                </div>

                
              </div>

              {/* Right: User info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl font-bold text-white mb-1">{profile.name}</h1>

                {/* Info badges row */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-3 mb-5">
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <Mail className="w-4 h-4 text-teal-500" />
                    <span>{profile.email}</span>
                  </div>

                  {profile.city && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 text-teal-500" />
                      <span>{profile.city}</span>
                    </div>
                  )}

                  {profile.experience && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Briefcase className="w-4 h-4 text-teal-500" />
                      <span>{profile.experience} years experience</span>
                    </div>
                  )}

                  {profile.createdAt && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 text-teal-500" />
                      <span>Member since {formatDate(profile.createdAt)}</span>
                    </div>
                  )}
                </div>

                {/* Bio section */}
                {profile.bio ? (
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">About</p>
                    <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
                  </div>
                ) : (
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                    <p className="text-gray-500 italic">This user hasn't added a bio yet.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Ads
              <span className="ml-2 text-lg text-teal-500">({ads.length})</span>
            </h2>
            <p className="text-gray-400 text-sm">All active ads from this user</p>
          </div>
        </div>

        {ads.length === 0 ? (
          <Card className="bg-gray-800/80 border-gray-700">
            <CardContent className="py-16">
              <div className="text-center">
                <p className="text-gray-400 text-lg">This user currently has no active ads</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} onAdUpdated={fetchData} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
