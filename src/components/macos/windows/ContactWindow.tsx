import { useState } from "react";
import { Send, Mail, MessageSquare, Loader2, CheckCircle, AlertCircle, icons } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { z } from "zod";

// Validation schema
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(200, "Subject must be less than 200 characters"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message must be less than 2000 characters"),
});

type FormData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

type FormStatus = "idle" | "submitting" | "success" | "error";

export const ContactWindow = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    try {
      contactSchema.shape[field].parse(value);
      return undefined;
    } catch (err) {
      if (err instanceof z.ZodError) {
        return err.errors[0]?.message;
      }
      return "Invalid input";
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");
    setErrors({});
    try {
      const response = await fetch("https://formspree.io/f/movjnylv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
    
      setStatus("error");
    }
  };

  const quickLinks = [

    {
      icon: icons.BriefcaseBusiness,
      label: "Hire Me at Mostaql",
      href: "https://mostaql.com/u/Eyad_Ayman1",
      color: "macos-accent-blue",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:eyadghetas@gmail.com",
      color: "macos-accent-blue",
    },
    {
      icon: icons.MessageCircle,
      label: "WhatsApp",
      href: "https://wa.me/+201022914719",
      color: "macos-accent-green",
    },
    {
      icon: icons.Facebook,
      label: "Facebook",
      href: "https://www.facebook.com/Eyad311ayman",
      color: "macos-accent-blue",
    },
    {
      icon: icons.Instagram,
      label: "Instagram",
      href: "https://www.instagram.com/evad_fouad/",
      color: "macos-accent-green",
    },
    {
      icon: icons.Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/eyad-ayman-32a9272aa/",
      color: "macos-accent-blue",
    },
    {
      icon: icons.Github,
      label: "GitHub",
      href: "https://github.com/EAEY",
      color: "macos-accent-green",
    },
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="grid md:grid-cols-[1fr_auto] gap-6">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-scale-in">
              <CheckCircle className="w-16 h-16 text-macos-accent-green mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Message Sent!
              </h3>
              <p className="text-muted-foreground mb-4">
                Thank you for reaching out. I'll get back to you soon!
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStatus("idle")}
                className="bg-white/10 border-glass-border hover:bg-white/20"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-foreground/80">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className={cn(
                      "bg-white/5 border-glass-border focus:border-macos-accent-blue",
                      errors.name && "border-macos-traffic-red focus:border-macos-traffic-red"
                    )}
                    disabled={status === "submitting"}
                    maxLength={100}
                  />
                  {errors.name && (
                    <p className="text-xs text-macos-traffic-red">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-foreground/80">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={cn(
                      "bg-white/5 border-glass-border focus:border-macos-accent-blue",
                      errors.email && "border-macos-traffic-red focus:border-macos-traffic-red"
                    )}
                    disabled={status === "submitting"}
                    maxLength={255}
                  />
                  {errors.email && (
                    <p className="text-xs text-macos-traffic-red">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-sm font-medium text-foreground/80">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  onBlur={() => handleBlur("subject")}
                  className={cn(
                    "bg-white/5 border-glass-border focus:border-macos-accent-blue",
                    errors.subject && "border-macos-traffic-red focus:border-macos-traffic-red"
                  )}
                  disabled={status === "submitting"}
                  maxLength={200}
                />
                {errors.subject && (
                  <p className="text-xs text-macos-traffic-red">{errors.subject}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-medium text-foreground/80">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onBlur={() => handleBlur("message")}
                  className={cn(
                    "bg-white/5 border-glass-border focus:border-macos-accent-blue resize-none",
                    errors.message && "border-macos-traffic-red focus:border-macos-traffic-red"
                  )}
                  disabled={status === "submitting"}
                  maxLength={2000}
                />
                {errors.message && (
                  <p className="text-xs text-macos-traffic-red">{errors.message}</p>
                )}
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-macos-traffic-red text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Something went wrong. Please try again.
                </div>
              )}

              <Button
                type="submit"
                disabled={status === "submitting"}
                className="w-full gap-2 bg-macos-accent-blue hover:bg-macos-accent-blue/90"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </Button>
            </>
          )}
        </form>

        {/* Quick Links Sidebar */}
        <div className="md:border-l md:border-glass-border/50 md:pl-6 space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Quick Links
          </h3>
          <div className="space-y-3">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg",
                  "bg-white/5 border border-glass-border",
                  "hover:bg-white/10 hover:border-macos-accent-blue/30",
                  "transition-all duration-200"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    link.color === "macos-accent-blue"
                      ? "bg-macos-accent-blue/20"
                      : "bg-macos-accent-green/20"
                      
                  )}
                >
                  <link.icon
                    className={cn(
                      "w-5 h-5",
                      link.color === "macos-accent-blue"
                        ? "text-macos-accent-blue"
                        : "text-macos-accent-green"
                    )}
                  />
                </div>
                <span className="font-medium text-foreground">{link.label}</span>
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-glass-border/50">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Feel free to reach out through any of these channels. I typically
              respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactWindow;
