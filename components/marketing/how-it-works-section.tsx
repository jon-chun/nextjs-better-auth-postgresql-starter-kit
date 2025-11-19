import { Upload, Palette, Download } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Upload Your Photo",
    description:
      "Select a clear photo of yourself, a friend, family member, or pet. The clearer the photo, the better the result!",
  },
  {
    number: 2,
    icon: Palette,
    title: "Choose Your Style",
    description:
      "Pick from our curated plushie styles: Cute & Fluffy, Realistic Plush, Cartoon, or Minimalist.",
  },
  {
    number: 3,
    icon: Download,
    title: "Get Your Plushie",
    description:
      "Watch as our AI transforms your photo into an adorable plushie in seconds. Download and share!",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/50">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three simple steps to plushie perfection
          </p>
        </div>

        {/* Steps */}
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector Line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                )}

                <div className="relative text-center">
                  {/* Step Number Circle */}
                  <div className="mb-6 inline-flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary/20 bg-background shadow-lg">
                    <div className="flex flex-col items-center gap-2">
                      <step.icon className="h-10 w-10 text-primary" />
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
