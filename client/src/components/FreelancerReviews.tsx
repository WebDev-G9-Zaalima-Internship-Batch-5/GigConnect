import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";

const FreelancerReviews = ({ reviews }) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Client Reviews</CardTitle>
        <CardDescription>
          What clients say about working with Sarah
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="p-4 border border-border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{review.client}</h4>
                  <p className="text-sm text-muted-foreground">
                    {review.project}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-warning text-warning"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {review.date}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "{review.comment}"
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerReviews;
