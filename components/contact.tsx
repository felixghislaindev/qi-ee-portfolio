"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Instagram, Phone } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bold-artistic">Let's Create Together</h2>
          <p className="text-lg artistic-text text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? I'd love to hear about your vision and explore how we can bring it to life through
            photography.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 artistic-text">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border bg-background focus:ring-2 focus:ring-ring focus:border-transparent artistic-text"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 artistic-text">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border bg-background focus:ring-2 focus:ring-ring focus:border-transparent artistic-text"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 artistic-text">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-border bg-background focus:ring-2 focus:ring-ring focus:border-transparent artistic-text resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <Button type="submit" className="w-full py-3 artistic-text">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-6 bold-artistic">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="artistic-text">hello@qiee.photography</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="artistic-text">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Instagram className="w-5 h-5 text-muted-foreground" />
                  <span className="artistic-text">@qiee.photography</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 bold-artistic">Services</h3>
              <ul className="space-y-2 artistic-text text-muted-foreground">
                <li>• Portrait Sessions</li>
                <li>• Editorial Photography</li>
                <li>• Event Documentation</li>
                <li>• Commercial Projects</li>
                <li>• Art Direction</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 bold-artistic">Based in</h3>
              <p className="artistic-text text-muted-foreground">
                New York City
                <br />
                Available for travel worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
