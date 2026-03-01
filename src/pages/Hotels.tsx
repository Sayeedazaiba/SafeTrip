import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Shield, Hotel, Calendar, DollarSign, MapPin, Star, Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";

const Hotels = () => {
  const [user, setUser] = useState<User | null>(null);
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [budget, setBudget] = useState("");
  const [travelType, setTravelType] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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

  const handleSearch = async () => {
    if (!destination || !checkIn || !checkOut || !budget || !travelType) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields to search for hotels.",
      });
      return;
    }

    setLoading(true);
    setShowResults(false);

    try {
      // Save search to database
      await supabase.from("hotel_bookings").insert({
        user_id: user?.id,
        destination,
        check_in: checkIn,
        check_out: checkOut,
        budget: parseFloat(budget),
        travel_type: travelType,
        booking_status: "searching",
      });

      // Get AI-powered hotel recommendations
      const { data, error } = await supabase.functions.invoke('hotel-search', {
        body: { destination, checkIn, checkOut, budget, travelType }
      });

      if (error) throw error;

      setHotels(data.hotels);
      setShowResults(true);
      toast({
        title: "Hotels Found!",
        description: `Found ${data.hotels.length} hotels matching your criteria.`,
      });
    } catch (error) {
      console.error('Hotel search error:', error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "Unable to find hotels. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const bookHotel = async (hotel: any) => {
    const { error } = await supabase
      .from("hotel_bookings")
      .update({
        hotel_name: hotel.name,
        booking_status: "confirmed",
        hotel_details: hotel,
      })
      .eq("user_id", user?.id)
      .eq("booking_status", "searching")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Unable to complete booking. Please try again.",
      });
    } else {
      toast({
        title: "Hotel Booked!",
        description: `Your booking at ${hotel.name} is confirmed.`,
      });
    }
  };

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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Hotel Booking</h2>
            <p className="text-muted-foreground">Find and book safe accommodations for your journey</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Search Hotels
              </CardTitle>
              <CardDescription>Enter your travel details to find the best hotels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    placeholder="Where are you going?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="travel-type">Travel Type</Label>
                  <Select value={travelType} onValueChange={setTravelType}>
                    <SelectTrigger id="travel-type">
                      <SelectValue placeholder="Select travel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beaches">Beaches</SelectItem>
                      <SelectItem value="hiking">Hiking</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="check-in">Check-in Date</Label>
                  <Input
                    id="check-in"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="check-out">Check-out Date</Label>
                  <Input
                    id="check-out"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="budget">Budget (₹ per night)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Enter your budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
              </div>
              <Button className="w-full mt-6" onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Hotel className="w-4 h-4 mr-2" />
                    Explore Hotels
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {showResults && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Available Hotels</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover" />
                    <CardHeader>
                      <CardTitle className="text-lg">{hotel.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {hotel.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-warning fill-warning" />
                            <span className="font-semibold">{hotel.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-success" />
                            <span className="font-bold">${hotel.price}/night</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{hotel.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {hotel.amenities.slice(0, 4).map((amenity: string) => (
                            <span
                              key={amenity}
                              className="text-xs bg-accent/20 px-2 py-1 rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <Button className="w-full" onClick={() => bookHotel(hotel)}>
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Hotels;
