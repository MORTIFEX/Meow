# BENOTEK-BAU Kft. Weboldal — PRD

## Problem Statement
Hungarian website for BENOTEK-BAU Kft., a cementes gépi vakolás (cement-based machine plastering) company. Three pages: Főoldal, Szolgáltatások (with detailed price calculator), Kapcsolat (with form that emails the company).

## Architecture
- **Backend**: FastAPI (Python) + MongoDB + Resend (transactional email)
- **Frontend**: React 19, Tailwind CSS, shadcn/ui, React Router
- **Hosting**: Emergent preview (production deploy + custom domain pending user action)

## Personas
- Family home owner needing wall plastering quote
- Industrial/commercial project manager
- Renovation contractor

## Core Requirements (static)
1. Three-page Hungarian website (Főoldal / Szolgáltatások / Kapcsolat)
2. Detailed cement plastering price calculator with 20 service items
3. Contact form sending email to info.benotekbau@gmail.com via Resend
4. Industrial professional design (orange #F97316 accent, not too dark)
5. Mobile-responsive, SEO-ready

## What's Been Implemented
- 2026-02 (iter 1): Initial 3-page site, Resend integration, simple calculator (3500 Ft/m²)
- 2026-02 (iter 2): Expanded calculator with 20 service items, checkboxes, "Select all" toggle, percentage modifiers applied to munkadíj, custom items (egyedi ár), fixed gép kiszállás, range pricing 2500–4000 Ft/m², proper plastering images (Pexels 5493665, 10383588, 5493658), Hungarian SEO meta tags + JSON-LD LocalBusiness schema in index.html, disclaimer text shown

## Backlog (P0/P1/P2)
- **P1**: Production deployment to Emergent + custom domain (benotekbau.hu) via Entri DNS
- **P1**: Photo gallery of completed projects (before/after)
- **P2**: Testimonials section (client reviews)
- **P2**: Blog / SEO articles for organic search ranking
- **P2**: Service area map (which Hungarian counties served)
- **P2**: Multi-language: add EN/DE for foreign customers
- **P2**: Google Analytics / Search Console verification meta tag

## Next Tasks
1. Deploy to production (Emergent Deploy button) — auto-removes "Made with Emergent" badge
2. Connect benotekbau.hu domain via Entri integration in deployment dashboard
3. Submit sitemap to Google Search Console for SEO indexing
