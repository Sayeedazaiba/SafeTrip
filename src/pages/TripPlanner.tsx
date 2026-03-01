import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, MapPin, Users, Calendar, Sparkles, Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";

const TripPlanner = () => {
  const [user, setUser] = useState<User | null>(null);
  const [place, setPlace] = useState("");
  const [persons, setPersons] = useState("1");
  const [duration, setDuration] = useState("3");
  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState("");
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

  const generatePlan = async () => {
    if (!place || !persons || !duration) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields to generate a trip plan.",
      });
      return;
    }

    setIsLoading(true);
    setTripPlan("");

    try {
      const { data, error } = await supabase.functions.invoke("trip-planner", {
        body: { place, persons: parseInt(persons), duration: parseInt(duration) },
      });

      if (error) throw error;

      setTripPlan(data.plan);
      toast({
        title: "Trip Plan Generated!",
        description: `Your personalized itinerary for ${place} is ready.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate trip plan. Please try again.",
      });
    } finally {
      setIsLoading(false);
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              AI Trip Planner
            </h2>
            <p className="text-muted-foreground">Get personalized travel itineraries with must-visit spots and local cuisine</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Plan Your Trip</CardTitle>
              <CardDescription>Enter your travel details to get a customized itinerary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="place" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Destination
                  </Label>
                  <Input
                    id="place"
                    placeholder="e.g., Paris, Tokyo, New York"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="persons" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Number of Persons
                    </Label>
                    <Input
                      id="persons"
                      type="number"
                      min="1"
                      value={persons}
                      onChange={(e) => setPersons(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Duration (days)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={generatePlan} disabled={isLoading} size="lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Trip Plan
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {tripPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Your Personalized Trip Plan</CardTitle>
                <CardDescription>
                  {place} • {persons} person(s) • {duration} day(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                  {tripPlan}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default TripPlanner;
