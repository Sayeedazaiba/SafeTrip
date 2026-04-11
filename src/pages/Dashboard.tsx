import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  MapPin,
  Hotel,
  FileText,
  MessageSquare,
  DollarSign,
  Cloud,
  LogOut,
  Bell,
  Car,
  Sparkles,
} from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>("");
  const [weather, setWeather] = useState<any>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) navigate("/auth");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (navigator.geolocation && user) {
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
          } catch (error) {
            console.error("Address error:", error);
          }

          try {
            const apiKey = "0e0bd1aef54e4ff162326af7a9e9bf89";

            const weatherRes = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            );

            if (!weatherRes.ok) {
              console.log("Weather API failed");
              return;
            }

            const weatherData = await weatherRes.json();

            if (weatherData && weatherData.main && weatherData.weather) {
              setWeather(weatherData);
            }
          } catch (error) {
            console.error("Weather error:", error);
          }
        },
        () => {
          toast({
            variant: "destructive",
            title: "Location access denied",
            description: "Enable location for full features.",
          });
        }
      );
    }
  }, [user, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const features = [
    { icon: Shield, title: "SOS Emergency", description: "Double-tap for alerts", route: "/sos", color: "text-secondary" },
    { icon: MapPin, title: "Safety Monitor", description: "Real-time safety", route: "/safety", color: "text-primary" },
    { icon: Hotel, title: "Hotel Booking", description: "Safe stays", route: "/hotels", color: "text-accent" },
    { icon: Car, title: "Transport", description: "Flights & routes", route: "/transport", color: "text-info" },
    { icon: FileText, title: "Documents", description: "Secure vault", route: "/documents", color: "text-warning" },
    { icon: MessageSquare, title: "AI Assistant", description: "Travel help", route: "/chat", color: "text-success" },
    { icon: DollarSign, title: "Currency", description: "Live conversion", route: "/currency", color: "text-primary" },
    { icon: Sparkles, title: "Trip Planner", description: "AI itineraries", route: "/trip-planner", color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">SAFETRIP</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">
          Welcome back, {user?.user_metadata?.full_name || "Traveler"}!
        </h2>

        {/* ✅ LOCATION UI */}
        {location && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Current Location
              </CardTitle>
              <CardDescription>Your live location details</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{address || "Fetching address..."}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            </CardContent>
          </Card>
        )}

        {/* 🌦️ ENHANCED WEATHER UI */}
        <Card className="mb-6 bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cloud className="w-6 h-6 text-blue-600" />
              Weather Forecast
            </CardTitle>
          </CardHeader>

          <CardContent>
            {weather && weather.main ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-800">
                    {Math.round(weather.main.temp)}°C
                  </p>
                  <p className="capitalize text-md text-gray-600">
                    {weather.weather[0].description}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Humidity: {weather.main.humidity}%
                  </p>
                </div>

                
              </div>
            ) : (
              <p className="text-gray-500">Loading weather...</p>
            )}
          </CardContent>
        </Card>

        {/* FEATURES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <Card key={f.route} onClick={() => navigate(f.route)} className="cursor-pointer">
              <CardHeader>
                <f.icon className={`w-6 h-6 ${f.color}`} />
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;