import { memo } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    rating: 5,
    quote: "Fastest JPG to PNG converter I've used. No signup and works instantly.",
    name: "Sarah M.",
    country: "USA"
  },
  {
    rating: 5,
    quote: "Finally found a PDF tool that doesn't ask for my email. Love the privacy focus!",
    name: "Rajesh K.",
    country: "India"
  },
  {
    rating: 5,
    quote: "Use the QR generator daily for my small business. Simple and reliable.",
    name: "Emma L.",
    country: "UK"
  },
  {
    rating: 5,
    quote: "As a student, I compress images and convert files here all the time. Completely free!",
    name: "Ahmed S.",
    country: "UAE"
  },
  {
    rating: 5,
    quote: "The audio cutter saved me hours. Works right in the browser, no software needed.",
    name: "Thomas B.",
    country: "Germany"
  },
  {
    rating: 5,
    quote: "Best free tool collection I've found. Everything just works, even on my phone.",
    name: "Priya T.",
    country: "Nepal"
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

              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

UserTestimonials.displayName = "UserTestimonials";

export default UserTestimonials;
