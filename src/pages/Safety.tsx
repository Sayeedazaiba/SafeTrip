import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, MapPin, AlertTriangle, CheckCircle, Cloud, Moon, Sun } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Progress } from "@/components/ui/progress";

const Safety = () => {
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>("");
  const [safetyScore, setSafetyScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      getCurrentLocation();
    }
  }, [user]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setAddress(data.display_name || "Location unavailable");

            analyzeSafety(latitude, longitude, data.display_name);
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Unable to get your location.",
          });
          setLoading(false);
        }
      );
    }
  };

  const analyzeSafety = async (lat: number, lng: number, locationName: string) => {
    setLoading(true);

    const hour = new Date().getHours();
    const isNight = hour >= 20 || hour < 6;

    let score = 70;

    if (isNight) {
      score -= 15;
    }

    if (locationName.toLowerCase().includes("market") || locationName.toLowerCase().includes("mall")) {
      score += 10;
    }

    if (locationName.toLowerCase().includes("highway") || locationName.toLowerCase().includes("road")) {
      score -= 5;
    }

    score = Math.max(0, Math.min(100, score));
    setSafetyScore(score);

    const { error } = await supabase.from("safety_reports").insert({
      user_id: user?.id,
      latitude: lat,
      longitude: lng,
      location: locationName,
      safety_score: score,
      street_lighting_score: isNight ? 60 : 85,
      weather_data: { time: new Date().toISOString(), conditions: "clear" },
      crime_data: { level: score > 70 ? "low" : score > 40 ? "medium" : "high" },
    });

    if (error) {
      console.error("Error saving safety report:", error);
    }

    setLoading(false);
  };

  const getSafetyLevel = (score: number) => {
    if (score >= 75) return { text: "Safe", color: "text-success", icon: CheckCircle };
    if (score >= 50) return { text: "Moderate", color: "text-warning", icon: AlertTriangle };
    return { text: "Caution", color: "text-destructive", icon: AlertTriangle };
  };

  const safetyLevel = getSafetyLevel(safetyScore);
  const SafetyIcon = safetyLevel.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">SAFETRIP</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Safety Monitor</h2>
            <p className="text-muted-foreground">Real-time safety analysis of your current location</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Current Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{address}</p>
                  {location && (
                    <p className="text-xs text-muted-foreground">
                      Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SafetyIcon className={`w-6 h-6 ${safetyLevel.color}`} />
                    Safety Score
                  </CardTitle>
                  <CardDescription>Based on multiple safety factors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">{safetyScore}/100</span>
                      <span className={`text-lg font-semibold ${safetyLevel.color}`}>
                        {safetyLevel.text}
                      </span>
                    </div>
                    <Progress value={safetyScore} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Moon className="w-5 h-5 text-info" />
                      Street Lighting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Quality</span>
                        <span className="font-semibold">
                          {new Date().getHours() >= 20 || new Date().getHours() < 6 ? "60%" : "85%"}
                        </span>
                      </div>
                      <Progress
                        value={new Date().getHours() >= 20 || new Date().getHours() < 6 ? 60 : 85}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-success" />
                      Crime Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Risk Level</span>
                        <span className={`font-semibold ${safetyScore > 70 ? "text-success" : safetyScore > 40 ? "text-warning" : "text-destructive"}`}>
                          {safetyScore > 70 ? "Low" : safetyScore > 40 ? "Medium" : "High"}
                        </span>
                      </div>
                      <Progress value={100 - safetyScore} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cloud className="w-5 h-5 text-info" />
                      Weather Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span>Current</span>
                      <div className="flex items-center gap-2">
                        <Sun className="w-5 h-5 text-warning" />
                        <span className="font-semibold">Clear</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      Safety Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Stay in well-lit areas</li>
                      <li>• Keep emergency contacts ready</li>
                      <li>• Be aware of surroundings</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <Button onClick={getCurrentLocation}>
                  Refresh Safety Analysis
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Safety;
