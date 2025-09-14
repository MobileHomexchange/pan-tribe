import { Briefcase, GraduationCap, Gift } from "lucide-react";

const sponsoredContent = [
  {
    id: "1",
    title: "Follow Up Boss",
    description: "Reach out at the right time, every time, as though every lead were a VIP.",
    icon: Briefcase
  },
  {
    id: "2", 
    title: "African Tech Institute",
    description: "Learn cutting-edge tech skills from industry experts across Africa.",
    icon: GraduationCap
  }
];

export function RightSidebar() {
  return (
    <div className="space-y-4">
      {/* Sponsored Section */}
      <div className="bg-card rounded-lg p-4 border border-social-border">
        <h3 className="text-base font-semibold text-card-foreground mb-4 pb-2 border-b border-social-border">
          Sponsored
        </h3>
        
        <div className="space-y-4">
          {sponsoredContent.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-light-gold flex items-center justify-center flex-shrink-0">
                <item.icon className="h-5 w-5 text-pan-green" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-card-foreground text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-social-muted leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Ad Banner */}
        <div className="mt-6 p-4 bg-muted rounded-lg border border-dashed border-social-border text-center">
          <p className="text-sm text-social-muted mb-2">Advertisement</p>
          <div className="w-full h-32 bg-gradient-to-br from-muted to-border rounded flex items-center justify-center">
            <span className="text-social-muted text-sm">Google AdSense Banner</span>
          </div>
        </div>
      </div>

      {/* Birthday Section */}
      <div className="bg-card rounded-lg p-4 border border-social-border">
        <div className="flex items-center gap-3 p-3 bg-light-green rounded-lg">
          <div className="w-10 h-10 rounded-full bg-pan-green flex items-center justify-center flex-shrink-0">
            <Gift className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-card-foreground text-sm mb-1">Upcoming Birthdays</h4>
            <p className="text-xs text-social-muted">Ronald Trent and 3 others have birthdays coming up this week.</p>
          </div>
        </div>
      </div>
    </div>
  );
}