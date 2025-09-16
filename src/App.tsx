"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone } from "lucide-react"

let gsap: any = null
let ScrollTrigger: any = null
let Lenis: any = null

// Dynamic imports with error handling
const loadGSAP = async () => {
  try {
    const gsapModule = await import("gsap")
    const scrollTriggerModule = await import("gsap/ScrollTrigger")
    const lenisModule = await import("@studio-freight/lenis")

    gsap = gsapModule.default || gsapModule
    ScrollTrigger = scrollTriggerModule.ScrollTrigger
    Lenis = lenisModule.default || lenisModule

    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger)
    }
  } catch (error) {
    console.log("[v0] GSAP libraries not available, using fallback animations")
  }
}

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const containerRef = useRef(null)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would integrate with your email service (EmailJS, Formspree, etc.)
      // For now, we'll simulate the email sending
      console.log("[v0] Form submitted:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Reset form
      setFormData({ name: "", email: "", message: "" })
      alert("Message sent successfully! We will get back to you soon.")
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSectionClick = (section: string) => {
    setActiveSection(section.toLowerCase().replace(/\s+/g, "-").replace("&", "and"))
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    const initAnimations = async () => {
      await loadGSAP()

      if (!gsap || !ScrollTrigger || !Lenis) {
        console.log("[v0] Using CSS animations as fallback")
        return
      }

      const ctx = gsap.context(() => {
        const lenis = new Lenis({
          lerp: 0.08,
          duration: 1.2,
          smoothWheel: true,
          smoothTouch: true,
        })

        function raf(time: number) {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        ScrollTrigger.scrollerProxy(document.body, {
          scrollTop(value: any) {
            return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll
          },
          getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
          },
        })

        lenis.on("scroll", ScrollTrigger.update)
        ScrollTrigger.addEventListener("refresh", () => lenis.resize())
        ScrollTrigger.refresh()

        // Enhanced section animations
        gsap.utils.toArray<HTMLElement>("section").forEach((sec, index) => {
          gsap.fromTo(
            sec,
            { autoAlpha: 0, y: 60 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sec,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          )
        })

        // Enhanced parallax effects
        gsap.to("#hero h1", {
          yPercent: -25,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        })

        gsap.to("#hero p", {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        })

        // Enhanced service card animations
        gsap.utils.toArray<HTMLElement>(".service-card").forEach((card, index) => {
          gsap.fromTo(
            card,
            { y: 50, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
              delay: index * 0.1,
            },
          )
        })

        // Stats counter animation
        gsap.utils.toArray<HTMLElement>(".stat-number").forEach((stat) => {
          const endValue = stat.textContent || "0"
          gsap.fromTo(
            stat,
            { textContent: "0" },
            {
              textContent: endValue,
              duration: 2,
              ease: "power2.out",
              snap: { textContent: 1 },
              scrollTrigger: {
                trigger: stat,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          )
        })
      }, containerRef)

      return () => {
        ctx.revert()
      }
    }

    initAnimations()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-red-50">
      {/* Enhanced Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-red-100 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
            <img
              src="https://ik.imagekit.io/1ejspnv0y/image001.jpg?updatedAt=1757199327281"
              alt="Compsoft Communications"
              className="h-10 sm:h-12 w-auto"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {["Home", "About", "Services", "Solutions", "Clients & Partners", "Contact"].map((item, index) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                onClick={() => handleSectionClick(item)}
                className="text-blue-800 hover:text-red-600 transition-colors font-medium relative group"
                whileHover={{ scale: 1.05 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </motion.button>
            ))}
          </div>

          {/* Desktop Get Quote Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(220, 38, 38, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSectionClick("Contact")}
            className="hidden md:inline-block bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-red-700 hover:shadow-xl transition-all duration-300 border border-red-600"
          >
            Get a Quote
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col justify-content items-center w-8 h-8 space-y-1.5 focus:outline-none"
          >
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-blue-800 transition-all duration-300"
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-blue-800 transition-all duration-300"
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-blue-800 transition-all duration-300"
            />
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          initial={false}
          animate={isMobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden bg-white/95 backdrop-blur-lg border-t border-red-100"
        >
          <div className="px-4 py-4 space-y-3">
            {["Home", "About", "Services", "Solutions", "Clients & Partners", "Contact"].map((item, index) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={isMobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                onClick={() => handleSectionClick(item)}
                className="block w-full text-left text-blue-800 hover:text-red-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-red-50"
              >
                {item}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={isMobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              onClick={() => handleSectionClick("Contact")}
              className="block w-full bg-red-600 text-white px-3 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 text-center mt-4"
            >
              Get a Quote
            </motion.button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Enhanced Hero Section */}
      {activeSection === "home" && (
        <>
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-red-50">
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0">
              <source
                src="https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4"
                type="video/mp4"
              />
              <source
                src="https://videos.pexels.com/video-files/5011647/5011647-uhd_2560_1440_30fps.mp4"
                type="video/mp4"
              />
            </video>
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-blue-50/40 to-red-50/60" />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hero-content text-center py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 z-10"
            >
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 sm:mb-6 text-blue-800 leading-tight"
              >
                Compsoft Communications
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl sm:text-3xl md:text-5xl font-semibold text-black opacity-75 tracking-tight mb-6 sm:mb-8 leading-tight"
              >
                Leading IT Solutions Provider
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-6 sm:mt-8 max-w-3xl mx-auto text-base sm:text-xl leading-relaxed text-gray-700 px-4"
              >
                Comprehensive end-to-end ICT solutions to businesses across Southern Africa using best-of-breed
                technologies.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 sm:mt-10 inline-block"
              >
                <a
                  href="tel:+264851788637"
                  className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  Let's Connect
                </a>
              </motion.div>
            </motion.div>
            <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-red-600 animate-bounce z-10">
              <span className="text-xs sm:text-sm font-medium">Scroll Down</span>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </section>

          <section className="py-16 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
              >
                Trusted by Industry Leaders
              </motion.h2>

              <div className="relative">
                <div className="flex animate-scroll space-x-12">
                  {/* First set of logos */}
                  <div className="flex space-x-12 min-w-max">
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/first-national-bank-logo-png_seeklogo-464484.png?updatedAt=1757199077932"
                      alt="First National Bank"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/sctlvemvi/pngegg.png?updatedAt=1757516883344"
                      alt="Standard Bank"
                      className="h-12 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/images.png?updatedAt=1757199077634"
                      alt="EOS Capital"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/Unknown...png?updatedAt=1757199077435"
                      alt="Namcor"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/Screenshot%202019-03-08%20at%2011.52.21.png?updatedAt=1757199077883"
                      alt="Effort Investment Holdings"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/Unknown..png?updatedAt=1757199077433"
                      alt="Konrad"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/Unknown.png?updatedAt=1757199077430"
                      alt="Transnamib"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/Unknown3.png?updatedAt=1757199077459"
                      alt="MVA"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/Unknown.jpeg?updatedAt=1757199077690"
                      alt="Namib Nuclear"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/rfsol_logo.jpeg?updatedAt=1757199077266"
                      alt="Retirement Fund Solutions"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                  </div>

                  {/* Duplicate set for seamless loop */}
                  <div className="flex space-x-12 min-w-max">
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/first-national-bank-logo-png_seeklogo-464484.png?updatedAt=1757199077932"
                      alt="First National Bank"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/sctlvemvi/pngegg.png?updatedAt=1757516883344"
                      alt="Standard Bank"
                      className="h-12 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/images.png?updatedAt=1757199077634"
                      alt="EOS Capital"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/Unknown...png?updatedAt=1757199077435"
                      alt="Namcor"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/Screenshot%202019-03-08%20at%2011.52.21.png?updatedAt=1757199077883"
                      alt="Effort Investment Holdings"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/Unknown..png?updatedAt=1757199077433"
                      alt="Konrad"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/Unknown.png?updatedAt=1757199077430"
                      alt="Transnamib"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/Unknown3.png?updatedAt=1757199077459"
                      alt="MVA"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/Unknown.jpeg?updatedAt=1757199077690"
                      alt="Namib Nuclear"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                    <img
                      src="https://ik.imagekit.io/1ejspnv0y/clients/rfsol_logo.jpeg?updatedAt=1757199077266"
                      alt="Retirement Fund Solutions"
                      className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="py-24 border-t relative overflow-hidden bg-white">
            <div className="max-w-5xl mx-auto px-6 relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent"
              >
                Get In Touch
              </motion.h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <Mail className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Email</p>
                          <a
                            href="mailto:info@compsoftcommunications.com"
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            info@compsoftcommunications.com
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Phone className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Phone</p>
                          <a href="tel:+264851788637" className="text-blue-600 hover:text-blue-800 transition-colors">
                            +264 85 178 8637
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Address</p>
                          <p className="text-gray-600">Windhoek, Namibia</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Tell us about your project or inquiry..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-red-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-red-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </motion.div>
              </div>
            </div>
          </section>
        </>
      )}

      {activeSection === "about" && (
        <section id="about" className="py-24 border-t relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-800">About Compsoft Communications</h2>
              <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-700">
                Compsoft Communications is a leading ICT solutions and service provider in Namibia. We are dedicated to
                delivering innovative and reliable technology solutions that empower businesses to thrive in the digital
                age.
              </p>
            </motion.div>

            {/* Our Vision Card */}
            <div className="grid grid-cols-1 gap-8 mt-16 max-w-4xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-red-100 hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
              >
                <div className="mb-6 rounded-2xl overflow-hidden">
                  <img
                    src="https://ik.imagekit.io/sctlvemvi/photo_2025-09-11_10-42-58.jpg?updatedAt=1757580242227"
                    alt="Our Vision - Professional team looking toward the future"
                    className="w-full h-64 object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.src = "/images/vision-team-with-text.jpg"
                    }}
                  />
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  To be the most trusted and innovative ICT partner in Namibia, enabling our clients to achieve their
                  full potential through cutting-edge technology and exceptional service.
                </p>
              </motion.div>
            </div>

            {/* Three-column layout with Mission and What We Do */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Our Mission - Left */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-blue-100 hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  To provide secure, reliable, and scalable ICT solutions that meet the evolving needs of our clients,
                  fostering long-term partnerships built on trust, integrity, and mutual success.
                </p>
              </motion.div>

              {/* What We Do - Right */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-red-100 hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">What We Do</h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  We operate a state-of-the-art, IP-based next-generation network to deliver a comprehensive suite of
                  voice, data, and hosted services designed to be flexible and scalable.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {activeSection === "services" && (
        <section id="services" className="py-24 border-t relative overflow-hidden bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent"
            >
              <span className="text-blue-600">Our Services</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  title: "Connectivity Solutions",
                  icon: "wifi",
                  description: "Reliable and high-speed connectivity to keep your business connected.",
                  features: ["DSL/ADSL/SAIX", "Fiber & Metro Ethernet", "Wireless Solutions", "MPLS Networks"],
                  color: "red",
                },
                {
                  title: "Collaboration",
                  icon: "groups",
                  description: "Enhance teamwork and communication with our integrated collaboration tools.",
                  features: ["PABX Systems", "Video Conferencing", "Unified Communications", "Mobile Integration"],
                  color: "blue",
                },
                {
                  title: "Data Center Solutions",
                  icon: "database",
                  description: "Secure and scalable data center solutions to support your business growth.",
                  features: ["Cisco UCS", "Storage Solutions", "Virtualization", "Cloud Migration"],
                  color: "red",
                },
                {
                  title: "Converged Security",
                  icon: "security",
                  description: "Comprehensive security solutions to protect your business assets and data.",
                  features: ["Access Control", "Surveillance", "Network Security", "Fire Detection"],
                  color: "blue",
                },
                {
                  title: "Network Solutions",
                  icon: "lan",
                  description: "Expert network solutions to optimize performance and ensure reliability.",
                  features: ["Network Design", "Optimization", "Management", "Support"],
                  color: "red",
                },
                {
                  title: "Contact Centre",
                  icon: "support_agent",
                  description: "Advanced solutions to enhance customer service and support.",
                  features: ["Call Recording", "Quality Assurance", "Analytics", "Training"],
                  color: "blue",
                },
              ].map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ y: 40, opacity: 0, scale: 0.95 }}
                  whileInView={{ y: 0, opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className="service-card bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500 p-8 border border-gray-100"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${service.color === "red" ? "from-red-500 to-red-600" : "from-blue-500 to-blue-600"} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-4 text-gray-900 group-hover:text-${service.color}-600 transition-colors`}
                  >
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg
                          className={`w-4 h-4 text-${service.color}-500 mr-2`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeSection === "solutions" && (
        <section id="solutions" className="py-24 border-t relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent"
            >
              Solution Portfolio
            </motion.h2>

            <div className="space-y-16">
              <div>
                <h3 className="relative mb-8 text-3xl font-bold tracking-tight after:absolute after:bottom-[-8px] after:left-0 after:h-1 after:w-16 after:bg-gradient-to-r after:from-red-500 after:to-blue-600 after:rounded-full">
                  Connectivity
                </h3>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {[
                    {
                      title: "Last Mile Connectivity",
                      description:
                        "Reliable and high-speed connectivity solutions to keep your business connected, ensuring uptime and performance.",
                      icon: "router",
                    },
                    {
                      title: "Voice and Data",
                      description:
                        "Integrated voice and data solutions for seamless communication and efficient operational workflow.",
                      icon: "settings_phone",
                    },
                    {
                      title: "Business Internet Access",
                      description:
                        "High-speed, dedicated internet access tailored for business needs, providing stability and security.",
                      icon: "business_center",
                    },
                    {
                      title: "Virtual Private Network",
                      description:
                        "Secure and private network solutions for multi-site businesses, guaranteeing data integrity and confidentiality.",
                      icon: "vpn_lock",
                    },
                  ].map((solution, index) => (
                    <motion.div
                      key={solution.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: index * 0.1 }}
                      className="flex items-start gap-4 rounded-2xl border border-red-100 bg-white/80 backdrop-blur-sm p-6 transition-all hover:shadow-2xl hover:-translate-y-1"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-2 text-gray-900">{solution.title}</h4>
                        <p className="text-sm text-gray-600">{solution.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="relative mb-8 text-3xl font-bold tracking-tight after:absolute after:bottom-[-8px] after:left-0 after:h-1 after:w-16 after:bg-gradient-to-br after:from-blue-500 after:to-red-500 after:rounded-full">
                  Data Center Solutions
                </h3>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {[
                    {
                      title: "Computing",
                      description:
                        "Powerful and scalable computing resources to handle your most demanding applications and workloads.",
                      icon: "dns",
                    },
                    {
                      title: "Storage",
                      description:
                        "Secure, reliable, and high-performance storage solutions to manage and protect your critical business data.",
                      icon: "database",
                    },
                    {
                      title: "Virtualization",
                      description:
                        "Optimize your IT infrastructure with our virtualization services, improving efficiency and reducing costs.",
                      icon: "cloud_sync",
                    },
                    {
                      title: "Cloud & Hosted Services",
                      description:
                        "Flexible and scalable cloud and hosted services to support your business's growth and digital transformation.",
                      icon: "cloud",
                    },
                  ].map((solution, index) => (
                    <motion.div
                      key={solution.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: index * 0.1 }}
                      className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-sm p-6 transition-all hover:shadow-2xl hover:-translate-y-1"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2-2V6a2 2 0 002-2h14a2 2 0 002 2v4a2 2 0 00-2 2m-2-4h.01M17 16h.01"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-2 text-gray-900">{solution.title}</h4>
                        <p className="text-sm text-gray-600">{solution.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Clients & Partners */}
      {activeSection === "clients-and-partners" && (
        <section id="clients-and-partners" className="py-24 border-t relative overflow-hidden bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent"
            >
              Clients & Partners
            </motion.h2>

            <div className="text-center mb-12">
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We are proud to collaborate with a diverse range of clients and partners who are leaders in their
                respective industries.
              </p>
            </div>

            <div className="mb-20">
              <h3 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 mb-10">
                Notable Clients
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {[
                  {
                    name: "Standard Bank",
                    logo: "https://ik.imagekit.io/sctlvemvi/pngegg.png?updatedAt=1757513688327",
                  },
                  {
                    name: "FNB",
                    logo: "https://ik.imagekit.io/1ejspnv0y/clients/first-national-bank-logo-png_seeklogo-464484.png?updatedAt=1757199077932",
                  },
                  {
                    name: "EOS Capital",
                    logo: "https://ik.imagekit.io/1ejspnv0y/clients/images.png?updatedAt=1757199077634",
                  },
                  {
                    name: "NAMCOR",
                    logo: "https://ik.imagekit.io/1ejspnv0y/clients/Unknown...png?updatedAt=1757199077435",
                  },
                  {
                    name: "Effort Investment Holdings",
                    logo: "https://ik.imagekit.io/1ejspnv0y/clients/Screenshot%202019-03-08%20at%2011.52.21.png?updatedAt=1757199077883",
                  },
                  {
                    name: "Transnamib",
                    logo: "https://ik.imagekit.io/1ejspnv0y/clients/Unknown.png?updatedAt=1757199077430",
                  },
                  {
                    name: "Konrad Adenauer",
                    logo: "https://ik.imagekit.io/1ejspnv0y/clients/Unknown..png?updatedAt=1757199077433",
                  },
                  {
                    name: "Namib Nuclear",
                    logo: "https://ik.imagekit.io/1ejspnv0y/clients/Unknown.jpeg?updatedAt=1757199077690",
                  },
                  {
                    name: "MVA Fund",
                    logo: "https://ik.imagekit.io/1ejspnv0y/clients/Unknown3.png?updatedAt=1757199077459",
                  },
                  {
                    name: "Retirement Fund Solutions",
                    logo: "https://ik.imagekit.io/1ejspnv0y/clients/rfsol_logo.jpeg?updatedAt=1757199077266",
                  },
                ].map((client, i) => (
                  <motion.div
                    key={client.name}
                    initial={{ scale: 0.7, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all hover:shadow-3xl"
                  >
                    <div className="h-16 w-16 flex items-center justify-center">
                      <img
                        src={client.logo || "/placeholder.svg"}
                        alt={`${client.name} Logo`}
                        className={`max-h-16 max-w-16 object-contain ${
                          client.name === "Standard Bank" ? "scale-80" : ""
                        }`}
                      />
                    </div>
                    <h3 className="text-center text-sm font-semibold text-gray-700">{client.name}</h3>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 mb-10">
                Key Vendors & Strategic Partners
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-8 items-center justify-center">
                {[
                  { name: "HP", logo: "https://ik.imagekit.io/1ejspnv0y/images/hp.png?updatedAt=1757199189805" },
                  {
                    name: "Lenovo",
                    logo: "https://ik.imagekit.io/1ejspnv0y/images/lenovo.png?updatedAt=1757199190023",
                  },
                  { name: "Cisco", logo: "https://ik.imagekit.io/1ejspnv0y/images/cisco.png?updatedAt=1757199190087" },
                  { name: "Dell", logo: "https://ik.imagekit.io/1ejspnv0y/images/dell.png?updatedAt=1757199190067" },
                  { name: "Jabra", logo: "https://ik.imagekit.io/1ejspnv0y/images/jabra.png?updatedAt=1757199189553" },
                  {
                    name: "Polycom",
                    logo: "https://ik.imagekit.io/1ejspnv0y/images/Polycom.png?updatedAt=1757199190031",
                  },
                  {
                    name: "Webroot",
                    logo: "https://ik.imagekit.io/1ejspnv0y/images/images.png?updatedAt=1757199189774",
                  },
                  {
                    name: "Microsoft",
                    logo: "https://ik.imagekit.io/1ejspnv0y/images/microsft.png?updatedAt=1757199189838",
                  },
                  {
                    name: "Veeam",
                    logo: "https://ik.imagekit.io/sctlvemvi/veeam-logo-K7tCw3De.jpg",
                  },
                ].map((partner, i) => (
                  <motion.div
                    key={partner.name}
                    initial={{ scale: 0.7, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex items-center justify-center p-4 bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all"
                  >
                    <img
                      src={partner.logo || "/placeholder.svg"}
                      alt={`${partner.name} Logo`}
                      className="h-12 max-w-20 object-contain"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-20 text-center"
            >
              <p className="mx-auto max-w-2xl text-2xl font-semibold leading-relaxed text-gray-800">
                Join these industry leaders who trust Compsoft Communications to deliver innovative ICT solutions that
                drive business success.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {activeSection === "contact" && (
        <section id="contact" className="py-24 border-t relative overflow-hidden bg-white">
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent"
            >
              Contact Us
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="mb-8"
                >
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">Our Office</h3>
                  <p className="text-gray-600 leading-relaxed">NO. 4 Adler Street, Windhoek, Namibia</p>
                  <p className="text-gray-600 leading-relaxed">P.O. Box 1234, Windhoek, Namibia</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="mb-8"
                >
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">Contact Details</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Email:{" "}
                    <a
                      href="mailto:info@compsoftcommunications.com"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      info@compsoftcommunications.com
                    </a>
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Phone:{" "}
                    <a href="tel:+264851788637" className="text-blue-600 hover:text-blue-800 transition-colors">
                      +264851788637
                    </a>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">Business Hours</h3>
                  <p className="text-gray-600 leading-relaxed">Monday - Friday: 8:00 AM to 5:00 PM</p>
                  <p className="text-gray-600 leading-relaxed">Saturday: 9:00 AM to 1:00 PM</p>
                  <p className="text-gray-600 leading-relaxed">Sunday: Closed</p>
                </motion.div>
              </div>

              <div>
                <motion.form
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100"
                  onSubmit={handleFormSubmit}
                >
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-relaxed focus:outline-none focus:shadow-outline focus:border-blue-500 transition-colors resize-vertical"
                      placeholder="Enter your message"
                    />
                  </div>

                  <button
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </motion.form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} Compsoft Communications. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
