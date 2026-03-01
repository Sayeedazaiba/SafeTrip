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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) {
        navigate("/auth");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Request location access
    if (navigator.geolocation && user) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          // Reverse geocoding to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setAddress(data.display_name || "Location unavailable");
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Location access denied",
            description: "Please enable location access for full safety features.",
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
    {
      icon: Shield,
      title: "SOS Emergency",
      description: "Double-tap for instant emergency alerts",
      route: "/sos",
      color: "text-secondary",
    },
    {
      icon: MapPin,
      title: "Safety Monitor",
      description: "Real-time location safety analysis",
      route: "/safety",
      color: "text-primary",
    },
    {
      icon: Hotel,
      title: "Hotel Booking",
      description: "Find and book safe accommodations",
      route: "/hotels",
      color: "text-accent",
    },
    {
      icon: Car,
      title: "Transport",
      description: "Book flights, trains, buses & routes",
      route: "/transport",
      color: "text-info",
    },
    {
      icon: FileText,
      title: "Document Vault",
      description: "Secure storage for important documents",
      route: "/documents",
      color: "text-warning",
    },
    {
      icon: MessageSquare,
      title: "AI Travel Assistant",
      description: "Get instant travel advice & tips",
      route: "/chat",
      color: "text-success",
    },
    {
      icon: DollarSign,
      title: "Currency Converter",
      description: "Convert currencies in real-time",
      route: "/currency",
      color: "text-primary",
    },
    {
      icon: Sparkles,
      title: "Trip Planner",
      description: "AI-powered trip itineraries",
      route: "/trip-planner",
      color: "text-accent",
    },
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
        {/* Welcome Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.full_name || "Traveler"}!
          </h2>
          <p className="text-muted-foreground">Your safety is our priority</p>
        </section>

        {/* Current Location */}
        {address && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Current Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{address}</p>
              {location && (
                <p className="text-xs text-muted-foreground mt-2">
                  Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Weather Widget */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-info" />
              Weather Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Loading current weather...</p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.route}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => navigate(feature.route)}
              >
                <CardHeader>
                  <feature.icon className={`w-8 h-8 ${feature.color} mb-2`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;