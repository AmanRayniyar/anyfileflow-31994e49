import { memo } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    rating: 5,
    quote: "Fastest JPG to PNG converter I've used. No signup and works instantly.",
    name: "Sarah M.",
    country: "USA",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },
  {
    rating: 5,
    quote: "Finally found a PDF tool that doesn't ask for my email. Love the privacy focus!",
    name: "Rajesh K.",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    rating: 5,
    quote: "Use the QR generator daily for my small business. Simple and reliable.",
    name: "Emma L.",
    country: "UK",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },
  {
    rating: 5,
    quote: "As a student, I compress images and convert files here all the time. Completely free!",
    name: "Ahmed S.",
    country: "UAE",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  },
  {
    rating: 5,
    quote: "The audio cutter saved me hours. Works right in the browser, no software needed.",
    name: "Thomas B.",
    country: "Germany",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    rating: 5,
    quote: "Best free tool collection I've found. Everything just works, even on my phone.",
    name: "Priya T.",
    country: "Nepal",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
  }
];

const UserTestimonials = memo(() => {
  return (
    <section className="py-12 bg-gradient-to-b from-background to-muted/30" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 id="testimonials-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted by users from around the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="absolute top-3 right-3 h-6 w-6 text-primary/20" aria-hidden="true" />
              
              {/* Stars */}
              <div className="flex gap-0.5 mb-3" aria-label={`${testimonial.rating} out of 5 stars`}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-foreground mb-4 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author with avatar */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                  loading="lazy"
                />
                <p className="text-sm font-medium text-foreground">
                  — {testimonial.name}, {testimonial.country}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-10">
          <p className="text-lg text-muted-foreground mb-4">
            Join thousands of users using AnyFile Flow every day
          </p>
          <a
            href="/tools"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start Using Free Tools
          </a>
        </div>
      </div>
    </section>
  );
});

UserTestimonials.displayName = "UserTestimonials";

export default UserTestimonials;
