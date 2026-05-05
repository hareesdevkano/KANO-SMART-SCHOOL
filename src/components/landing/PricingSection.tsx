import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "₦0",
      period: "/month",
      description: "For schools just getting started",
      features: [
        "Up to 50 students",
        "2 admin users",
        "Basic student management",
        "Attendance tracking",
        "Digital grade book",
        "WhatsApp support",
      ],
      popular: false,
      cta: "Get Started Free",
      variant: "outline" as const,
    },
    {
      name: "Basic",
      price: "₦15,000",
      period: "/month",
      description: "For growing schools with more needs",
      features: [
        "Up to 500 students",
        "10 admin users",
        "Full student management",
        "Result processing module",
        "Result & report cards",
        "Fee collection & tracking",
        "Parent portal",
        "Priority support",
      ],
      popular: true,
      cta: "Start 14-Day Trial",
      variant: "default" as const,
    },
    {
      name: "Premium",
      price: "₦35,000",
      period: "/month",
      description: "For large schools and school groups",
      features: [
        "Unlimited students",
        "Unlimited admin users",
        "All Basic features",
        "Multi-campus support",
        "Qur'an Hifz tracking",
        "Advanced analytics",
        "Student ID card generation",
        "Dedicated account manager",
        "Custom branding",
        "API access",
      ],
      popular: false,
      cta: "Start 14-Day Trial",
      variant: "outline" as const,
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Affordable Pricing
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Choose Your{" "}
            <span className="text-gradient">Perfect Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free and upgrade as your school grows. All plans include a 14-day free trial.
            No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              variant={plan.popular ? "pricing-popular" : "pricing"}
              className={`relative animate-slide-up ${plan.popular ? "lg:-mt-4 lg:mb-4 ring-2 ring-secondary scale-105" : ""}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl font-bold text-foreground">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl lg:text-5xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/register">
                  <Button
                    variant={plan.popular ? "hero" : plan.variant}
                    size="lg"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">
            All plans include 14-day free trial • No card required • Cancel anytime
          </p>
          <p className="text-sm text-muted-foreground">
            🏫 Need enterprise pricing for a network of schools?{" "}
            <a href="https://wa.me/2349073733790" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
              Chat with us on WhatsApp →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
