// Static website JavaScript functionality
document.addEventListener("DOMContentLoaded", () => {
  // Initialize smooth scrolling with Lenis
  const Lenis = window.Lenis // Assuming Lenis is available globally or imported
  const lenis = new Lenis({
    lerp: 0.08,
    duration: 1.2,
    smoothWheel: true,
    smoothTouch: true,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  // Register GSAP plugins
  const gsap = window.gsap // Assuming gsap is available globally or imported
  const ScrollTrigger = window.ScrollTrigger // Assuming ScrollTrigger is available globally or imported
  gsap.registerPlugin(ScrollTrigger)

  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  initializeMobileMenu()

  // Initialize animations
  initializeAnimations()

  // Populate dynamic content
  populateServices()
  populateSolutions()
  populateClients()

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        lenis.scrollTo(target)
        closeMobileMenu()
      }
    })
  })
})

function initializeMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn")
  const mobileMenu = document.getElementById("mobile-menu")
  const hamburgerLine1 = document.getElementById("hamburger-line-1")
  const hamburgerLine2 = document.getElementById("hamburger-line-2")
  const hamburgerLine3 = document.getElementById("hamburger-line-3")

  let isMenuOpen = false

  // Mobile menu toggle functionality
  mobileMenuBtn.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen
    toggleMobileMenu(isMenuOpen)
  })

  // Close mobile menu when clicking on mobile nav links
  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      isMenuOpen = false
      toggleMobileMenu(false)
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (isMenuOpen && !mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      isMenuOpen = false
      toggleMobileMenu(false)
    }
  })

  // Close mobile menu on window resize to desktop size
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && isMenuOpen) {
      isMenuOpen = false
      toggleMobileMenu(false)
    }
  })

  function toggleMobileMenu(open) {
    if (open) {
      // Open menu
      mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px"
      mobileMenu.style.opacity = "1"

      // Animate hamburger to X
      hamburgerLine1.style.transform = "rotate(45deg) translateY(6px)"
      hamburgerLine2.style.opacity = "0"
      hamburgerLine3.style.transform = "rotate(-45deg) translateY(-6px)"
    } else {
      // Close menu
      mobileMenu.style.maxHeight = "0"
      mobileMenu.style.opacity = "0"

      // Animate X back to hamburger
      hamburgerLine1.style.transform = "rotate(0) translateY(0)"
      hamburgerLine2.style.opacity = "1"
      hamburgerLine3.style.transform = "rotate(0) translateY(0)"
    }
  }
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu")
  const hamburgerLine1 = document.getElementById("hamburger-line-1")
  const hamburgerLine2 = document.getElementById("hamburger-line-2")
  const hamburgerLine3 = document.getElementById("hamburger-line-3")

  if (mobileMenu) {
    mobileMenu.style.maxHeight = "0"
    mobileMenu.style.opacity = "0"

    hamburgerLine1.style.transform = "rotate(0) translateY(0)"
    hamburgerLine2.style.opacity = "1"
    hamburgerLine3.style.transform = "rotate(0) translateY(0)"
  }
}

function initializeAnimations() {
  // Hero section animations
  const gsap = window.gsap // Assuming gsap is available globally or imported
  gsap.fromTo("#hero-title", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, delay: 0.3 })

  gsap.fromTo("#hero-subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, delay: 0.5, duration: 0.8 })

  gsap.fromTo("#hero-description", { opacity: 0, y: 30 }, { opacity: 1, y: 0, delay: 0.6, duration: 0.8 })

  gsap.fromTo("#hero-cta", { opacity: 0, y: 30 }, { opacity: 1, y: 0, delay: 0.9, duration: 0.8 })

  // Section animations
  gsap.utils.toArray("section").forEach((section, index) => {
    gsap.fromTo(
      section,
      { autoAlpha: 0, y: 60 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    )
  })

  // Parallax effects - Made responsive for mobile
  const mm = gsap.matchMedia()

  mm.add("(min-width: 768px)", () => {
    // Desktop parallax effects
    gsap.to("#hero-title", {
      yPercent: -25,
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    })

    gsap.to("#hero-subtitle", {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    })
  })

  mm.add("(max-width: 767px)", () => {
    // Mobile - reduced parallax effects for better performance
    gsap.to("#hero-title", {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
      },
    })

    gsap.to("#hero-subtitle", {
      yPercent: -5,
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
      },
    })
  })

  // Service card animations
  gsap.utils.toArray(".service-card").forEach((card, index) => {
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
}

function populateServices() {
  const services = [
    {
      title: "Connectivity Solutions",
      description: "Reliable and high-speed connectivity to keep your business connected.",
      features: ["DSL/ADSL/SAIX", "Fiber & Metro Ethernet", "Wireless Solutions", "MPLS Networks"],
      color: "red",
    },
    {
      title: "Collaboration",
      description: "Enhance teamwork and communication with our integrated collaboration tools.",
      features: ["PABX Systems", "Video Conferencing", "Unified Communications", "Mobile Integration"],
      color: "blue",
    },
    {
      title: "Data Center Solutions",
      description: "Secure and scalable data center solutions to support your business growth.",
      features: ["Cisco UCS", "Storage Solutions", "Virtualization", "Cloud Migration"],
      color: "red",
    },
    {
      title: "Converged Security",
      description: "Comprehensive security solutions to protect your business assets and data.",
      features: ["Access Control", "Surveillance", "Network Security", "Fire Detection"],
      color: "blue",
    },
    {
      title: "Network Solutions",
      description: "Expert network solutions to optimize performance and ensure reliability.",
      features: ["Network Design", "Optimization", "Management", "Support"],
      color: "red",
    },
    {
      title: "Contact Centre",
      description: "Advanced solutions to enhance customer service and support.",
      features: ["Call Recording", "Quality Assurance", "Analytics", "Training"],
      color: "blue",
    },
  ]

  const servicesContainer = document.querySelector("#services .grid")
  servicesContainer.innerHTML = services
    .map(
      (service) => `
        <div class="service-card bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500 p-8 border border-gray-100">
            <div class="w-16 h-16 bg-gradient-to-br ${service.color === "red" ? "from-red-500 to-red-600" : "from-blue-500 to-blue-600"} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-900 group-hover:text-${service.color}-600 transition-colors">
                ${service.title}
            </h3>
            <p class="text-gray-600 leading-relaxed mb-6">${service.description}</p>
            <ul class="space-y-2">
                ${service.features
                  .map(
                    (feature) => `
                    <li class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 text-${service.color}-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        ${feature}
                    </li>
                `,
                  )
                  .join("")}
            </ul>
        </div>
    `,
    )
    .join("")
}

function populateSolutions() {
  const solutionsContainer = document.querySelector("#solutions .max-w-7xl")
  solutionsContainer.innerHTML += `
        <div class="space-y-16">
            <div>
                <h3 class="relative mb-8 text-3xl font-bold tracking-tight after:absolute after:bottom-[-8px] after:left-0 after:h-1 after:w-16 after:bg-gradient-to-r after:from-red-500 after:to-blue-600 after:rounded-full">
                    Connectivity
                </h3>
                <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                    ${[
                      {
                        title: "Last Mile Connectivity",
                        description:
                          "Reliable and high-speed connectivity solutions to keep your business connected, ensuring uptime and performance.",
                      },
                      {
                        title: "Voice and Data",
                        description:
                          "Integrated voice and data solutions for seamless communication and efficient operational workflow.",
                      },
                      {
                        title: "Business Internet Access",
                        description:
                          "High-speed, dedicated internet access tailored for business needs, providing stability and security.",
                      },
                      {
                        title: "Virtual Private Network",
                        description:
                          "Secure and private network solutions for multi-site businesses, guaranteeing data integrity and confidentiality.",
                      },
                    ]
                      .map(
                        (solution) => `
                        <div class="flex items-start gap-4 rounded-2xl border border-red-100 bg-white/80 backdrop-blur-sm p-6 transition-all hover:shadow-2xl hover:-translate-y-1">
                            <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 class="text-lg font-bold mb-2 text-gray-900">${solution.title}</h4>
                                <p class="text-sm text-gray-600">${solution.description}</p>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>

            <div>
                <h3 class="relative mb-8 text-3xl font-bold tracking-tight after:absolute after:bottom-[-8px] after:left-0 after:h-1 after:w-16 after:bg-gradient-to-r after:from-blue-500 after:to-red-500 after:rounded-full">
                    Data Center Solutions
                </h3>
                <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                    ${[
                      {
                        title: "Computing",
                        description:
                          "Powerful and scalable computing resources to handle your most demanding applications and workloads.",
                      },
                      {
                        title: "Storage",
                        description:
                          "Secure, reliable, and high-performance storage solutions to manage and protect your critical business data.",
                      },
                      {
                        title: "Virtualization",
                        description:
                          "Optimize your IT infrastructure with our virtualization services, improving efficiency and reducing costs.",
                      },
                      {
                        title: "Cloud & Hosted Services",
                        description:
                          "Flexible and scalable cloud and hosted services to support your business's growth and digital transformation.",
                      },
                    ]
                      .map(
                        (solution) => `
                        <div class="flex items-start gap-4 rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-sm p-6 transition-all hover:shadow-2xl hover:-translate-y-1">
                            <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2-2V6a2 2 0 002-2h14a2 2 0 002 2v4a2 2 0 00-2 2m-2-4h.01M17 16h.01"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 class="text-lg font-bold mb-2 text-gray-900">${solution.title}</h4>
                                <p class="text-sm text-gray-600">${solution.description}</p>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `
}

function populateClients() {
  const clientsContainer = document.querySelector("#clients-and-partners .max-w-7xl")
  clientsContainer.innerHTML += `
        <div class="text-center mb-12">
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                We are proud to collaborate with a diverse range of clients and partners who are leaders in their respective industries.
            </p>
        </div>

        <div class="mb-20">
            <h3 class="text-center text-3xl font-extrabold tracking-tight text-gray-900 mb-10">Notable Clients</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                ${[
                  {
                    name: "Standard Bank",
                    logo: "https://ik.imagekit.io/1ejspnv0y/clients/png-clipart-standard-bank-namibia-south-africa-investment-bank-blue-text.png?updatedAt=1757199077899",
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
                ]
                  .map(
                    (client) => `
                    <div class="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all hover:shadow-3xl hover:scale-105 hover:-translate-y-1">
                        <div class="h-16 w-16 flex items-center justify-center">
                            <img src="${client.logo}" alt="${client.name} Logo" class="max-h-16 max-w-16 object-contain">
                        </div>
                        <h3 class="text-center text-sm font-semibold text-gray-700">${client.name}</h3>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>

        <div>
            <h3 class="text-center text-3xl font-extrabold tracking-tight text-gray-900 mb-10">Key Vendors & Strategic Partners</h3>
            <div class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-8 items-center justify-center">
                ${[
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
                ]
                  .map(
                    (partner) => `
                    <div class="flex items-center justify-center p-4 bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:scale-110 hover:-translate-y-1">
                        <img src="${partner.logo}" alt="${partner.name} Logo" class="h-12 max-w-20 object-contain">
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>

        <div class="mt-20 text-center">
            <p class="mx-auto max-w-2xl text-2xl font-semibold leading-relaxed text-gray-800">
                Join these industry leaders who trust Compsoft Communications to deliver innovative ICT solutions that drive business success.
            </p>
        </div>
    `
}
