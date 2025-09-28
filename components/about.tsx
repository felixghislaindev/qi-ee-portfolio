export function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/20">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 bold-artistic">About Qi Ee</h2>
            <div className="space-y-6 artistic-text text-muted-foreground leading-relaxed">
              <p>
                I'm a visual storyteller passionate about capturing the raw beauty of human experience. My work spans
                across portrait, street, and conceptual photography, always seeking to reveal the extraordinary in the
                ordinary.
              </p>
              <p>
                With over 8 years behind the lens, I've developed a distinctive style that blends documentary
                authenticity with artistic vision. My approach is intuitive yet deliberate, always in service of the
                story.
              </p>
              <p>
                When I'm not shooting, you'll find me exploring new neighborhoods, studying light, or collaborating with
                other creatives who share my passion for pushing boundaries.
              </p>
            </div>

            {/* Skills/Specialties */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 bold-artistic">Specialties</h3>
              <div className="flex flex-wrap gap-3">
                {["Portrait Photography", "Street Photography", "Editorial Work", "Documentary", "Conceptual Art"].map(
                  (skill) => (
                    <span key={skill} className="px-4 py-2 bg-background border border-border artistic-text text-sm">
                      {skill}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] bg-muted overflow-hidden">
              <img src="/photographer-portrait-artistic-black-and-white-pro.jpg" alt="Qi Ee - Photographer" className="w-full h-full object-cover" />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/30 -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
