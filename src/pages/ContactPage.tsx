import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - AnyFile Flow</title>
        <meta name="description" content="Get in touch with AnyFile Flow. We'd love to hear from you about our online file conversion tools." />
        <link rel="canonical" href="https://anyfileflow.com/contact" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
              <p className="text-lg text-muted-foreground">
                Have questions or feedback? We'd love to hear from you.
              </p>
            </header>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={5}
                      placeholder="Your message..."
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Get in Touch</h2>
                  <p className="text-muted-foreground mb-8">
                    Whether you have a question about our tools, need technical support, or want to 
                    suggest a new feature, our team is ready to help you.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <p className="text-muted-foreground">contact@anyfileflow.com</p>
                      <p className="text-muted-foreground">support@anyfileflow.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Response Time</h3>
                      <p className="text-muted-foreground">We typically respond within 24-48 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Founder</h3>
                      <p className="text-muted-foreground">Aman Rauniyar</p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-2">Quick Support</h3>
                  <p className="text-sm text-muted-foreground">
                    For faster support, please include as much detail as possible about your issue, 
                    including the tool you were using, your browser, and any error messages you encountered.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
