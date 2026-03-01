import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Shield, Car, Plane, Train, Bus, MapPin, Calendar, Fuel, Leaf, Loader2, Clock, DollarSign } from "lucide-react";
import { User } from "@supabase/supabase-js";

const Transport = () => {
  const [user, setUser] = useState<User | null>(null);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [transportType, setTransportType] = useState("flight");
  const [transportResults, setTransportResults] = useState<any[]>([]);
  const [routeData, setRouteData] = useState<any>(null);
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
    if (!fromLocation || !toLocation || !travelDate) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields to search for transport options.",
      });
      return;
    }

    setLoading(true);

    try {
      // Save search to database
      await supabase.from("transport_bookings").insert({
        user_id: user?.id,
        from_location: fromLocation,
        to_location: toLocation,
        travel_date: travelDate,
        transport_type: transportType,
        booking_status: "pending",
      });

      // Get AI-powered transport recommendations
      const { data, error } = await supabase.functions.invoke('transport-search', {
        body: { from: fromLocation, to: toLocation, date: travelDate, type: transportType }
      });

      if (error) throw error;

      setTransportResults(data);
      toast({
        title: "Transport Options Found!",
        description: `Found ${data.length} ${transportType} options for your journey.`,
      });
    } catch (error) {
      console.error('Transport search error:', error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "Unable to find transport options. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (option: any) => {
    try {
      const { error } = await supabase.from("transport_bookings").insert({
        user_id: user?.id,
        from_location: fromLocation,
        to_location: toLocation,
        travel_date: travelDate,
        transport_type: transportType,
        booking_status: "confirmed",
        booking_details: {
          carrier: option.carrier,
          price: option.price,
          departure: option.departure,
          arrival: option.arrival,
          duration: option.duration,
          class: option.class
        }
      });

      if (error) throw error;

      toast({
        title: "Booking Confirmed!",
        description: `Your ${transportType} ticket has been booked successfully with ${option.carrier}.`,
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Unable to complete booking. Please try again.",
      });
    }
  };

  const handleRouteSearch = async () => {
    if (!fromLocation || !toLocation) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter both locations for route planning.",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('transport-search', {
        body: { from: fromLocation, to: toLocation, date: travelDate, type: 'road' }
      });

      if (error) throw error;

      setRouteData(data);
      toast({
        title: "Route Calculated!",
        description: "Here's your optimized route with safety and sustainability insights.",
      });
    } catch (error) {
      console.error('Route search error:', error);
      toast({
        variant: "destructive",
        title: "Route Planning Failed",
        description: "Unable to calculate route. Please try again.",
      });
    } finally {
      setLoading(false);
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
            <h2 className="text-3xl font-bold mb-2">Transport Booking</h2>
            <p className="text-muted-foreground">Book flights, trains, buses & plan your road trips</p>
          </div>

          <Tabs defaultValue="public" className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="public">Public Transport</TabsTrigger>
              <TabsTrigger value="route">Route Planner</TabsTrigger>
            </TabsList>

            <TabsContent value="public">
              <Card>
                <CardHeader>
                  <CardTitle>Search Transport</CardTitle>
                  <CardDescription>Find flights, trains, and buses for your journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="from">From</Label>
                        <Input
                          id="from"
                          placeholder="Departure city"
                          value={fromLocation}
                          onChange={(e) => setFromLocation(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="to">To</Label>
                        <Input
                          id="to"
                          placeholder="Destination city"
                          value={toLocation}
                          onChange={(e) => setToLocation(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Travel Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="transport-type">Transport Type</Label>
                        <Select value={transportType} onValueChange={setTransportType}>
                          <SelectTrigger id="transport-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flight">
                              <div className="flex items-center gap-2">
                                <Plane className="w-4 h-4" />
                                Flight
                              </div>
                            </SelectItem>
                            <SelectItem value="train">
                              <div className="flex items-center gap-2">
                                <Train className="w-4 h-4" />
                                Train
                              </div>
                            </SelectItem>
                            <SelectItem value="bus">
                              <div className="flex items-center gap-2">
                                <Bus className="w-4 h-4" />
                                Bus
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleSearch} disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        'Search'
                      )}
                    </Button>
                  </div>

                  {transportResults.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">Available {transportType.charAt(0).toUpperCase() + transportType.slice(1)}s</h3>
                      <div className="space-y-4">
                        {transportResults.map((option, index) => (
                          <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg">{option.carrier}</h4>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {option.departure}
                                    </span>
                                    <span>→</span>
                                    <span>{option.arrival}</span>
                                    <span className="text-xs">({option.duration})</span>
                                  </div>
                                  <p className="text-sm text-accent mt-1">{option.class}</p>
                                </div>
                                 <div className="text-right">
                                  <p className="text-2xl font-bold text-primary">
                                    ₹{option.price}
                                  </p>
                                  <Button className="mt-2" onClick={() => handleBooking(option)}>Book Now</Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="route">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-info" />
                    Safe Route Planner
                  </CardTitle>
                  <CardDescription>Plan your road trip with safety and sustainability in mind</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="route-from">From</Label>
                        <Input
                          id="route-from"
                          placeholder="Starting location"
                          value={fromLocation}
                          onChange={(e) => setFromLocation(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="route-to">To</Label>
                        <Input
                          id="route-to"
                          placeholder="Destination"
                          value={toLocation}
                          onChange={(e) => setToLocation(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button onClick={handleRouteSearch} disabled={loading} className="w-full">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Calculating Route...
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 mr-2" />
                          Plan Route
                        </>
                      )}
                    </Button>

                    {routeData && (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Distance</Label>
                            <p className="text-2xl font-bold text-primary">{routeData.distance}</p>
                          </div>
                          <div>
                            <Label>Estimated Time</Label>
                            <p className="text-2xl font-bold text-primary">{routeData.duration}</p>
                          </div>
                        </div>

                        <Card className="bg-accent/10">
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Fuel className="w-5 h-5 text-warning" />
                              Fuel & Emissions
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span>Fuel Consumption</span>
                              <span className="font-semibold">{routeData.fuelConsumption}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>CO2 Emissions</span>
                              <span className="font-semibold">{routeData.co2Emissions}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Sustainability Score</span>
                              <span className="font-semibold">{routeData.sustainabilityScore}/10</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-primary/10">
                          <CardHeader>
                            <CardTitle className="text-lg">Route Details</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p>{routeData.route}</p>
                            <div>
                              <Label className="text-sm font-semibold">Road Conditions</Label>
                              <p className="text-sm text-muted-foreground">{routeData.conditions}</p>
                            </div>
                            {routeData.stops && routeData.stops.length > 0 && (
                              <div>
                                <Label className="text-sm font-semibold">Recommended Stops</Label>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                  {routeData.stops.map((stop: string, i: number) => (
                                    <li key={i}>{stop}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Transport;
