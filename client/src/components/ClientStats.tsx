import { Users, DollarSign, Star, Calendar } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ClientStatsProps {
  stats: StatItem[];
}

export default function ClientStats({ stats }: ClientStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {stats.map((stat, index) => (
        <div key={stat.label} className="text-center p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <stat.icon className="h-5 w-5 text-primary mr-2" />
            <span className="text-2xl font-bold text-foreground">
              {stat.value}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}


