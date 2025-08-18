import { Shield, Clock, DollarSign, Star, MessageSquare, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Protected transactions with escrow service and milestone-based payments for your peace of mind."
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer service to help you with any questions or issues you might have."
  },
  {
    icon: DollarSign,
    title: "Competitive Rates",
    description: "Fair pricing with transparent fees. No hidden costs, just honest transactions."
  },
  {
    icon: Star,
    title: "Quality Assurance",
    description: "Verified professionals with ratings and reviews to ensure top-quality work delivery."
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description: "Seamless communication tools to collaborate effectively with your team members."
  },
  {
    icon: Award,
    title: "Certified Experts",
    description: "Access to skilled professionals across all industries with proven track records."
  }
];

const FeatureSection = () => {
  return (
    <section className="py-20 bg-gradient-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose GigConnect?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide everything you need to succeed in the freelance economy, 
            from secure payments to quality assurance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="bg-card border-border shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;