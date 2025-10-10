# Celer Landing Page

## Overview
A cinematic, minimal landing page for Celer, the world's first end-to-end multiomics copilot. The site combines elegant simplicity with organic, biologically inspired neuron-firing animations that symbolize connected intelligence and scientific precision.

**Tech Stack:**
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (Custom dark theme)
- Framer Motion (Scroll animations, transitions)
- React Three Fiber + Three.js (3D neuron network)
- @react-three/postprocessing (Bloom, Depth of Field effects)
- Inter font (ExtraBold / Regular)

## Project Structure
```
├── app/
│   ├── api/waitlist/route.ts    # Waitlist form API endpoint
│   ├── page.tsx                  # Main landing page
│   ├── layout.tsx                # Root layout with metadata
│   └── globals.css               # Global styles with Tailwind
├── components/
│   ├── NeuronNetwork.tsx         # 3D neuron animation (WebGL + fallback)
│   ├── Header.tsx                # Fixed header with logo & navigation
│   ├── Hero.tsx                  # Hero section with headline & CTAs
│   ├── AboutCeler.tsx            # About section with content
│   ├── HowItWorks.tsx            # 3-step animated workflow
│   ├── MissionVision.tsx         # Mission & vision statements
│   ├── LogoMarquee.tsx           # Infinite scrolling logo marquee
│   ├── WaitlistForm.tsx          # Email signup form
│   └── Footer.tsx                # Footer with social links
└── public/
    └── c-logo-3d-purple-black-2048.png  # Celer 3D logo
```

## Key Features

### 3D Neuron Network Animation
- 90 nodes (spheres) connected by curved Bezier filaments
- Realistic biological firing patterns with staggered activations
- Bloom and depth of field post-processing effects
- Automatic fallback to CSS animation when WebGL is unavailable
- OrbitControls with auto-rotation for gentle camera movement

### Content Sections
1. **Hero**: Main headline, subheadline, and dual CTAs
2. **About**: Platform overview with "raw data to discovery in hours" messaging
3. **How It Works**: 3-step animated workflow (Pull → Analyze → Visualize)
4. **Mission & Vision**: Company mission and vision statements
5. **Logo Marquee**: Institutional partners (Harvard, Yale, Duke, etc.)
6. **Waitlist Form**: Email signup with validation and success toast
7. **Footer**: Social links and copyright

### Design System
- **Background**: #0B0F19
- **Primary**: #7C3AED (purple)
- **Accent**: #A78BFA (light purple)
- **Text Primary**: #F9FAFB (white)
- **Text Muted**: #CBD5E1 (gray)

## Development

**Run Development Server:**
```bash
npm run dev
```
Server runs on http://localhost:5000

**Build for Production:**
```bash
npm run build
npm start
```

## Recent Changes (Oct 10, 2025)
- ✅ Initial implementation of all landing page sections
- ✅ 3D neuron network with WebGL and fallback support
- ✅ Framer Motion scroll-triggered animations throughout
- ✅ Functional waitlist API endpoint with validation
- ✅ Responsive design with dark theme
- ✅ Added `sizes` prop to header logo for performance optimization

## Known Issues & Future Enhancements
1. **Waitlist Persistence**: Currently logs to console only. Need to integrate with database or email service (SendGrid/Mailchimp).
2. **Email Validation**: Basic "@" check. Should add regex validation for proper email format.
3. **Mobile Performance**: May need to reduce neuron count or optimize geometries for better mobile frame rates.
4. **Analytics**: No tracking implemented yet. Consider adding Google Analytics or similar.

## Architecture Decisions
- **WebGL Fallback**: Implemented CSS-based pulsing dots fallback for environments without WebGL support
- **Animation Strategy**: Used `whileInView` instead of `animate` for Framer Motion to ensure animations trigger properly in Next.js
- **Component Organization**: Each section is a separate component for maintainability
- **API Design**: Simple POST endpoint for MVP, designed for easy integration with email services later

## Deployment
Ready for Vercel deployment. No environment variables required for MVP (waitlist just logs to console).

For production:
- Add email service integration (SendGrid, Mailchimp, etc.)
- Set up proper database for waitlist storage
- Configure analytics tracking
- Add SEO metadata and Open Graph tags
