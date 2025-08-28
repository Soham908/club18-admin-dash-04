import { AppLayout } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Broadcasts() {
  return (
    <AppLayout>
      <Header title="Broadcast Messages" />
      <main className="p-4 space-y-4">
        <h1 className="sr-only">Broadcast Messages</h1>
        <Card className="p-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-4 items-center">
            <Label htmlFor="subject" className="sm:text-right">Subject</Label>
            <div className="sm:col-span-3"><Input id="subject" placeholder="Promo update" /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-4 items-start">
            <Label htmlFor="message" className="sm:text-right">Message</Label>
            <div className="sm:col-span-3"><Textarea id="message" placeholder="Write your broadcast..." rows={6} /></div>
          </div>
          <div className="flex justify-end">
            <Button variant="success">Send Broadcast</Button>
          </div>
        </Card>
      </main>
    </AppLayout>
  );
}
