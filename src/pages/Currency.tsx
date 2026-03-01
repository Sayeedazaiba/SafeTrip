import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, DollarSign, ArrowRight } from "lucide-react";
import { User } from "@supabase/supabase-js";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.12 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 149.50 },
];

const Currency = () => {
  const [user, setUser] = useState<User | null>(null);
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState<number | null>(null);
  const navigate = useNavigate();

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
    if (amount && fromCurrency && toCurrency) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency]);

  const convertCurrency = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      setResult(null);
      return;
    }

    const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1;
    const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1;

    const usdAmount = amountNum / fromRate;
    const convertedAmount = usdAmount * toRate;

    setResult(convertedAmount);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Currency Converter</h2>
            <p className="text-muted-foreground">Convert currencies in real-time for your travels</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Convert Currency
              </CardTitle>
              <CardDescription>Get live exchange rates for major currencies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 items-end">
                  <div>
                    <Label htmlFor="from-currency">From</Label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger id="from-currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.name} ({currency.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-center md:mb-2">
                    <Button variant="outline" size="icon" onClick={swapCurrencies}>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="to-currency">To</Label>
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger id="to-currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.name} ({currency.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {result !== null && amount && (
                <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">Converted Amount</p>
                      <p className="text-4xl font-bold text-primary">
                        {currencies.find((c) => c.code === toCurrency)?.symbol}
                        {result.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Current Exchange Rates (Base: USD)</h3>
                <div className="space-y-2">
                  {currencies.map((currency) => (
                    <div key={currency.code} className="flex justify-between items-center p-2 rounded-lg bg-accent/10">
                      <span className="font-medium">
                        {currency.symbol} {currency.name}
                      </span>
                      <span className="text-muted-foreground">{currency.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Currency;
