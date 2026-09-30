import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ChevronDown } from "lucide-react";

const SafePlaces: React.FC = () => {
  const [open, setOpen] = useState(false);

  // 🔹 Open Maps
  const findPlaces = (type: string) => {
    if (!navigator.geolocation) {
      alert("Location not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;

      // ✅ FIXED LINE
      const url = `https://www.google.com/maps/search/${type}/@${latitude},${longitude},15z`;

      window.open(url, "_blank");
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <h2 className="text-3xl font-bold mb-6 text-center">🛟 Assistance</h2>

      <div className="max-w-2xl mx-auto">

        {/* 🔽 NEARBY HELP ONLY */}
        <Card>
          <CardHeader
            className="cursor-pointer flex flex-row justify-between items-center"
            onClick={() => setOpen(!open)}
          >
            <CardTitle>Nearby Help</CardTitle>
            <ChevronDown />
          </CardHeader>

          {open && (
            <CardContent className="space-y-3">
              <Button onClick={() => findPlaces("police station")} className="w-full">
                <MapPin className="mr-2" /> Police Stations
              </Button>

              <Button onClick={() => findPlaces("hospital")} className="w-full">
                <MapPin className="mr-2" /> Hospitals
              </Button>

              <Button onClick={() => findPlaces("cafe")} className="w-full">
                <MapPin className="mr-2" /> Public Places
              </Button>
            </CardContent>
          )}
        </Card>

      </div>
    </div>
  );
};

export default SafePlaces;