"use client"

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-4xl mx-auto text-center">
        {/* Large artistic name */}
        <div className="mb-8">
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold tracking-tight mb-4">
            <span className="bold-artistic block animate-fade-in-up">QI</span>
            <span className="bold-artistic block -mt-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              EE
            </span>
          </h1>
        </div>

        {/* Subtitle with fun animations */}
        <div className="mb-12">
          <p className="text-lg sm:text-xl artistic-text text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              Visual storyteller
            </span>{" "}
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              capturing moments
            </span>{" "}
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
              that speak louder
            </span>{" "}
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "1.0s" }}>
              than words.
            </span>{" "}
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "1.2s" }}>
              Specializing in
            </span>{" "}
            <span
              className="inline-block animate-fade-in-up hover:text-primary transition-colors cursor-default"
              style={{ animationDelay: "1.4s" }}
            >
              portrait,
            </span>{" "}
            <span
              className="inline-block animate-fade-in-up hover:text-primary transition-colors cursor-default"
              style={{ animationDelay: "1.6s" }}
            >
              street,
            </span>{" "}
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "1.8s" }}>
              and
            </span>{" "}
            <span
              className="inline-block animate-fade-in-up hover:text-primary transition-colors cursor-default"
              style={{ animationDelay: "2.0s" }}
            >
              conceptual photography.
            </span>
          </p>
        </div>

        {/* Call to action */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
          style={{ animationDelay: "2.2s" }}
        >
          <button
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors artistic-text hover:scale-105 transform transition-transform"
          >
            View Work
          </button>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 border border-border hover:bg-accent hover:text-accent-foreground transition-colors artistic-text hover:scale-105 transform transition-transform"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </section>
  )
}
