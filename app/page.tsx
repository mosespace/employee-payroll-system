import { HeroSection } from '@/components/hero-section-dark';

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      {/* Main Content */}
      <HeroSection
        className="min-h-screen flex items-center justify-center"
        title="Employee Project Management System"
        subtitle={{
          regular: 'Streamline your ',
          gradient: 'project workflow',
        }}
        description="Efficiently manage employees, track projects, and boost productivity with our comprehensive project management solution."
        ctaText="Start Managing"
        ctaHref="/dashboard?pro=true"
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
      />
    </main>
  );
}
