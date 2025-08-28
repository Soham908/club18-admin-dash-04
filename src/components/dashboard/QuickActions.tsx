import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

type Entry = {
  id: string;
  name: string;
  phone: string;
  city: string;
  status: string;
  date: string;
};

interface Winner {
  name: string;
  phone: string;
  city: string;
}

interface QuickActionsProps {
  entries: Entry[];
  winners: Winner[];
  setWinners: (winners: Winner[]) => void;
}

export function QuickActions({ entries, winners, setWinners }: QuickActionsProps) {
  const { toast } = useToast();
  const [winnersOpen, setWinnersOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [count, setCount] = useState(3);
  const [selectedWinners, setSelectedWinners] = useState<Winner[]>([]);

  const pickWinners = () => {
    const cities = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Benin City", "Enugu"];
    const first = ["Ayo", "Chioma", "Ifeanyi", "Kemi", "Sola", "Femi", "Ada", "Bola", "Tunde", "Ngozi"];
    const last = ["Okoro", "Adeyemi", "Balogun", "Eze", "Okafor", "Ojo", "Lawal", "Afolayan", "Ogunleye", "Ibrahim"];
    
    const chosen: Winner[] = [];
    const n = Math.max(1, Math.min(count, 10));
    
    while (chosen.length < n) {
      const name = `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
      const city = cities[Math.floor(Math.random() * cities.length)];
      const phone = `080${Math.floor(10000000 + Math.random() * 89999999)}`;
      
      const winner = { name, phone, city };
      
      // Check if this winner already exists
      if (!chosen.some(w => w.name === winner.name && w.phone === winner.phone)) {
        chosen.push(winner);
      }
    }
    setSelectedWinners(chosen);
  };

  const confirm = () => {
    setWinners(selectedWinners);
    toast({ title: "Winners selected", description: `${selectedWinners.length} winner(s) picked successfully.` });
    setWinnersOpen(false);
  };

  const handleBroadcast = () => {
    setBroadcastOpen(true);
  };

  const sendBroadcast = () => {
    toast({ title: "Broadcast sent", description: `Message sent to ${winners.length} winner(s) successfully.` });
    setBroadcastOpen(false);
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Phone,City,Status,Date\n"
      + entries.map(e => `${e.name},${e.phone},${e.city},${e.status},${e.date}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contest_entries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "Export completed", description: "Contest entries exported successfully." });
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Select Winners Dialog */}
        <Dialog open={winnersOpen} onOpenChange={setWinnersOpen}>
          <DialogTrigger asChild>
            <Button className="hover-scale">
              <Sparkles className="h-4 w-4" />
              Select Winners
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Winners</DialogTitle>
              <DialogDescription>Pick a random set of winners from recent participants.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 items-center">
                <Label htmlFor="count">Number of winners</Label>
                <Input id="count" type="number" min={1} max={10} value={count} onChange={(e) => setCount(parseInt(e.target.value || "1", 10))} />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={pickWinners}>Pick Randomly</Button>
              </div>
              {selectedWinners.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Selected winners</p>
                  <ScrollArea className="h-40 rounded-md border p-3">
                    <ul className="text-sm space-y-2">
                      {selectedWinners.map((w, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-muted-foreground">#{i + 1}</span>
                          <span>{w.name}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setWinnersOpen(false)}>Cancel</Button>
              <Button onClick={confirm} disabled={selectedWinners.length === 0}>Confirm Selection</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send Broadcast Dialog */}
        <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
          <DialogTrigger asChild>
            <Button variant="success" onClick={handleBroadcast} className="hover-scale">
              <Send className="h-4 w-4" />
              Send Broadcast
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Broadcast Message</DialogTitle>
              <DialogDescription>
                {winners.length === 0 
                  ? "Please select winners first before sending a broadcast message."
                  : "Do you want to send message to the winners?"
                }
              </DialogDescription>
            </DialogHeader>
            
            {winners.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No winners selected yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Message Template</Label>
                  <Textarea 
                    readOnly 
                    value={`🎉 Congratulations! You've been selected as a winner in the Maidan 72 Club contest! Please contact us to claim your prize. Thank you for participating!`}
                    className="mt-2"
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Selected Winners ({winners.length})</Label>
                  <ScrollArea className="h-32 rounded-md border p-3 mt-2">
                    <ul className="text-sm space-y-1">
                       {winners.map((winner, i) => (
                         <li key={i} className="flex items-center gap-2">
                           <span className="text-muted-foreground">#{i + 1}</span>
                           <span>{winner.name}</span>
                         </li>
                       ))}
                    </ul>
                  </ScrollArea>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="ghost" onClick={() => setBroadcastOpen(false)}>
                {winners.length === 0 ? "Close" : "Cancel"}
              </Button>
              {winners.length > 0 && (
                <Button onClick={sendBroadcast}>Send Message</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="secondary" onClick={exportData} className="hover-scale">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>
    </Card>
  );
}