import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import { User } from "@supabase/supabase-js";

const SOS = () => {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
    });
  }, []);

  // Fetch contacts
  useEffect(() => {
    if (user) {
      fetchContacts();
      getLocation();
    }
  }, [user]);

  const fetchContacts = async () => {
    const { data } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", user?.id);

    setContacts(data || []);
  };

  // Get location
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  };

  // SOS Trigger
  const handleSOS = async () => {
    setClickCount((prev) => prev + 1);

    if (clickCount + 1 === 2) {
      setLoading(true);

      try {
        const { error } = await supabase.functions.invoke("send-sos-alert", {
          body: {
            contacts,
            location,
            userName: user?.user_metadata?.full_name || "User",
          },
        });

        if (error) {
          toast({
            variant: "destructive",
            title: "SOS Alert Failed",
            description: "Failed to send emergency alerts.",
          });
        } else {
          toast({
            title: "SOS Alert Sent!",
            description: "Emergency alerts sent successfully.",
          });

          // ✅ NEW FEATURE: WhatsApp Opening
          if (location && contacts.length > 0) {
            const message = `🚨 EMERGENCY ALERT 🚨
${user?.user_metadata?.full_name || "User"} needs help!

📍 Live Location:
https://www.google.com/maps?q=${location.lat},${location.lng}

Please respond immediately!`;

            contacts.forEach((contact) => {
              if (contact.whatsapp_number) {
                const phone = contact.whatsapp_number.replace(/\D/g, "");
                const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                window.open(url, "_blank");
              }
            });
          }
        }
      } catch (err) {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong.",
        });
      }

      setClickCount(0);
      setLoading(false);
    } else {
      setTimeout(() => setClickCount(0), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-background">
      <Card className="w-full max-w-md text-center p-6">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-2">
            <Shield /> Emergency SOS
          </CardTitle>
          <CardDescription>
            {clickCount === 1 ? "Press again to confirm!" : "Double press to send alert"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            onClick={handleSOS}
            className="h-28 w-28 rounded-full text-xl"
            disabled={loading}
          >
            {loading ? "Sending..." : "SOS"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SOS;