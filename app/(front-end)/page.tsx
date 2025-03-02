import { HeroSection } from '@/components/hero-section-dark';
import {
  CheckCircle,
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      {/* Main Content */}
      {/* <HeroSection
        className="min-h-screen flex items-center justify-center"
        title="Employee Project Management System"
        subtitle={{
          regular: 'Streamline your ',
          gradient: 'project workflow',
        }}
        description="Efficiently manage employees, track projects, and boost productivity with our comprehensive project management solution."
        ctaText="Start Managing"
        ctaHref="/login?pro=true"
        // bottomImage={{
        //   light:
        //     'https://res.cloudinary.com/ducqjmtlk/image/upload/v1738096434/NUA_DEMO_2_1_kn8cwi.png',
        //   dark: 'https://res.cloudinary.com/ducqjmtlk/image/upload/v1738096434/NUA_DEMO_2_1_kn8cwi.png',
        //   // light: 'https://www.launchuicomponents.com/app-light.png',
        //   // dark: 'https://www.launchuicomponents.com/app-dark.png',
        // }}
        // gridOptions={{
        //   angle: 65,
        //   opacity: 0.4,
        //   cellSize: 50,
        //   lightLineColor: '#4a4a4a',
        //   darkLineColor: '#2a2a2a',
        // }}
      /> */}

      <main className="flex-1 max-w-5xl mx-auto">
        {/* Hero Section */}
        <section className="containers pt-24 justify-center px-4 min-h-screen items-center mx-auto flex flex-col text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Unified scheduling, seamless payroll
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 mb-12">
            Streamline your workforce management with our all-in-one solution
            for scheduling, time tracking, and payroll processing.
          </p>

          {/* Feature icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
            <div className="flex flex-col items-center p-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="4" fill="#E0E7FF" />
                  <path
                    d="M17 3H7C5.9 3 5 3.9 5 5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V5C19 3.9 18.1 3 17 3ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM16 18H8V17.1C8 15.1 10 13.5 12 13.5C14 13.5 16 15.1 16 17.1V18Z"
                    fill="#3B82F6"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold">Scheduling Tools</h3>
              <p className="text-xs text-gray-500">Plan efficiently</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="4" fill="#E0E7FF" />
                  <path
                    d="M20 6H4C2.9 6 2 6.9 2 8V16C2 17.1 2.9 18 4 18H20C21.1 18 22 17.1 22 16V8C22 6.9 21.1 6 20 6ZM20 16H4V12H20V16ZM20 10H4V8H20V10Z"
                    fill="#6366F1"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold">Employee Cards</h3>
              <p className="text-xs text-gray-500">Digital profiles</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="4" fill="#F3E8FF" />
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.41 18.09V20H10.74V18.07C9.03 17.71 7.58 16.61 7.05 14.9L9.38 14.13C9.66 15.05 10.43 15.77 12.08 15.77C13.47 15.77 14.23 15.16 14.23 14.24C14.23 13.3 13.39 12.93 11.9 12.5C10.04 11.96 7.67 11.28 7.67 8.87C7.67 7.01 9.13 5.76 10.74 5.33V3.31H13.41V5.35C14.88 5.85 15.91 7.04 16.21 8.65L14 9.37C13.74 8.52 13.1 7.79 12.06 7.79C10.88 7.79 10.24 8.34 10.24 9.15C10.24 10.11 11.2 10.41 12.97 10.93C14.93 11.47 16.9 12.22 16.9 14.56C16.9 16.84 15.17 17.74 13.41 18.09Z"
                    fill="#A855F7"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold">Tax Alerts</h3>
              <p className="text-xs text-gray-500">Stay compliant</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="bg-teal-50 p-4 rounded-lg mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="4" fill="#CCFBF1" />
                  <path
                    d="M21 18V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.9 6 10 6.9 10 8V16C10 17.1 10.9 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z"
                    fill="#14B8A6"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold">Digital Cards</h3>
              <p className="text-xs text-gray-500">Secure payments</p>
            </div>
          </div>
        </section>

        {/* App Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <h2 className="text-3xl font-bold mb-6">
                  Elevate team synergy, not just calculation
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold">Pricing</h3>
                      <p className="text-gray-500 text-sm">
                        Transparent pricing with no hidden fees
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold">Payroll</h3>
                      <p className="text-gray-500 text-sm">
                        Automated calculations and direct deposits
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold">Reports</h3>
                      <p className="text-gray-500 text-sm">
                        Comprehensive analytics and insights
                      </p>
                    </div>
                  </div>
                </div>

                <button className="mt-8 inline-flex h-10 items-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white">
                  Learn More
                </button>
              </div>

              <div className="md:w-1/2">
                <div className="relative">
                  <Image
                    src="/logo.svg"
                    width={300}
                    height={600}
                    alt="Mobile app interface"
                    className="mx-auto"
                  />
                  {/* Adding phone content as an overlay */}
                  <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 w-[85%] bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Payroll Summary</span>
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          March
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-red-600">JS</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">John Smith</div>
                          <div className="text-xs text-gray-500">
                            Full-time, $3,200/mo
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600">AC</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Amy Cooper</div>
                          <div className="text-xs text-gray-500">
                            Part-time, $22/hr
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-indigo-600">
                    3.4
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Average hours saved per week
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-blue-500">1.4</span>
                </div>
                <p className="text-sm text-gray-500">
                  Million transactions processed
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-teal-500">
                    1.04M
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Saving $40K+ for restaurants with our expertise
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-purple-500">
                    99%
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Customer satisfaction rate
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16" id="testimonials">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-12">
              Our happy users
            </h2>

            <div className="max-w-3xl mx-auto relative">
              <div className="bg-white rounded-xl shadow-sm p-8 relative z-10">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Image
                      src="/logo.svg"
                      width={60}
                      height={60}
                      alt="User testimonial"
                      className="rounded-full"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl text-gray-800 mb-2">"</div>
                    <p className="text-gray-600 mb-4">
                      The payroll system simplified our processes enormously.
                      We've saved hours of admin work each week and reduced
                      errors substantially.
                    </p>
                    <div className="font-medium">Maria J.</div>
                    <div className="text-sm text-gray-500">
                      HR Director, Resto Group
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative user avatars */}
              <div className="absolute -bottom-6 -left-6 z-0">
                <Image
                  src="logo.svg"
                  width={48}
                  height={48}
                  alt="User avatar"
                  className="rounded-full border-2 border-white"
                />
              </div>
              <div className="absolute -top-4 -right-6 z-0">
                <Image
                  src="logo.svg"
                  width={40}
                  height={40}
                  alt="User avatar"
                  className="rounded-full border-2 border-white"
                />
              </div>
              <div className="absolute top-1/2 -right-10 z-0">
                <Image
                  src="logo.svg"
                  width={52}
                  height={52}
                  alt="User avatar"
                  className="rounded-full border-2 border-white"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16" id="contact">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start">
              <div className="md:w-1/3 mb-8 md:mb-0 md:pr-12">
                <h2 className="text-2xl font-bold mb-4">
                  We value your input.
                  <br />
                  Share with us!
                </h2>
                <p className="text-gray-500 mb-6">
                  Your feedback helps us improve our service and better meet
                  your needs.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-500 text-sm">
                        24/7 Customer Support
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-500 text-sm">
                        Dedicated Account Manager
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="company"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Company
                        </label>
                        <input
                          type="text"
                          id="company"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex w-full justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary/70 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-2">
              Quick FAQs for instant clarity
            </h2>
            <p className="text-gray-500 text-center mb-12">
              Find answers to common questions about our payroll solution
            </p>

            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center cursor-pointer">
                    <h3 className="font-medium">Is there a free trial?</h3>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center cursor-pointer">
                    <h3 className="font-medium">
                      Can data be imported from other systems?
                    </h3>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center cursor-pointer">
                    <h3 className="font-medium">
                      What security measures are in place?
                    </h3>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center cursor-pointer">
                    <h3 className="font-medium">Do you provide feedback?</h3>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </main>
  );
}
