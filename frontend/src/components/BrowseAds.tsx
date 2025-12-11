import { useState, useEffect } from "react";
import { Search, MapPin, DollarSign, BookOpen, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { getAds, searchAds as searchAdsAPI, type Ad } from "../services/adApi";
import type { User } from "../App";

export interface BrowseAdsProps {
  user: User | null;
}

export function BrowseAds({ user }: BrowseAdsProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [typeFilter, setTypeFilter] = useState<"all" | "tutor" | "student">(
    "all"
  );
  const [subjectFilter, setSubjectFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    setError(null);
    setIsSearching(false);

    try {
      const filters: any = {};
      if (typeFilter !== "all") filters.type = typeFilter;
      if (subjectFilter) filters.subject = subjectFilter;
      if (levelFilter !== "all") filters.level = levelFilter;
      if (locationFilter !== "all") filters.location = locationFilter;

      const fetchedAds = await getAds(filters);
      setAds(fetchedAds);
    } catch (err: any) {
      console.error("Error fetching ads:", err);
      setError("Failed to load ads. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSearching) {
      fetchAds();
    }
  }, [typeFilter, subjectFilter, levelFilter, locationFilter]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      fetchAds();
      return;
    }
    setLoading(true);
    setError(null);
    setIsSearching(true);

    try {
      const results = await searchAdsAPI(searchQuery);
      setAds(results);
    } catch (err: any) {
      console.error("Error searching ads:", err);
      setError("Search failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    fetchAds();
  };
  const handleResetFilters = () => {
    setTypeFilter("all");
    setSubjectFilter("");
    setLevelFilter("all");
    setLocationFilter("all");
    setSearchQuery("");
    setIsSearching(false);
  };
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Browse Ads</h1>
          <p className="text-gray-400">
            Find the perfect tutor or student for your needs
          </p>
        </div>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Global Search
            </CardTitle>
            <CardDescription>
              Search across subjects, areas, descriptions, tutors, and locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search for anything... (e.g., 'Math', 'Calculus', 'John', 'Zagreb')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {isSearching && (
              <div className="mt-3 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-500/20 text-blue-400 border-blue-500/50"
                >
                  🔍 Search active: "{searchQuery}"
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                  Clear search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {!isSearching && (
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>
                Narrow down your search with filters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={typeFilter}
                    onValueChange={(v: any) => setTypeFilter(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="tutor">Tutors</SelectItem>
                      <SelectItem value="student">Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="e.g., Mathematics"
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Level</label>
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      <SelectItem value="Elementary">Elementary</SelectItem>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="College">College</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Select
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All locations</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="in-person">In-person</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  size="sm"
                >
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">
              {isSearching ? "Searching..." : "Loading ads..."}
            </p>
          </div>
        )}

        {error && (
          <Card className="bg-red-500/10 border-red-500/50">
            <CardContent className="pt-6">
              <p className="text-red-400 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <>
            <div className="mb-4 text-gray-400">
              Found {ads.length} {ads.length === 1 ? "ad" : "ads"}
              {isSearching && ` for "${searchQuery}"`}
            </div>

            {ads.length === 0 && (
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardContent className="pt-6 text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-semibold mb-2">No ads found</h3>
                  <p className="text-gray-400">
                    {isSearching
                      ? `No results for "${searchQuery}". Try different keywords.`
                      : "Try adjusting your filters or check back later"}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <Card
                  key={ad.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2 flex-wrap">
                        <Badge
                          variant={
                            ad.type === "tutor" ? "default" : "secondary"
                          }
                        >
                          {ad.type === "tutor" ? "👨‍🏫 Tutor" : "🎓 Student"}
                        </Badge>
                        {user && user.id === ad.user.id && (
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
                          <span className="font-semibold">
                            {ad.pricePerHour}/hr
                          </span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl">{ad.subject}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="font-medium text-gray-300">
                          {ad.user.name}
                        </span>
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
                      {ad.areas.slice(0, 3).map((area) => (
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
                        {ad.location === "in-person" &&
                          (ad.city || "In-person")}
                        {ad.location === "both" && "Online & In-person"}
                      </span>
                    </div>

                    <Button className="w-full" variant="outline" size="sm">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
