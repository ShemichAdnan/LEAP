import { useState, useEffect } from "react";
import { Search, BookOpen, X, SlidersHorizontal } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { getAds, searchAds as searchAdsAPI } from "../services/adApi";
import type { Ad } from "../App";
import { AdCard } from "./AdCard";
import { FloatingCreateAd } from "./FloatingCreateAd";

export function BrowseAds() {
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
  const [cityFilter, setCityFilter] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchAdsWithSearchAndFilters = async () => {
    setLoading(true);
    setError(null);

    try {
      let fetchedAds: Ad[] = [];

      if (searchQuery.trim()) {
        fetchedAds = await searchAdsAPI(searchQuery);
        setIsSearching(true);
      } else {
        const filters: any = {};
        if (typeFilter !== "all") filters.type = typeFilter;
        if (subjectFilter) filters.subject = subjectFilter;
        if (levelFilter !== "all") filters.level = levelFilter;
        if (locationFilter !== "all") filters.location = locationFilter;
        if (cityFilter) filters.city = cityFilter;

        fetchedAds = await getAds(filters);
        setIsSearching(false);
      }

      let filteredAds = fetchedAds;

      if (typeFilter !== "all") {
        filteredAds = filteredAds.filter((ad) => ad.type === typeFilter);
      }
      if (subjectFilter) {
        filteredAds = filteredAds.filter((ad) =>
          ad.subject.toLowerCase().includes(subjectFilter.toLowerCase())
        );
      }
      if (levelFilter !== "all") {
        filteredAds = filteredAds.filter((ad) => ad.level === levelFilter);
      }
      if (locationFilter !== "all") {
        if (locationFilter === "online") {
          filteredAds = filteredAds.filter(
            (ad) => ad.location === "online" || ad.location === "both"
          );
        } else if (locationFilter === "in-person") {
          filteredAds = filteredAds.filter(
            (ad) => ad.location === "in-person" || ad.location === "both"
          );
        } else {
          filteredAds = filteredAds.filter((ad) => ad.location === "both");
        }
      }
      if (cityFilter) {
        filteredAds = filteredAds.filter(
          (ad) =>
            ad.city && ad.city.toLowerCase().includes(cityFilter.toLowerCase())
        );
      }

      setAds(filteredAds);
    } catch (err: any) {
      console.error("Error fetching ads:", err);
      setError("Failed to load ads. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdsWithSearchAndFilters();
    }, 500);
    return () => clearTimeout(timer);
  }, [
    typeFilter,
    subjectFilter,
    levelFilter,
    locationFilter,
    cityFilter,
    searchQuery,
  ]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  const handleResetFilters = () => {
    setTypeFilter("all");
    setSubjectFilter("");
    setLevelFilter("all");
    setLocationFilter("all");
    setCityFilter("");
    setSearchQuery("");
    setIsSearching(false);
    setIsFilterOpen(false);
  };

  const activeFiltersCount =
    (typeFilter !== "all" ? 1 : 0) +
    (subjectFilter ? 1 : 0) +
    (levelFilter !== "all" ? 1 : 0) +
    (locationFilter !== "all" ? 1 : 0) +
    (cityFilter ? 1 : 0);

  return (
    <div className="bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Browse Ads</h1>
          <p className="text-gray-400">
            Find the perfect tutor or student for your needs
          </p>
        </div>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search for anything... (e.g., 'Math', 'Calculus', 'John', 'Zagreb')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="relative cursor-pointer hover:bg-gray-800"
                  >
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="default"
                        className="ml-2 px-2 py-0.5 text-xs bg-blue-600"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-gray-900 text-white w-full max-w-md">
                  <SheetHeader>
                    <SheetTitle>Filter Ads</SheetTitle>
                    <SheetDescription>
                      Narrow down your search with filters
                    </SheetDescription>
                  </SheetHeader>

                  <div className=" space-y-6 p-4">
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
                      <Select
                        value={levelFilter}
                        onValueChange={setLevelFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All levels</SelectItem>
                          <SelectItem value="Elementary">Elementary</SelectItem>
                          <SelectItem value="High School">
                            High School
                          </SelectItem>
                          <SelectItem value="College">College</SelectItem>
                          <SelectItem value="Professional">
                            Professional
                          </SelectItem>
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

                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input
                        placeholder="e.g., Paris"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                      />
                    </div>

                    <div className="pt-4 space-y-2">
                      <Button
                        variant="outline"
                        onClick={handleResetFilters}
                        className="w-full cursor-pointer hover:bg-gray-800"
                      >
                        Reset All Filters
                      </Button>
                      <Button
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full mt-2 cursor-pointer bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {(isSearching || activeFiltersCount > 0) && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {isSearching && (
                  <>
                    <Badge
                      variant="outline"
                      className="bg-blue-500/20 text-blue-400 border-blue-500/50"
                    >
                      🔍 Search: "{searchQuery}"
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearSearch}
                    >
                      Clear search
                    </Button>
                  </>
                )}
                {activeFiltersCount > 0 && (
                  <span className="text-sm text-gray-400">
                    {isSearching ? "• Filters:" : "Active filters:"}
                  </span>
                )}
                {typeFilter !== "all" && (
                  <Badge variant="secondary">
                    Type: {typeFilter}
                    <button
                      onClick={() => setTypeFilter("all")}
                      className="ml-1 hover:text-white cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {subjectFilter && (
                  <Badge variant="secondary">
                    Subject: {subjectFilter}
                    <button
                      onClick={() => setSubjectFilter("")}
                      className="ml-1 hover:text-white cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {levelFilter !== "all" && (
                  <Badge variant="secondary">
                    Level: {levelFilter}
                    <button
                      onClick={() => setLevelFilter("all")}
                      className="ml-1 hover:text-white cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {locationFilter !== "all" && (
                  <Badge variant="secondary">
                    Location: {locationFilter}
                    <button
                      onClick={() => setLocationFilter("all")}
                      className="ml-1 hover:text-white cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {cityFilter && (
                  <Badge variant="secondary">
                    City: {cityFilter}
                    <button
                      onClick={() => setCityFilter("")}
                      className="ml-1 hover:text-white cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

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
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onAdUpdated={fetchAdsWithSearchAndFilters}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <FloatingCreateAd mode="create" onAdCreated={fetchAdsWithSearchAndFilters} />
    </div>
  );
}
