import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Phone, Mail, Plus, Trash2, AlertCircle } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface EmergencyContact {
  id: string;
  name: string;
  whatsapp_number: string;
  email: string;
}

const SOS = () => {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [newContact, setNewContact] = useState({ name: "", whatsapp_number: "", email: "" });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sosClicks, setSosClicks] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auth handling
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
      fetchContacts();
      getCurrentLocation();
    }
  }, [user]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => toast({ variant: "destructive", title: "Location Error", description: "Unable to get your location for emergency alerts." })
      );
    }
  };

  // Fetch contacts from Supabase
  const fetchContacts = async () => {
    const { data, error } = await supabase.from("emergency_contacts").select("*").eq("user_id", user?.id);
    if (error) toast({ variant: "destructive", title: "Error", description: "Failed to load emergency contacts." });
    else setContacts(data || []);
  };

  // Add new emergency contact
  const addContact = async () => {
    if (!newContact.name || !newContact.whatsapp_number || !newContact.email) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please fill in all contact details." });
      return;
    }

    const { error } = await supabase.from("emergency_contacts").insert({
      user_id: user?.id,
      name: newContact.name,
      whatsapp_number: newContact.whatsapp_number,
      email: newContact.email,
    });

    if (error) toast({ variant: "destructive", title: "Error", description: error.message });
    else {
      toast({ title: "Contact Added", description: `${newContact.name} has been added to your emergency contacts.` });
      setNewContact({ name: "", whatsapp_number: "", email: "" });
      fetchContacts();
    }
  };

  // Delete contact
  const deleteContact = async (id: string) => {
    const { error } = await supabase.from("emergency_contacts").delete().eq("id", id);
    if (error) toast({ variant: "destructive", title: "Error", description: "Failed to delete contact." });
    else {
      toast({ title: "Contact Removed", description: "Emergency contact has been removed." });
      fetchContacts();
    }
  };

  // Trigger SOS alert
  const triggerSOS = async () => {
    setSosClicks((prev) => prev + 1);

    if (sosClicks + 1 === 2) {
      setIsLoading(true);

      if (contacts.length === 0) {
        toast({ variant: "destructive", title: "No Emergency Contacts", description: "Please add emergency contacts before using SOS." });
        setSosClicks(0);
        setIsLoading(false);
        return;
      }

      if (!location) {
        toast({ variant: "destructive", title: "Location Unavailable", description: "Unable to send your location in the emergency alert." });
        setSosClicks(0);
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.functions.invoke("send-sos-alert", {
        body: JSON.stringify({ contacts, location, userName: user?.user_metadata?.full_name || "User" }),
      });

      if (error) toast({ variant: "destructive", title: "SOS Alert Failed", description: "Failed to send emergency alerts. Please try again." });
      else toast({ title: "SOS Alert Sent!", description: "Emergency alerts sent to all your contacts." });

      setSosClicks(0);
      setIsLoading(false);
      setTimeout(() => setSosClicks(0), 3000);
    } else setTimeout(() => setSosClicks(0), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">SAFETRIP</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>Back to Dashboard</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Emergency SOS</h2>
            <p className="text-muted-foreground">Manage your emergency contacts and send instant alerts</p>
          </div>

          {/* SOS Button */}
          <Card className="mb-8 bg-gradient-to-r from-secondary/20 to-secondary/10 border-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary"><AlertCircle className="w-6 h-6" /> Emergency Alert</CardTitle>
              <CardDescription>{sosClicks === 1 ? "Press once more to send SOS alert!" : "Press twice quickly to send emergency alert to all contacts"}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button size="lg" variant={sosClicks === 1 ? "default" : "outline"} className="h-32 w-32 rounded-full text-lg font-bold" onClick={triggerSOS} disabled={isLoading}>
                {isLoading ? "Sending..." : sosClicks === 1 ? "Press Again!" : "SOS"}
              </Button>
            </CardContent>
          </Card>

          {/* Add New Contact */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Add Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Contact Name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input id="whatsapp" type="tel" placeholder="+91XXXXXXXXXX" value={newContact.whatsapp_number} onChange={(e) => setNewContact({ ...newContact, whatsapp_number: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} />
                </div>
                <Button onClick={addContact}><Plus className="w-4 h-4 mr-2" /> Add Contact</Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Emergency Contacts</CardTitle>
              <CardDescription>{contacts.length === 0 ? "No emergency contacts added yet" : `${contacts.length} contact(s) will be notified during emergency`}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex justify-between items-center p-4 bg-accent/10 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2"><Phone className="w-4 h-4" />{contact.whatsapp_number}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2"><Mail className="w-4 h-4" />{contact.email}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteContact(contact.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SOS;