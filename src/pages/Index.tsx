import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-provider";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ChartsPanel } from "@/components/dashboard/ChartsPanel";
import { RecentActivityTable, type Entry } from "@/components/dashboard/RecentActivityTable";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useEffect, useMemo, useState } from "react";

interface Winner {
  name: string;
  phone: string;
  city: string;
}

function generateData() {
  const cities = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Benin City", "Enugu"];
  const first = ["Ayo", "Chioma", "Ifeanyi", "Kemi", "Sola", "Femi", "Ada", "Bola", "Tunde", "Ngozi"]; 
  const last = ["Okoro", "Adeyemi", "Balogun", "Eze", "Okafor", "Ojo", "Lawal", "Afolayan", "Ogunleye", "Ibrahim"]; 
  const entries: Entry[] = [];
  const total = 520;
  for (let i = 1; i <= total; i++) {
    const verified = Math.random() < 0.8;
    const status = verified ? "Verified" : Math.random() < 0.7 ? "Pending" : "Rejected";
    const city = cities[Math.floor(Math.random() * cities.length)];
    const name = `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
    const phone = `080${Math.floor(10000000 + Math.random() * 89999999)}`;
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10);
    entries.push({ id: String(i), name, phone, city, status, date });
  }

  // Aggregates
  const registrations = entries.length;
  const codeScansPerDay = Math.floor(Math.random() * 200) + 150; // Random daily scans

  // Daily
  const byDate = new Map<string, number>();
  entries.forEach((e) => byDate.set(e.date, (byDate.get(e.date) || 0) + 1));
  const daily = Array.from(byDate.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date: date.slice(5), count }));

  // City
  const byCity = new Map<string, number>();
  entries.forEach((e) => byCity.set(e.city, (byCity.get(e.city) || 0) + 1));
  const city = Array.from(byCity.entries()).map(([name, value]) => ({ name, value }));

  // Performance
  const performance = [
    { contest: "Summer Promo", value: 340 },
    { contest: "Game Night", value: 280 },
    { contest: "Weekend Rush", value: 410 },
  ];

  return { entries, registrations, codeScansPerDay, daily, city, performance };
}

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [winners, setWinners] = useState<Winner[]>([]);
  const data = useMemo(() => generateData(), []);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-heading font-semibold text-foreground">Admin Dashboard</h1>
            <p className="text-base text-muted-foreground">Maidan 72 Club</p>
          </div>
          <ModeToggle />
        </div>
      </header>
      
      <main className="container px-6 py-6 space-y-6">
        <StatsCards data={{ 
          registrations: data.registrations, 
          codeScansPerDay: data.codeScansPerDay, 
          winnersSelected: winners 
        }} />
        <QuickActions entries={data.entries} winners={winners} setWinners={setWinners} />
        <ChartsPanel daily={data.daily} city={data.city} performance={data.performance} />
        <RecentActivityTable entries={data.entries} />
      </main>
    </div>
  );
};

export default Index;
