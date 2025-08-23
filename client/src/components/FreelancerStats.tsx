import { Award, DollarSign, Star, Clock, Calendar } from "lucide-react";

const FreelancerStats = ({ profile }) => {
  const stats = [
    { label: "Jobs Completed", value: profile.completedGigs, icon: Award },
    { label: "Success Rate", value: `${profile.successRate}%`, icon: Star },
    {
      label: "Response Time",
      value: `< ${profile.responseTime}hr`,
      icon: Clock,
    },
    {
        label: "Availability",
        value: profile.availability.toUpperCase(),
        icon: Calendar
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
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
};

export default FreelancerStats;
