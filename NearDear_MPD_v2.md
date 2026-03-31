# NearDear.in — Master Product Document
## Version 2.0 | March 2026 | Private & Confidential
## This document is the single source of truth for all development.
## Hand this to Claude Code at the start of every build session.

---

> **THE FOUNDING PRINCIPLE — NEVER COMPROMISE THIS:**
> *"How do we create a platform where vulnerable people can receive
> human help with the maximum possible safety, traceability,
> dignity, and accountability?"*
>
> Every feature. Every policy. Every line of code.
> Must be held against this question.

---

## QUICK REFERENCE FOR CLAUDE CODE

```
Platform:        NearDear.in
Domain:          neardear.in (primary) | neardear.com (redirect)
Admin:           admin.neardear.in
Phase 1 Cities:  Ahmedabad + Gandhinagar only
Languages:       English + Gujarati (toggle)
Framework:       Next.js 14 App Router + TypeScript (strict)
Database:        Neon PostgreSQL + Prisma ORM
Auth:            Auth.js — Phone OTP for all users
                 Email + Password + 2FA for Admin only
Payments:        Razorpay (INR only)
AI:              Anthropic Claude (claude-haiku-4-5-20251001)
Email:           Resend (transactional)
Storage:         Cloudflare R2 (documents, photos)
Hosting:         Netlify
Mobile:          Expo + React Native (Android first)
Earnings split:  80% Companion / Advisor | 20% Platform
```

---

## TABLE OF CONTENTS

1. Vision & The Two Taglines
2. Brand Identity — Colors, Typography, Logo
3. All Stakeholders — Defined
4. Platform Architecture — Two Layers
5. Service Catalogue — All 14 Services
6. Phase 1 Geography — Ahmedabad + Gandhinagar
7. Hero Page — Complete Word-for-Word Specification
8. User Journeys — All Roles
9. Onboarding Flows — All Roles
10. The Match-Trigger Notification Flow
11. Session Protocol — Non-Negotiable
12. Safety Framework — X Y Z Verification
13. The Trust Ladder — Level 0 to 3
14. Provider Account — Pause and Cancel
15. Revenue Model and Earnings
16. Language System — English + Gujarati
17. Notification Framework
18. Security Framework — All 20 Points
19. Mobile App Specification
20. Web Platform — All Pages
21. Admin Panel Specification
22. Tech Stack — Every Decision Justified
23. Database Schema — Prisma (Complete)
24. Environment Variables — Master List
25. CTA Master List — Every Button on Every Screen
26. Content and Copy Principles
27. Build Order and Timeline
28. Future Roadmap

---

## 1. VISION & THE TWO TAGLINES

### What NearDear.in Is

India's first human-presence marketplace. Connects vulnerable
people — elders, isolated individuals, students in new cities,
families in distress — with verified, trained human companions
and professional advisors across India.

Not a medical service. Not a staffing agency.
Not AI replacing humans.
The opposite: a platform that holds space for real human beings
in an age that is rapidly forgetting how essential they are.

### The Two Sentences That Define Everything

**For those who need help:**
> "If your parents are alone back home —
>  find your trustworthy NearDear."

**For those who can help:**
> "If skill, empathy, and time are with you —
>  contribute. The portal pays 80% of every
>  session directly to you."

### The Societal Wound We Are Responding To

- 140 million Indians above 60. Majority without nearby family.
- Children in Bengaluru, Dubai, Toronto. Parents in Rajkot.
- Joint families dissolved. No one to handle the doctor visit.
- Young professionals alone in new cities. No mohalla, no familiar face.
- Grief with no infrastructure. Relatives for 13 days. Then nothing.
- Loneliness — the fastest-growing health crisis of our generation.

### The Brand Tagline

> "Someone near. Someone dear."

---

## 2. BRAND IDENTITY

### Platform Name Rules

- Always written: **NearDear** (capital N, capital D, no space)
- In Gujarati script: **નિયરડિયર** (transliterated — NEVER translated)
- Domain: neardear.in
- The brand name is NEVER translated into any language.
  It is always transliterated to preserve sound and identity.

---

### Color Palette

#### Primary Colors

| Name | Hex | Usage |
|---|---|---|
| NearDear Saffron | #E07B2F | ALL primary CTAs, buttons, highlights |
| NearDear Teal | #1A6B7A | Trust badges, verification, headers |
| Warm Cream | #FEF8F0 | ALL page backgrounds (never pure white) |
| Deep Night | #1C2B3A | ALL primary text (never pure black) |

#### Secondary Colors

| Name | Hex | Usage |
|---|---|---|
| Sage Green | #4A8C6F | Companion/care elements, success states |
| Warm Gold | #F0B429 | Earnings, premium indicators |
| Soft Coral | #E85D4A | Alerts, urgent flags, concern states |
| Gentle Lavender | #8B7EC8 | Professional advisory layer |

#### Neutral Colors

| Name | Hex | Usage |
|---|---|---|
| Pure White | #FFFFFF | Cards, modals, surfaces |
| Light Warm Gray | #E8E0D8 | Borders, dividers |
| Medium Gray | #9CA3AF | Secondary text, placeholders |
| Warm Gray | #6B7280 | Body text secondary |

#### Color Rules (Never Break These)

- Saffron = action. Every primary CTA. No exceptions.
- Teal = trust. Every verification badge. Safety signals. Admin approvals.
- Cream = warmth. Never pure white for page backgrounds.
- Deep Night = grounding. Never pure black for text.
- Sage Green = care. Companion elements only.
- Lavender = expertise. Professional advisor elements only.

---

### Typography

| Role | Font | Weight |
|---|---|---|
| Display / Hero headlines | Playfair Display | 700 Bold |
| Section headings | Playfair Display | 600 SemiBold |
| Body copy | DM Sans | 400 Regular |
| Labels, strong copy | DM Sans | 600 SemiBold |
| Prices, earnings, numbers | DM Mono | 500 Medium |
| Gujarati text | Hind Vadodara | 400 / 600 |

---

### Logo

Two overlapping circles — one representing the person who needs
help, one representing the person who provides it.
Where they overlap: the platform.
Rendered in Saffron (#E07B2F) and Teal (#1A6B7A).
Readable at 16px on a mobile notification.

---

## 3. ALL STAKEHOLDERS — DEFINED

### Primary (Direct Platform Users)

#### Service Receiver
Person who needs help — for themselves or someone they care for.

Sub-types:
- Distant Family Member — NRI or outstation Indian managing
  elder care remotely. Largest paying segment.
- The Elder Themselves — independently booking own care.
- One-Time Need Person — single request, may not return.
- Recurring Relationship Builder — same companion, every week.

Core need: Safe, trustworthy, local human help. Reliably.

---

#### The Elder / Recipient
The human being actually receiving care. Often distinct from
the account holder (their child may be in another city).
The most vulnerable person in the system.
Protected above all others.
Core need: Dignity. Presence. Practical help.
Not to feel like a burden.

---

#### Solo Companion
Individual verified person offering human support services
in their local area. Can be:
- Homemaker with free mornings
- Retired professional
- Young person with a car and empathy
- Student with local knowledge
- Anyone with character, capacity, and time

The barrier to entry is character + capacity + location.
Not a degree.

Core need: Meaningful income, flexible hours, sense of purpose.

---

#### Team Operator
Registered operator who builds and manages a small team
of Companions under one provider account.
Operator clears full verification first.
Each team member clears their own verification individually.
Think: local franchise model without franchise complexity.

---

#### Team Companion (under Operator)
Individual Companions under a Team Operator account.
Each clears own verification.
Sessions tracked individually.
Earnings tracked individually.

---

#### Professional Advisor
Qualified professional offering expert advisory sessions online.
Layer 1 of the platform.
Credential-verified. Fee-for-session. Online only.

Categories: Education | Finance | Legal | Immigration |
Career | Real Estate | Technology | Mental Wellness |
General Consulting

---

#### Admin
Platform owner/operator. Controls everything.
Web panel only (admin.neardear.in).
Email + Password + 2FA. No self-registration.
Accounts created by platform owner only.

---

### Secondary Stakeholders

#### Family Member (Co-Principal)
Adult child or responsible family member who creates the
elder's profile, pays for sessions, monitors all activity.
May be in a different city or country.
Has equal standing to the Elder as decision-maker.
Receives every session notification. Can terminate any
Companion instantly. No explanation required.

---

#### Character References
Two personal (non-professional) references per Companion.
Platform calls both. Structured 5-question call.
Their response is a verification input — not a formality.

---

#### Companion Community
Peer network of active Companions. Support each other.
Flag concerns. Share experiences. Hold each other accountable.
Platform facilitates. Does not control.

---

### External / Institutional Stakeholders

#### Aadhaar / UIDAI
Identity verification for all Service Providers.
Platform collects Aadhaar number.
Verifies via DigiLocker API or UIDAI sandbox.
Stores ONLY: verification status + last 4 digits.
NEVER stores full Aadhaar number.
NEVER stores biometric data.

#### Police Verification Authority
All Companions must submit valid Police Clearance Certificate.
V1: self-uploaded PCC, admin-reviewed.
V2: state police API integration where available.
Must be renewed annually.
Account auto-paused if PCC expired and not renewed.

#### Razorpay
All payments flow through Razorpay.
User/family pays full fee.
Platform holds payment.
80% released to Companion after session confirmation.
20% retained by platform.
Webhook signature verified on every event. Always.

#### DigiLocker
For Professional Advisors: degree certificates,
Bar Council, ICAI, Medical Council verification.

---

## 4. PLATFORM ARCHITECTURE — TWO LAYERS

### Layer 1 — Professional Advisory
The rational layer. Expert guidance from verified professionals.
Online sessions via Zoom / Google Meet / external links.
Portal handles: matching, booking, payment, history.
Portal does NOT host the session.
Advisor earnings: 80%. Platform: 20%.
Visual identity: Lavender (#8B7EC8) accent.

### Layer 2 — Human Support Services (Presence Services)
The soul of the platform.
Not advice — presence, care, accompaniment, action.
Real people who show up when the family cannot.
Can be in-person, remote, or errand-based.
Portal handles: matching, booking, payment, check-in/out
protocol, session notes, family notifications, safety monitoring.
Companion earnings: 80%. Platform: 20%.
Visual identity: Sage Green (#4A8C6F) accent.

### The Provider Skill Spectrum

Providers are NOT one type. They exist on a spectrum:

```
HARD SKILLS HEAVY          SOFT SKILLS HEAVY
────────────────────────────────────────────
Four-wheeler driver        Empathetic listener
Computer expert            Patient companion
Medical background         Warm presence
Legal knowledge            Emotionally mature
Financial literacy         Good communicator
Govt office navigation     Culturally sensitive
Multilingual               Calm under pressure
First aid trained          Reliable

BOTH ENDS ARE VALID. BOTH ARE NEEDED.
The platform honours both equally.
```

---

## 5. SERVICE CATALOGUE — ALL 14 SERVICES

### How Services Are Structured

Every service has:
- Description for providers (what is expected of them)
- Description for receivers (what they will receive)
- Minimum Trust Level required
- Mode: Remote / In-person / Both
- Suggested fee range (admin-configurable by city)
- Hard skill tags
- Soft skill tags
- Service cluster

---

### Cluster A — Presence Services

**A1. Elder Support Visit**
Provider description: Scheduled home visit. Sit, converse,
observe wellbeing, submit a structured note to family after.
Receiver description: A trusted person visits your parent,
spends real time with them, and sends you a note.
Mode: In-person | Min Trust: Level 2
Fee: ₹600–₹900/visit | Companion earns: ₹480–₹720

**A2. Check-on-Parents**
Provider description: Welfare visit for parents whose family
is away. GPS check-in required. Report sent to family.
Receiver description: Someone visits your parent, confirms
they are well, and sends you a report. From anywhere in world.
Mode: In-person | Min Trust: Level 2
Fee: ₹500–₹800/visit | Companion earns: ₹400–₹640

**A3. Companion Visit**
Provider description: Extended presence. Not task-based.
Simply being there. For isolated elders or those in recovery.
Receiver description: Someone who simply sits with your
loved one. Talks. Listens. Is present.
Mode: In-person | Min Trust: Level 2
Fee: ₹700–₹1,000/visit | Companion earns: ₹560–₹800

**A4. Local Representative**
Provider description: Ongoing eyes-and-ears for a family
managing affairs from a distance. High reliability required.
Receiver description: Someone who represents your family
locally for any matter — property, offices, errands.
Mode: In-person | Min Trust: Level 3
Fee: ₹1,000–₹2,000/day | Companion earns: ₹800–₹1,600

**A5. Event Assistance**
Provider description: Accompany elder to weddings, funerals,
religious events when family cannot attend.
Receiver description: Your parent attends the family event
with a trusted companion by their side.
Mode: In-person | Min Trust: Level 2
Fee: ₹1,000–₹2,500/event | Companion earns: ₹800–₹2,000

---

### Cluster B — Navigation Services

**B1. Hospital Guidance Help**
Provider description: Accompany to hospital. Help understand
doctors, manage paperwork, queues. Half-day commitment.
Receiver description: Someone who goes with your parent to
the hospital and makes sure they are not alone or confused.
Mode: In-person | Min Trust: Level 1
Fee: ₹800–₹1,200/visit | Companion earns: ₹640–₹960

**B2. Document Help**
Provider description: Assist with form filling, photocopying,
submitting applications. Basic literacy required.
Receiver description: Someone who helps with any paperwork
that feels overwhelming.
Mode: In-person | Min Trust: Level 1
Fee: ₹400–₹700/session | Companion earns: ₹320–₹560

**B3. Bank Work Help**
Provider description: Accompany to bank. Assist transactions,
passbook updates, FD renewals. Bank familiarity helpful.
Receiver description: Someone who goes to the bank with your
parent so they are not confused or alone.
Mode: In-person | Min Trust: Level 1
Fee: ₹400–₹700/session | Companion earns: ₹320–₹560

**B4. Government Office Help**
Provider description: Assist at municipal, ration, pension,
Aadhaar offices. Knowledge of local offices helpful.
Receiver description: Someone who handles the government
office visit so your parent does not have to go alone.
Mode: In-person | Min Trust: Level 1
Fee: ₹500–₹800/session | Companion earns: ₹400–₹640

**B5. Property Visit Help**
Provider description: Accompany for site visits or represent
family locally at property matters. Discretion essential.
Receiver description: Someone who visits a property on your
behalf or goes with your parent for any property matter.
Mode: In-person | Min Trust: Level 2
Fee: ₹800–₹1,500/visit | Companion earns: ₹640–₹1,200

---

### Cluster C — Continuity Services

**C1. Medicine Pickup Help**
Provider description: Collect prescription medicines. Verify
dosage. Deliver to home. Vehicle strongly recommended.
Receiver description: Someone who collects medicines from
the chemist and delivers them to your parent's door.
Mode: In-person | Min Trust: Level 1
Fee: ₹300–₹500/pickup | Companion earns: ₹240–₹400

**C2. Travel Assistance**
Provider description: Accompany to airport or station. Help
with boarding for elderly or unwell. Vehicle required.
Receiver description: Someone who takes your parent safely
to the airport or station and stays until they board.
Mode: In-person | Min Trust: Level 1
Fee: ₹1,000–₹2,000/trip | Companion earns: ₹800–₹1,600

**C3. Grocery & Essentials Assist**
Provider description: Help with essential shopping or
delivery coordination. Vehicle helpful.
Receiver description: Someone who helps your parent with
groceries and essential purchases.
Mode: In-person | Min Trust: Level 1
Fee: ₹300–₹500/run | Companion earns: ₹240–₹400

---

### Cluster D — Connection Services

**D1. Talk / Emotional Support**
Provider description: Scheduled voice/video conversation.
Not therapy. Not advice. Just human presence that listens.
Empathy is everything here.
Receiver description: A real human who listens. No judgment.
No advice unless asked. Just presence.
Mode: Remote | Min Trust: Level 0
Fee: ₹250–₹400/session | Companion earns: ₹200–₹320

**D2. Student Support — New City**
Provider description: First-week anchor for students arriving
somewhere alone. Familiarity with the city helpful.
Receiver description: Someone who helps a student navigate
a new city — accommodation, essentials, orientation.
Mode: Both | Min Trust: Level 0
Fee: ₹300–₹600/session | Companion earns: ₹240–₹480

**D3. Grief Companion**
Provider description: Presence during loss. Calm,
non-judgmental human witness. Emotional maturity essential.
Receiver description: Someone who simply sits with you or
your family during a difficult time. No fixing. Just presence.
Mode: Both | Min Trust: Level 1
Fee: ₹400–₹700/session | Companion earns: ₹320–₹560

**D4. First Contact / Needs Assessment**
Provider description: First conversation with a vulnerable
person. Listen, map their needs, recommend right services.
Our most trusted companions only.
Receiver description: Not sure what you need?
Talk to someone first. They will help you figure it out.
Mode: Both | Min Trust: Level 3
Fee: ₹200–₹350/session | Companion earns: ₹160–₹280

---

### What All Services Explicitly Are NOT

Every service page, booking confirmation, and Companion
orientation states this clearly — not in fine print:

- NOT medical treatment or diagnosis
- NOT legal representation or advice
- NOT financial advice
- NOT domestic or household labour
- NOT emergency response (call 112 for emergencies)
- NOT therapy or clinical counselling

---

### Service Selection — Checkbox Architecture

**Provider side (application form):**
Every service shown as a checkbox with the provider
description visible. Companion selects all they can offer.
For each selected service:
- Experience level: First time / Some experience / Confident
- Personal statement: 2 lines — why I can offer this

**Receiver side (request form):**
Every service shown as a checkbox with the receiver
description visible. Can select multiple.
Last option always: "I am not sure — help me figure out
what I need" → routes to First Contact session.

---

## 6. PHASE 1 GEOGRAPHY

### Active Cities (Phase 1)

```
Ahmedabad   — ACTIVE (Phase 1)
Gandhinagar — ACTIVE (Phase 1)
```

### Hard Rules for Phase 1

```
1. Service city must be Ahmedabad OR Gandhinagar.
2. Companion city must exactly match service city.
3. No cross-city matching in Phase 1.
4. Ahmedabad companion → Ahmedabad requests only.
5. Gandhinagar companion → Gandhinagar requests only.
```

### Coming Soon Cities (shown greyed out in UI)

Surat | Vadodara | Rajkot | Mumbai | Pune |
Bengaluru | Delhi | Hyderabad | Chennai | Kolkata

Greyed-out cities have a waitlist CTA:
"Want NearDear in your city? Join the waitlist →"
Every waitlist signup = supply lead + demand lead for
that city. Captured in city_waitlist table.

### City Selector on Request Form

```
"In which city do you need this service?"

● Ahmedabad
● Gandhinagar

Coming soon (greyed, unselectable):
○ Surat  ○ Vadodara  ○ Rajkot  ○ Mumbai...

"Want NearDear in your city?
 [ Join the waitlist → ]"
```

### City Selector on Companion Application

```
"Which city will you serve in?"

● Ahmedabad
● Gandhinagar

"Not in these cities? Register your interest.
 We are expanding soon. [ Notify me → ]"
```

---

## 7. HERO PAGE — COMPLETE SPECIFICATION

### Section 1 — Split Hero (Above the Fold)

Full screen. Split 50/50 on desktop. Stacked on mobile.

**LEFT HALF — Service Receivers**
Background: Warm Cream (#FEF8F0) with soft photograph
of elder's hands being held by younger hands.

```
EN:
Headline (Playfair Display 700, 48px, Deep Night):
"Your parents are alone
 back home?"

Sub-headline (DM Sans 400, 20px, Warm Gray):
"Find a verified NearDear companion
 in their city. Someone who shows up,
 sits with them, and keeps you informed."

CTA (Saffron button, large):
[ Find a NearDear ]

Secondary link (Teal, underline):
How does it work? →

────────────────────────────────
GU:
Headline:
"ઘરે મા-બાપ એકલા છે?"

Sub-headline:
"તેમના શહેરમાં વિશ્વસનીય નિયરડિયર
 સાથી શોધો."

CTA:
[ નિયરડિયર શોધો ]

Secondary:
કેવી રીતે કામ કરે છે? →
```

**RIGHT HALF — Service Providers**
Background: Sage Green (#4A8C6F) gradient.
Photograph: Confident person, warm smile, everyday setting.

```
EN:
Headline (Playfair Display 700, 48px, White):
"Skill, empathy and time
 are with you?"

Sub-headline (DM Sans 400, 20px, light):
"Contribute as a NearDear Companion.
 The portal pays 80% of every session
 directly to you."

CTA (White button, Sage Green text, large):
[ Start Contributing ]

Secondary (White, underline):
See what you can earn →

────────────────────────────────
GU:
Headline:
"કૌશલ્ય, સહાનુભૂતિ અને
 સમય છે?"

Sub-headline:
"નિયરડિયર સાથી બનો.
 પ્લેટફોર્મ 80% સીધા તમને આપે."

CTA:
[ શરૂ કરો ]

Secondary:
કેટલું કમાઈ શકો? →
```

Centre divider: NearDear logo. Pulses gently on hover.

---

### Section 2 — Trust Signal Bar

Full width. Teal (#1A6B7A) background. Three statements.

```
EN:
✓ All companions strictly verified     ✓ 80% earnings paid directly      ✓ Family notified after every visit
  Identity. Character.                    to every companion, every time.    Check-in. Note. Peace of mind.
  Ongoing integrity checks.

[ Read how verification works ]  ← Saffron CTA

────────────────────────────────
GU:
✓ બધા સાથીઓ કડક ચકાસણી       ✓ 80% કમાણી સીધી               ✓ દરેક મુલાકાત પછી
  ઓળખ. ચારિત્ર્ય.                  દરેક સાથીને.                   પરિવારને જાણ.
  સતત સ્થિર ચકાસણી.
```

---

### Section 3 — The Problem We Are Solving

Warm Cream background. Centred. No CTA. Just truth.

```
EN:
Label (Teal, small caps): WHY NEARDEAR EXISTS

Headline (Playfair Display 700, 40px):
"In the era of AI, someone human
 will still be there for you."

Body (DM Sans 400, 18px, max-width 640px, centred):
"Children migrate to Bengaluru, Dubai, Toronto.
 Parents stay behind in Rajkot, Ahmedabad, Patna.
 Joint families dissolve. The person who used to
 handle the doctor visit, the medicine refill,
 the quiet Tuesday afternoon — is no longer nearby.

 NearDear exists for that gap.
 Not to replace family.
 To hold the space until family can be there."
```

---

### Section 4 — How It Works (Receiver)

White background. Three steps.

```
Label: FOR FAMILIES & ELDERS
Headline: "How NearDear works for you"

STEP 1 — Tell us what you need
Describe the situation in your own words.
Our AI finds the right match.

STEP 2 — Meet your verified Companion
Real people near your parent's location.
Name, photo, trust level, sessions completed.

STEP 3 — Stay connected from anywhere
Companion checks in when they arrive.
You receive a note after every visit.
Always informed. Always in control.

CTA (Saffron): [ Find a Companion Now ]
```

---

### Section 5 — Services Grid

Warm Cream background. 14 service tiles.
4 across desktop. 2 across mobile.
Each tile: icon + name + "from ₹XXX"
Tap/hover: one-line description.

```
CTA below (Teal, outlined):
[ See all services and fees ]
```

---

### Section 6 — Match Card Preview

White background. Three example match cards.

```
Label: WHO YOU WILL MEET
Headline: "Real people. Verified. Near you."

CARD 1 — Elder Care
[Photo] Rameshbhai P.
        Retired Bank Officer · Ahmedabad
        ● Level 3 Trusted Companion

"Available Monday, Wednesday, Friday mornings.
 Lives 3km from your parent's area.
 Speaks Gujarati and Hindi.
 Completed 34 elder visits."

Services: Elder Visit · Hospital Help · Bank Help
₹700/visit  [ Request Rameshbhai ]

CARD 2 — Medicine Pickup
[Photo] Priyaben S.
        Homemaker · Ahmedabad — Naranpura
        ● Level 2 Trusted Companion

"Medicine pickup runs every Tuesday and Thursday.
 Knows all local chemists. 28 pickups completed."

₹380/pickup  [ Request Priyaben ]
             [ Set up recurring ]

CARD 3 — New City Student
[Photo] Arjun K.
        Young Professional · Ahmedabad
        ● Level 1 Companion

"Has helped 6 students settle in.
 Available weekends. Gujarati, Hindi, English."

₹500/session  [ Request Arjun ]

CTA (Saffron): [ Find companions in your city ]
```

---

### Section 7 — NRI Family Section

Teal background. White text.

```
Label: FOR FAMILIES ABROAD

Headline (Playfair Display 700, 42px, White):
"You are in Toronto.
 Your mother is in Rajkot.
 NearDear is there."

Body:
"Set up care for your parent from anywhere.
 We check in when they arrive.
 We send you a note after every visit.
 Across time zones. Across distances."

Three icons (White):
GPS check-in          Post-visit note        Concern alert
Know when they arrive  Know what happened     Know immediately

CTA (Saffron on Teal): [ Set up care for my parent ]
```

---

### Section 8 — Companion Earnings Appeal

Warm Cream background.

```
Label: FOR COMPANIONS

Headline:
"Turn your time and empathy
 into meaningful income."

Body:
"You do not need a degree. You need a good heart,
 a verified identity, and the capacity to show up.
 NearDear pays 80% of every session directly to you."

INTERACTIVE EARNINGS CALCULATOR:
I can give: [__] hours per week
Services: [dropdown multiselect]
My city: [Ahmedabad ▼]

──────────────────────────
YOUR ESTIMATED MONTHLY EARNINGS
3 medicine pickups/week  → ₹3,840
2 elder visits/week      → ₹4,480
1 hospital/week          → ₹3,200
─────────────────────────
Estimated total          → ₹11,520/month
Working ~15 hrs/week
──────────────────────────

TRUST LADDER AS EARNINGS LADDER:
Level 0  →  ₹3,000–6,000/month   (remote, entry)
Level 1  →  ₹6,000–12,000/month  (field verified)
Level 2  →  ₹12,000–25,000/month (home trusted)
Level 3  →  ₹25,000–40,000/month (senior companion)

CTA (Sage Green, large): [ Start Your Application ]
Secondary (Teal): What does verification involve? →
```

---

### Section 9 — Verification Explained

White background.

```
Headline:
"Three layers of verification.
 Every companion. Every time."

X — IDENTITY VERIFICATION
Aadhaar confirmed. Live selfie matched.
Address verified. Police Clearance Certificate reviewed.
Renewed every 12 months.

Y — CHARACTER VERIFICATION
Two personal references contacted by phone.
Video interview with NearDear team.
Empathy, boundaries, communication — all assessed.
Code of Conduct signed before first session.

Z — ONGOING INTEGRITY MONITORING
Every session tracked. Check-in. Check-out.
Post-session note reviewed. User feedback every session.
Annual re-verification. Concern flagging always open.

Footer:
"After all this — yes. You are still dealing with
 human beings. But we have done everything a platform
 can do to ensure the right ones reach your door."

CTA (Teal, outlined): [ Read our full safety framework ]
```

---

### Section 10 — Footer

Deep Night (#1C2B3A) background. White text.

```
NEARDEAR.IN

For Families & Elders  | For Companions       | Platform     | Legal
Find a Companion         Become a Companion     About           Terms
How It Works             See What You Earn      Our Mission     Privacy
Service Catalogue        Verification Process   Safety          Abuse Policy
NRI Family Support       Trust Level System     Contact         Disclaimer
Elder Profile Setup      Team Operator Info     Careers         Grievance

Language toggle: [ EN | ગુ ]

© 2026 NearDear.in | Made with purpose in India
All companions are independently verified individuals,
not employees of NearDear.
```

---

## 8. USER JOURNEYS — ALL ROLES

### Journey 1 — Service Receiver: NRI Family Member

Persona: Rohan, 38. Bengaluru. Parents in Vadodara.
Father had cardiac episode. Needs regular care.

```
1. Rohan finds neardear.in via search or referral
2. Reads left hero half — exactly his situation
3. Clicks [ Find a NearDear ]
4. Registration: name + phone OTP + email OTP + city
5. "Who are you booking for?" → My parent
6. Elder profile:
   → Father's name, Vadodara city, phone (OTP consent)
   → Age range 70-75, Gujarati language
   → Health notes (cardiac, lives alone)
   → Emergency contact: Rohan's number
7. "What do you need?" → free text description
8. Service checkboxes (pre-suggested by AI):
   ✓ Elder Support Visit
   ✓ Hospital Guidance Help
9. Preferred: Mon/Wed/Fri, 10am, recurring
10. One-time consents: Terms + Abuse + Disclaimer + Notif
11. [ Submit → Find a Companion ]
12. AI extracts: elder-visit + hospital-help, Vadodara,
    recurring, Gujarati-speaking, Level 2 needed
13. Match results shown — 3 companion cards
14. Rohan reads Rameshbhai's card — retired banker,
    Vadodara, Gujarati, 34 sessions, 3km away
15. [ Request Rameshbhai ]
16. Request detail: days, time, special note about father
17. Request submitted → Rameshbhai notified
18. Rameshbhai accepts within 2 hours
19. Rohan notified: push + SMS + email
20. Rohan pays: 4 sessions × ₹700 = ₹2,800 via Razorpay
21. Session confirmed
22. Monday 10:03am: push → "Rameshbhai has arrived"
23. 11:21am: push → "Session complete. Read note →"
24. Rohan reads visit note. Confirms session.
25. ₹560 released to Rameshbhai. ₹140 to platform.
26. After 4 sessions: "Set up recurring with Rameshbhai?"
27. Rohan clicks yes. Monthly auto-pay. Relationship locked.
```

---

### Journey 2 — Solo Companion Application

Persona: Manjuben, 52. Homemaker, Ahmedabad.
Free weekday mornings. Two-wheeler. Warm and patient.

```
1. Sees right hero half — "Skill, empathy and time?"
2. Runs earnings calculator → ₹9,000–12,000/month potential
3. Clicks [ Start Your Application ]
4. Stage 1 — Expression of Interest:
   Name + phone OTP + city: Ahmedabad
   Services: elder-visit, medicine-pickup, hospital-help
   Availability: weekday mornings
   Vehicle: two-wheeler
   Why this work: (free text — her genuine words)
5. Admin sees lead. Confirms Ahmedabad need. Invites.
6. Stage 2 — Full Application (15-20 min):
   Identity: Aadhaar + live selfie + address proof
   Police: PCC upload (Ahmedabad, dated 3 months ago)
   References: 2 personal references with phone + relationship
   Services: personal statement for each selected service
   Geography: 10km radius, Naranpura + Satellite + Bodakdev
   Declaration: Code of Conduct read and signed
7. Platform verifies:
   → Aadhaar API: ✓ confirmed
   → PCC reviewed by admin: ✓ accepted
   → Reference 1 called: ✓ positive
   → Reference 2 called: ✓ positive
8. Stage 4 — Video Interview (30 min):
   Empathy: 5/5 | Communication: 4/5
   Boundary: 5/5 | Scenario: 4/5 | Total: 18/20
   Recommendation: Approve ✓
9. Stage 5 — Orientation (self-paced, 1-2 hours):
   6 modules completed
   Quiz: 90% (pass)
   Code of Conduct signed digitally with timestamp
10. Admin approves. Trust Level 1 assigned.
    (Level 1 given directly based on experience signal
     and strong interview score)
11. Manjuben receives welcome notification.
    Profile live in matching for Ahmedabad.
12. Next morning: new request notification
    "Medicine pickup in Naranpura. ₹380. Thursday 9:30am"
13. She opens app. Sees request pop-up:
    Service | Area | Time | Earnings | Timer: 2:47:33
    [ ✓ Yes, I can serve ] [ ✗ Not available ]
14. Accepts. Session confirmed.
15. Thursday 9:25am: opens app. Taps [ CHECK IN ]
    GPS logged. Family notified.
16. Collects medicines. Delivers to door.
17. Taps [ CHECK OUT ]. Submits session note.
18. ₹304 added to pending earnings.
19. Auto-confirmed after 24h. ₹304 released to wallet.
20. Trust ladder: 1 session complete. 9 to Level 2.
```

---

### Journey 3 — Admin Approving a Companion

```
1. Admin receives notification: new application
2. Opens admin.neardear.in
3. Applications queue → Manjuben P., Ahmedabad
4. Reviews full application:
   → Aadhaar: API confirmed ✓
   → PCC: uploaded, 3 months old, Ahmedabad ✓
   → Selfie: matches Aadhaar photo ✓
   → Personal statement: reads it ✓
5. Marks PCC reviewed: ✓ Accepted
6. Reference calls:
   → Opens reference call module
   → Calls Ref 1: 5 questions, notes entered ✓
   → Calls Ref 2: notes entered ✓
7. Schedules interview → system sends calendar invite
8. Conducts interview. Submits scorecard.
   Recommendation: Approve ✓
9. Checks orientation: 100% complete, quiz 90% ✓
10. Final review: all green
11. Clicks [ Approve Companion ]
    Selects initial trust level: Level 1
    Adds admin note: "Strong candidate. Warm personality.
    Clear on boundaries. Naranpura morning slot needed."
12. Account activated. Welcome email + SMS triggered.
13. 10 sessions later: dashboard shows
    "Manjuben eligible for Level 2 review"
14. Admin checks: 10 sessions, avg feedback 4.7/5,
    zero concerns
15. Upgrades to Level 2. Home visits now unlocked.
```

---

### Journey 4 — Companion Self-Pause

```
1. Manjuben is travelling for 2 weeks (family function)
2. Opens app → Settings → [ Pause my account ]
3. Platform asks: "How long?"
   → 2 weeks selected
   → Reason: Travel (optional, she selects it)
4. Confirmation screen:
   "Your account will be paused for 2 weeks.
    No new requests will be sent to you.
    Your existing sessions: please honour or
    cancel individually.
    Your trust level is preserved.
    Resume anytime from settings."
5. Taps [ Confirm Pause ]
6. accountStatus → PAUSED
7. Invisible in matching immediately
8. Status change logged in provider_status_changes
9. 2 days before return date: notification
   "Your pause ends in 2 days. Ready to resume?"
10. She taps [ Resume ] when back
11. accountStatus → ACTIVE
12. Visible in matching within minutes
```

---

### Journey 5 — Match Trigger Notification Flow

```
1. Receiver submits request in Ahmedabad
2. AI extracts details (Haiku model, server-side)
3. Database filter:
   city = Ahmedabad
   AND accountStatus = ACTIVE
   AND trustLevel >= LEVEL_2 (for elder visit)
   AND elder-visit in service_offerings
   AND isActive = true
4. Results ranked: sessions, feedback, distance, response rate
5. Top 3 matches identified
6. ALL 3 notified SIMULTANEOUSLY (not one by one)
7. Each receives:
   PUSH (wakes screen):
   "New request near you — Ready to serve?"
   
   IN-APP POP-UP:
   ┌─────────────────────────────┐
   │ 🔔 New Request              │
   │                             │
   │ Elder Companion Visit       │
   │ Navrangpura, Ahmedabad      │
   │ Thursday, 10:00 AM          │
   │ ~1.5 hours                  │
   │ You earn: ₹560              │
   │                             │
   │ ⏱ Expires in: 2:47:33      │
   │                             │
   │ [ ✓ Yes, I can serve ]      │
   │ [ ✗ Not available ]         │
   │ [ ? Ask a question ]        │
   └─────────────────────────────┘
8. Notification expires after 3 hours
9. FIRST to accept → gets booking
10. Others receive: "This request was taken"
11. If all 3 decline: next batch of 3 notified
12. If no match in city: receiver notified
    "No companions available right now.
     We are working on it. You will be notified."
    Admin notified: supply gap alert
```

---

## 9. ONBOARDING FLOWS — ALL ROLES

### Service Receiver Onboarding

```
Screen 1: "Who are you booking for?"
  [ Myself ] [ My parent/elder ] [ Someone else ]

Screen 2: Basic Registration
  Name | Phone (OTP) | Email (OTP) | Your city

Screen 3 (if "My parent"):
  Elder name | Elder city | Elder phone (OTP consent)
  Age range | Primary language | Health notes (optional)
  Emergency contact

Screen 4: One-time Consents (stored permanently)
  ✓ Terms  ✓ Abuse Policy  ✓ Disclaimer  ✓ Notifications

Screen 5: "What do you need?"
  Free text + service checkboxes

Screen 6: Match results

Total: 4-6 screens. Under 5 minutes.
```

---

### Companion Onboarding

```
Stage 1 — Expression of Interest (5 min, public)
  Name + phone OTP + city
  Services (checkboxes with descriptions)
  Availability + vehicle
  Why this work (free text, no word limit)

Stage 2 — Full Application (20 min, authenticated)
  Identity: Aadhaar + live selfie + address proof + alt phone
  Police: PCC upload + issuing authority + date
  References: 2 × (name + phone + relationship + years known)
  Services: personal statement for each selected service
  Geography: service areas + radius + willingness to travel
  Skills: hard skills (checkboxes) + soft skills (checkboxes)
  Availability: days + time slots + weekly hours + notice period
  Declaration: Code of Conduct signed digitally

Stage 3 — Platform Verification (3-7 days, admin side)
  Aadhaar API check
  PCC review by admin
  Reference call 1 (structured 5-question call, notes recorded)
  Reference call 2

Stage 4 — Video Interview (30 min, scheduled by admin)
  Scorecard: empathy + communication + boundary + scenario
  Minimum passing score: 14/20
  Recommendation: Approve / Conditional / Reject

Stage 5 — Orientation (1-2 hours, self-paced)
  6 modules + quiz (minimum 80%) + Code signed with timestamp

Stage 6 — Account Activation
  Admin reviews full file → approves → assigns trust level
  Welcome message sent → profile goes live

Total: 5-10 days end-to-end
```

---

### Team Operator Onboarding

```
1. Operator completes full Companion onboarding (all 6 stages)
2. After activation: requests Team Operator status from admin
3. Admin reviews and approves Team Operator status
4. Operator adds team members to their account
5. Each team member: completes Stages 2-5 individually
   (operator vouches but individual verification mandatory)
6. Team members activated under operator account
7. Operator dashboard shows all members, their trust levels,
   sessions, and earnings
```

---

### Admin Account Creation

```
No self-registration. Ever.
Admin accounts created only by platform owner.
Login: email + password + 2FA (TOTP)
Panel: admin.neardear.in only
ADMIN_SECRET_KEY required for all destructive operations.
```

---

## 10. THE MATCH-TRIGGER NOTIFICATION FLOW

### Technical Flow (Server-Side)

```typescript
// Triggered when request is submitted

async function processNewRequest(requestId: string) {

  // 1. Get request details
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { requestServices: true, elderProfile: true }
  })

  // 2. AI extraction (Haiku)
  const extracted = await extractRequestDetails(
    request.descriptionRaw
  )

  // 3. Update request with AI data
  await prisma.request.update({
    where: { id: requestId },
    data: { aiExtractedData: extracted }
  })

  // 4. Find eligible companions
  const companions = await prisma.providerProfile.findMany({
    where: {
      city: request.serviceCity,        // EXACT city match
      accountStatus: 'ACTIVE',
      trustLevel: { gte: minTrustLevel },
      serviceOfferings: {
        some: {
          serviceCategoryId: { in: serviceIds },
          isActive: true
        }
      }
    }
  })

  // 5. Rank companions
  const ranked = rankCompanions(companions)

  // 6. Take top 3
  const top3 = ranked.slice(0, 3)

  // 7. Create notification records
  const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000)
  for (const companion of top3) {
    await prisma.requestNotification.create({
      data: {
        requestId: requestId,
        providerProfileId: companion.id,
        status: 'SENT',
        expiresAt: expiresAt
      }
    })
    // 8. Send push notification
    await sendPushNotification(
      companion.userId,
      'New request near you — Ready to serve?',
      { requestId, earnings: calculateEarnings(request) }
    )
  }

  // 9. Update request status
  await prisma.request.update({
    where: { id: requestId },
    data: { status: 'COMPANION_NOTIFIED' }
  })
}
```

---

## 11. SESSION PROTOCOL — NON-NEGOTIABLE

### Remote Sessions

```
Pre-session (15 min before):
  Both parties receive reminder notification

Start:
  Companion taps [ Start Session ] in app
  Timestamp recorded
  User notified: "Your session has started"

End:
  Companion taps [ End Session ]
  Immediately prompted: [ Submit Session Note ]
  Note must be submitted before session closes

Note (remote):
  → What did you discuss or help with?
  → Any concern to flag?
  Delivered to user/family instantly
```

---

### In-Person Sessions

```
Pre-session (30 min before):
  Companion: "Reminder with address confirmed"
  Family: "Your companion is on their way"

ARRIVAL — CHECK IN:
  Companion taps [ CHECK IN ] (large button)
  GPS location logged (within radius of address)
  Timestamp recorded
  Family notified instantly:
  "[Name] has arrived at [address]. Session started [time]."

DURING:
  Timer running live
  Hard rules reminder visible (collapsible)
  [ Flag something urgent ] button always visible

DEPARTURE — CHECK OUT:
  Companion taps [ CHECK OUT ] (large button)
  GPS logged. Timer stopped.
  IMMEDIATELY goes to Session Note screen
  Cannot close without submitting note

SESSION NOTE (mandatory, 5 fields):
  1. What did you help with today? (free text)
  2. How was the person — general wellbeing? (free text)
  3. Any practical observation for family? (free text)
  4. Any concern? (toggle → text area if yes)
  5. Next visit reminder needed? (toggle → date picker)
  Note delivered to family instantly on submission

FAMILY CONFIRMATION (within 24 hours):
  Family sees note. Options:
  → [ Confirm session ] — releases 80% to companion
  → [ Flag a concern ] — triggers admin review
  Auto-confirmed after 24 hours if no action

PAYMENT RELEASE:
  After confirmation: 80% to companion wallet
  20% retained by platform
  Companion withdraws weekly to bank (IMPS/NEFT)
```

---

### Hard Rules — Cannot Be Waived

```
RULE 1: No cash accepted. Ever.
        All payments through platform only.
        Cash transaction = immediate suspension.

RULE 2: No gifts accepted.
        Declination is mandatory.

RULE 3: No personal financial information.
        No bank details, passwords, PINs.
        Violation = permanent removal.

RULE 4: No contact outside the platform.
        No WhatsApp. No private phone exchange.
        All communication through platform only.

RULE 5: Scope is presence and errands only.
        Not medical. Not legal. Not financial.

RULE 6: Medical observations reported through platform.
        Never acted upon independently.
        Emergency: call 112 FIRST. Then notify platform.

RULE 7: No decisions on behalf of the elder.
        No signing. No consenting. No advising.

Violation of any rule:
  → Immediate account suspension
  → Admin investigation within 24 hours
  → Warning / extended suspension / permanent removal
  → All violations permanently on provider record
```

---

## 12. SAFETY FRAMEWORK — X Y Z VERIFICATION

### X — Identity Verification

Who: All Service Providers

```
1. Aadhaar number
   → UIDAI/DigiLocker API verification
   → Name, DOB, address confirmed
   → Only last 4 digits stored
   → Full number NEVER stored

2. Live selfie
   → Captured in-app at application moment
   → NOT accepted from gallery
   → Compared to Aadhaar photo by admin

3. Residential address proof
   → Utility bill / rental agreement / bank statement
   → Must show current address

4. Police Clearance Certificate
   → Must be within 12 months
   → Reviewed by admin
   → Stored in R2 (access-controlled)
   → Renewed annually (account auto-paused if overdue)
```

---

### Y — Character Verification

Who: All Companions (not required for Professional Advisors V1)

```
1. Two character references
   → Personal only (not professional)
   → Must have known applicant 2+ years
   → Platform calls both
   → Structured 5-question call:
     Q1: How long and how do you know this person?
     Q2: Describe their character and reliability.
     Q3: Comfortable with them in someone's home?
     Q4: Seen them in a situation of trust?
     Q5: Anything we should know?

2. Video interview
   → 20-30 minutes via Google Meet
   → Scorecard (4 dimensions × 5-point scale):
     Empathy and warmth
     Communication clarity
     Boundary awareness
     Scenario response
   → Minimum passing: 14/20
   → Notes recorded permanently

3. Code of Conduct signed
   → Digital signature with timestamp
   → Cannot proceed without signing
```

---

### Z — Ongoing Integrity Monitoring

Who: All active Service Providers, indefinitely

```
1. Session protocol compliance
   → Check-in, check-out, note — every session
   → Note submission rate tracked (must be >95%)
   → Punctuality tracked

2. User and family feedback
   → 4-question form after every session
   → Aggregated into provider score
   → 3 consecutive low scores → admin review
   → Monthly review by admin

3. Random admin contact
   → Platform calls elders/families unannounced
   → "How has your experience been?"

4. Annual re-verification
   → 12 months: new PCC + brief re-interview
   → Account auto-paused if not renewed in 30 days

5. Concern log
   → Severity 1: logged, monitored
   → Severity 2: admin contacts all parties in 24h
   → Severity 3: immediate suspension + investigation

6. Community signals
   → Peer concerns from Companion community
   → Anonymous flagging available
```

---

## 13. THE TRUST LADDER — LEVEL 0 TO 3

```
LEVEL 0 — VOICE VERIFIED
Entry. Identity confirmed (X). Orientation complete.
Services: Remote only — Talk sessions, Student support,
          Document help (remote guidance)
Earnings: ₹3,000–6,000/month part time
Next: 5 sessions + positive feedback

────────────────────────────────────────────────────

LEVEL 1 — FIELD VERIFIED
Character verification complete (Y).
Services: All Level 0 + Medicine pickup, Grocery assist,
          Public place meetings, Bank help,
          Government office help, Document help (in-person),
          Travel assist, Hospital guidance
Earnings: ₹6,000–12,000/month
Next: 10 sessions + admin review

────────────────────────────────────────────────────

LEVEL 2 — HOME TRUSTED
10+ sessions. Positive track record. Admin-reviewed.
Services: All Level 1 + Elder support visit,
          Check-on-parents, Companion visit (home),
          Hospital guidance (full), Property visit,
          Event assistance
Earnings: ₹12,000–25,000/month
Next: 25 sessions + 6 months active + senior admin review

────────────────────────────────────────────────────

LEVEL 3 — SENIOR COMPANION
Highest trust. Longest track record.
Services: All Level 2 + Recurring elder care,
          Local representative (ongoing),
          First Contact / Needs Assessment sessions
Earnings: ₹25,000–40,000/month
Note: Level 3 companions are the platform's most
      valuable asset. Recognised in community.
      Subject to most thorough ongoing monitoring.
```

---

## 14. PROVIDER ACCOUNT — PAUSE AND CANCEL

### Self-Pause

```
Path: App → Settings → [ Pause my account ]

Options:
  → 1 week / 2 weeks / 1 month / Until I resume manually

Optional reason (dropdown, not mandatory):
  Travel | Health | Family commitment | Taking a break | Other

Effect:
  → accountStatus = PAUSED immediately
  → Invisible in matching immediately
  → No new requests routed
  → Existing sessions: must honour or cancel individually
  → Trust level: preserved
  → Logged in provider_status_changes table

Return reminder: notification 2 days before pause end date

Self-resume:
  → One tap: [ Resume accepting requests ]
  → accountStatus = ACTIVE immediately
  → Visible in matching within minutes
```

---

### Self-Cancel (Close Account)

```
Path: App → Settings → [ Close my account ]

Warning screen:
  "Your trust level and session history will be
   preserved for 6 months in case you want to return."

Reason (mandatory dropdown):
  Found other work | Moving city | Personal reasons |
  Not satisfied with platform | Other

Confirmation: type "CLOSE" to proceed

Effect:
  → accountStatus = REMOVED immediately
  → Profile invisible everywhere
  → No new requests
  → Pending earnings: released within 7 days
  → Data retained 6 months
  → After 6 months: data anonymised
  → Logged in provider_status_changes

Reactivation within 6 months:
  → Request sent to admin
  → Brief admin review (trust level preserved)
  → Reactivated at same trust level

After 6 months: full onboarding required again
```

---

## 15. REVENUE MODEL AND EARNINGS

### The Split

```
User/family pays full fee
         ↓
Platform receives 100%
         ↓
  80% → Companion/Advisor
  20% → NearDear Platform
```

### The Transparency Commitment (Published Policy)

> "Your earnings are yours. The 80/20 split will never
> change without 60 days' written notice and your right
> to exit. Your trust level, once earned, cannot be taken
> away except for a conduct violation.
> You build something real here. We will honour it."

### Earnings Table

| Service | Suggested Fee | Companion Earns | Platform |
|---|---|---|---|
| Talk/Support (30 min) | ₹300 | ₹240 | ₹60 |
| Medicine Pickup | ₹400 | ₹320 | ₹80 |
| Document Help | ₹500 | ₹400 | ₹100 |
| Bank Work Help | ₹500 | ₹400 | ₹100 |
| Govt Office Help | ₹600 | ₹480 | ₹120 |
| Elder Support Visit | ₹700 | ₹560 | ₹140 |
| Check-on-Parents | ₹650 | ₹520 | ₹130 |
| Companion Visit | ₹900 | ₹720 | ₹180 |
| Hospital Guidance | ₹1,000 | ₹800 | ₹200 |
| Travel Assistance | ₹1,500 | ₹1,200 | ₹300 |
| Event Assistance | ₹2,000 | ₹1,600 | ₹400 |
| Recurring/month (4×) | ₹2,500 | ₹2,000 | ₹500 |
| Prof Advisory (45min) | ₹1,500–5,000 | ₹1,200–4,000 | ₹300–1,000 |

### Payment Flow

```
User pays → Razorpay captures → Held in platform wallet
After session confirmed → 80% queued for companion
Weekly withdrawal → Bank (IMPS/NEFT)
Platform retains 20%

Refund policy:
  Companion no-show: full refund to user
  User cancels 24h+ before: full refund
  User cancels <24h: 50% refund, 50% to companion
  User cancels same day: no refund (unless admin override)
  Dispute: admin reviews, decision within 48 hours
```

---

## 16. LANGUAGE SYSTEM — ENGLISH + GUJARATI

### Architecture: Hybrid Approach

```
STATIC (translation files — en.json + gu.json):
  All fixed UI strings:
  → Navigation, buttons, form labels
  → Error messages, notifications
  → Service names and descriptions
  → Onboarding screens
  → Hard rules, Code of Conduct
  Translate once. Review once. Perfect once.

DYNAMIC (Haiku API, server-side only):
  Free-text content crossing language boundaries:
  → Session notes (companion writes GU → family reads EN)
  → Request descriptions (receiver writes GU → companion reads GU)
  → Match card copy (AI generates in both languages)
  → Admin notes shown to provider
```

### Language Toggle

```
Position: top right of every page and screen
Appearance: [ EN | ગુ ] pill toggle
Active language: highlighted in Saffron (#E07B2F)

Behaviour:
  First visit: detect device language
    If Gujarati device → default ગુ
    If English device → default EN
  After first toggle: save to localStorage (guest)
  After login: save to user.preferredLanguage (database)
  Persists across all pages and sessions
```

### Brand Name in Gujarati

```
ALWAYS:  નિયરડિયર  (transliterated sound)
NEVER:   નજીકડિયર  (translated meaning)
```

### Key UI Strings (EN → GU)

```
"Your parents are alone back home?"
→ "ઘરે મા-બાપ એકલા છે?"

"Find a NearDear"
→ "નિયરડિયર શોધો"

"Skill, empathy and time are with you?"
→ "કૌશલ્ય, સહાનુભૂતિ અને સમય છે?"

"Start Contributing"
→ "શરૂ કરો"

"CHECK IN"
→ "હાજર થયા"

"CHECK OUT"
→ "વિદાય"

"New request near you — Ready to serve?"
→ "તમારી નજીક નવી વિનંતી — સેવા આપવા તૈયાર છો?"
```

Note: All Gujarati strings to be reviewed and approved
by Jaydeep Buch (native Gujarati speaker, Ahmedabad)
before go-live. Natural conversational Gujarati only —
never textbook formal.

### AI Translation Function (lib/ai.ts)

```typescript
export async function translateContent(
  text: string,
  from: 'en' | 'gu',
  to: 'en' | 'gu',
  context: 'session_note' | 'request' | 'message'
) {
  if (from === to) return text

  const response = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL,
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Translate for NearDear.in — human care
      platform in Gujarat, India.
      From: ${from} To: ${to} Context: ${context}
      Rules: Natural conversational Gujarati.
      Audience: everyday Ahmedabad/Gandhinagar families.
      Keep "NearDear" as "નિયરડિયર".
      No proper noun translation.
      Return only translated text.
      Text: "${text}"`
    }]
  })

  return response.content[0].type === 'text'
    ? response.content[0].text : text
}
```

---

## 17. NOTIFICATION FRAMEWORK

### Service Receiver / Family

| Trigger | Channel | Content |
|---|---|---|
| Registration | Email | Welcome + next steps |
| Request submitted | Email + SMS | Sent to [companion] |
| Companion accepted | Push + SMS | [Name] accepted. Date/time |
| Payment success | Email | Receipt |
| Session reminder | Push + SMS | Tomorrow: [Name] at [time] |
| Companion checked in | Push | [Name] arrived. [time] |
| Companion checked out | Push | Complete. Read note → |
| Visit note ready | Push + Email | Full note content |
| Concern flagged | Push + Email + SMS | Admin reviewing |
| Session confirmed | Email | Payment released |
| Recurring payment | Push + Email | Monthly plan renewed |

### Service Provider (Companion)

| Trigger | Channel | Content |
|---|---|---|
| Application received | Email + SMS | Next steps |
| Verification complete | Email | Interview to schedule |
| Interview scheduled | Email + Calendar | Meet link + prep notes |
| Account activated | Push + Email | Welcome + trust level |
| New request | Push + SMS | Service, area, fee. Accept? |
| Request expiring | Push | Expires in 2 hours |
| Session reminder | Push | Tomorrow: service at location |
| Note reminder | Push | Please submit session note |
| Earnings credited | Push | ₹[amount] to wallet |
| Withdrawal processed | Email + SMS | ₹[amount] to bank |
| Trust level upgraded | Push + Email | Level [X]. New services unlocked |
| Re-verification due | Email + Push | Due in 30 days |
| Pause reminder | Push | Pause ends in 2 days |

---

## 18. SECURITY FRAMEWORK — ALL 20 POINTS

```
1.  Rate limiting         → Upstash Redis on every API route
                            Stricter limits on auth, OTP, payment

2.  Auth token storage    → Auth.js HTTP-only cookies only
                            Never localStorage. Never sessionStorage.

3.  Input sanitisation    → Zod validation on every form + API route
                            Prisma parameterised queries (no raw SQL)

4.  API keys              → All keys in env vars only
                            Server-side only for sensitive keys
                            NEVER in browser/client code

5.  Webhook verification  → Razorpay webhook secret verified
                            on every incoming webhook
                            Unverified = rejected immediately

6.  Database indexing     → @@index on all WHERE, JOIN, ORDER BY fields
                            Compound indexes on matching queries

7.  Error boundaries      → Next.js error.tsx at every route segment
                            Warm error pages — never white screen

8.  Session expiry        → Users: 24h maxAge, 1h refresh
                            Admin: 8h maxAge
                            Companion mobile: 7 days + rotation

9.  Pagination            → Cursor-based on all list queries
                            Default: 20 records. Max: 100.
                            No query ever without LIMIT clause

10. OTP expiry            → OTP expires in 10 minutes
                            One use only — deleted after use
                            No password reset flow (OTP-only auth)

11. Env var validation    → Zod schema validation at startup
                            Missing critical var = app refuses to start
                            Deployed in instrumentation.ts

12. File storage          → ALL uploads to Cloudflare R2
                            Signed upload URLs (client → R2 direct)
                            Server never handles file bytes

13. CORS policy           → Strict: neardear.in + admin.neardear.in only
                            Defined in next.config.ts

14. Async email           → Resend API (fire-and-forget)
                            Email never blocks user-facing response

15. Connection pooling    → Neon pooler URL for DATABASE_URL
                            Handles serverless connection limits

16. Admin route checks    → Layer 1: separate deployment (admin.neardear.in)
                            Layer 2: Auth.js role=ADMIN check
                            Layer 3: ADMIN_SECRET_KEY for destructive ops

17. Health check          → GET /api/health
                            Returns: status, timestamp, db connection
                            UptimeRobot monitors → alerts jaydeep@

18. Production logging    → Structured logs on all API routes
                            audit_log table: every significant action
                            Immutable. Timestamped. Forever.

19. Database backup       → Neon daily automatic backups
                            Run migrations on development branch first
                            Weekly pg_dump export to R2

20. TypeScript strict     → tsconfig.json: strict: true
                            noImplicitAny: true
                            Never @ts-ignore
                            Every Prisma model auto-generates types
```

---

## 19. MOBILE APP SPECIFICATION

### Platform

```
Framework:    Expo + React Native
Target:       Android first (V1) → iOS (V2)
Min Android:  API 26 (Android 8.0)
State:        Zustand
Navigation:   Expo Router (file-based)
Push:         Firebase Cloud Messaging (FCM)
Location:     Expo Location (for GPS check-in/out)
```

### Why Mobile Is Mandatory

The Companion's GPS check-in/check-out is the core safety
feature of the platform. It cannot run reliably in a browser.
The family receiving a check-in alert when the Companion
arrives at their parent's door must work every time.
This is non-negotiable.

---

### App 1 — Service Receiver / Family App

```
Screens:
1.  Splash — NearDear logo. Warm Cream. Saffron wordmark.
2.  Onboarding (3 swipe screens, first launch only)
3.  Registration / Login — phone OTP
4.  Home Dashboard
    → Active/upcoming sessions
    → Elder profiles (quick access)
    → [ + Describe a new need ] (always visible, large)
5.  Describe Need — free text + service checkboxes
6.  Match Results — companion cards (human language)
7.  Request Tracker — status timeline
8.  Session Live View — "On their way" / "Arrived" / "Complete"
9.  Visit Note — full note, timestamped
    → [ Confirm session ] or [ Flag a concern ]
10. Elder Profile — full session history, active companion
11. Payments — history, status, receipts
12. Settings — profile, notifications, help, logout

Key features:
  → Real-time push notifications (FCM)
  → One-tap emergency contact (calls elder's emergency contact)
  → Language toggle (EN | ગુ) on every screen
```

---

### App 2 — Companion / Service Provider App

```
Screens:
1.  Splash + Onboarding (3 screens)
2.  Login — phone OTP
3.  Home Dashboard
    → Trust Level badge (prominent)
    → Today's sessions
    → Earnings this month (DM Mono, large)
    → New requests badge
4.  Request Inbox
    Each card: service + location + fee + timer
    [ ✓ Yes, I can serve ] [ ✗ Not available ] [ ? Ask ]
5.  My Sessions — weekly calendar view
6.  SESSION PROTOCOL SCREEN (most important)

    PRE-SESSION: address + family note + scope reminder

    ON ARRIVAL:
    ━━━━━━━━━━━━━━━━━━━━━━━
    Large prominent button:
         [ CHECK IN ]
         [ હાજર થયા ]
    ━━━━━━━━━━━━━━━━━━━━━━━
    GPS auto-captured. Family notified.

    DURING: timer + hard rules + emergency flag

    ON DEPARTURE:
    ━━━━━━━━━━━━━━━━━━━━━━━
    Large prominent button:
         [ CHECK OUT ]
         [ વિદાય ]
    ━━━━━━━━━━━━━━━━━━━━━━━
    → Goes immediately to Session Note

7.  Session Note Screen (mandatory, cannot skip)
    5 fields → [ Submit Note ]

8.  Earnings Wallet
    Balance (large) | This week | This month | All time
    [ Withdraw to Bank ]

9.  Trust Level Progress
    Visual progress bar
    "X more sessions to Level N"
    What unlocks at next level

10. My Profile — public view + edit availability + docs
11. Community — companion peer network
12. Help — FAQ + emergency procedures + contact admin

Key features:
  → GPS check-in/out (core — must work reliably)
  → Offline session note drafting (syncs when connected)
  → Push notifications (must wake screen)
  → One-tap emergency: calls 112 + notifies platform
  → Biometric login (Face ID / fingerprint)
  → Language toggle (EN | ગુ) on every screen
```

---

## 20. WEB PLATFORM — ALL PAGES

### Public Pages

```
/                       Hero page (full spec in Section 7)
/how-it-works           Detailed explanation both user types
/services               Full catalogue with fees
/for-families           NRI family specific page
/for-companions         Sign-up + earnings info
/verification           Safety framework explanation
/about                  Mission, founding principle
/terms                  Terms of Service
/privacy                Privacy Policy
/abuse-policy           Abuse Policy
/disclaimer             Platform disclaimer
```

### Authenticated — Service Receiver

```
/dashboard              Home: sessions + elder profiles
/request/new            Describe need + match flow
/request/[id]           Request detail + status
/session/[id]           Session detail + visit note
/elder/[id]             Elder profile + full history
/payments               History + saved methods
/settings               Account settings
```

### Authenticated — Service Provider

```
/provider/dashboard     Home + requests + earnings
/provider/apply         Multi-step application
/provider/requests      Incoming request inbox
/provider/sessions      History + calendar
/provider/earnings      Wallet + withdrawal
/provider/profile       Edit public profile
/provider/documents     Verification docs + status
/provider/community     Companion community
```

### Admin (admin.neardear.in)

```
/                       Dashboard + all queues
/applications           Companion application queue
/companions             All active companions
/users                  All users
/sessions               All sessions (filter + export)
/payments               Payment management
/concerns               Concern + incident log
/categories             Service category management
/cities                 City management (active/coming soon)
/config                 Commission %, fees, trust thresholds
/reports                Analytics
```

---

## 21. ADMIN PANEL SPECIFICATION

### Dashboard

```
Top metrics (real-time):
  Active companions | Active users | Sessions today |
  Revenue this month | Open concerns | Applications pending

Priority queues:
  1. Concerns requiring action (red if >24h)
  2. Applications awaiting review
  3. Reference calls scheduled
  4. Interviews to schedule
  5. Re-verification overdue

Charts:
  Sessions per day (30-day rolling)
  Revenue per week
  New companions per month
  Sessions by service category
  City activity (Ahmedabad vs Gandhinagar)
```

### Application Management

```
List: filter by stage, city, service type, date
Individual view:
  All documents viewable in panel
  Aadhaar: API result visible
  PCC: [ Accept ] [ Reject ] [ Request new ]
  References: [ Mark called ] [ Add notes ]
  Interview: [ Schedule ] → Meet link auto-generated
  Scorecard: structured form, calculated total
  Orientation: progress bar + quiz score
  Decision: [ Approve — Level: X ] [ Hold ] [ Reject ]
  Admin note: running log
```

### Config Panel

```
COMMISSION: platform percentage (currently 20%)
SERVICE FEES: min/max per service per city
TRUST LEVELS: session thresholds for upgrades
CATEGORIES: add / edit / deactivate
CITIES: activate / deactivate / add waitlist
CRON JOBS:
  Daily: flag re-verification due accounts
  Daily: auto-confirm sessions >24h
  Weekly: earnings reports
  Weekly: companion community digest
  Monthly: platform analytics report
```

---

## 22. TECH STACK — EVERY DECISION JUSTIFIED

```
Framework:    Next.js 14 (App Router)
              Handles 3-role system cleanly.
              Proven on existing platform.

Language:     TypeScript (strict mode)
              noImplicitAny + strictNullChecks.
              Mandatory. Non-negotiable.

Database:     Neon PostgreSQL (Mumbai region, ap-south-1)
ORM:          Prisma
              Type-safe. Complex relations handled cleanly.
              Migration-based. Audit-friendly.

Auth:         Auth.js (NextAuth)
              HTTP-only cookies. Never localStorage.
              Phone OTP for users + companions.
              Email + password + 2FA for admin.

Payments:     Razorpay
              India-first. INR-native.
              Webhook signature verification mandatory.

AI:           Anthropic Claude (claude-haiku-4-5-20251001)
              Server-side only. Never in browser.
              Model name stored as env var for easy upgrade.
              Used for: request extraction, match card copy,
              EN↔GU translation, session note quality check.

Email:        Resend
              Async. Never blocks response.
              Transactional only.

Storage:      Cloudflare R2
              All uploads. Signed URLs.
              Server never handles file bytes.

Hosting:      Netlify
              neardear.in → neardear-web repo
              admin.neardear.in → neardear-admin repo

Mobile:       Expo + React Native
              neardear-mobile repo
              Android first. GPS check-in mandatory.
              FCM for push notifications.

Rate Limiting: Upstash Redis
               Edge rate limiting on all API routes.

Bot Protection: Cloudflare Turnstile
                On registration, application, payment.

Admin Panel:  Built-in protected Next.js route
              Separate Netlify deployment.
              Same database. One audit trail.

Logging:      Structured + audit_log table
              Immutable. Every significant action.

i18n:         next-intl
              Static JSON files for UI strings.
              Haiku API for dynamic content translation.
```

---

## 23. DATABASE SCHEMA — PRISMA (COMPLETE)

See prisma/schema.prisma in the repository.

Key tables:
```
users                   — all roles
otp_tokens              — phone OTP (10 min expiry, single use)
elder_profiles          — linked to family user
provider_profiles       — companions + advisors
team_operators          — operator accounts
character_references    — 2 per companion
verification_records    — X verification status
interview_records       — Y verification scorecard
orientation_records     — 6 modules + quiz
trust_level_history     — every level change
provider_credentials    — qualification docs
annual_reviews          — yearly re-verification
service_categories      — master service list (admin-managed)
service_offerings       — provider ↔ service (with statement)
cities                  — active/coming-soon/inactive
city_waitlist           — demand/supply leads for new cities
requests                — every service request
request_services        — request ↔ service (checkbox selections)
request_notifications   — companion notifications per request
matches                 — AI match results
sessions                — confirmed sessions
session_notes           — post-session notes (5 fields)
feedback                — user feedback per session
payments                — Razorpay payment records
earnings                — companion 80% per session
withdrawals             — bank withdrawal requests
recurring_plans         — recurring engagement configs
concerns                — flagged concerns
admin_notes             — running admin log per provider
warnings                — formal warnings
suspensions             — suspension records
provider_status_changes — pause/cancel history
notifications           — all notifications sent
audit_log               — immutable action log (everything)
```

---

## 24. ENVIRONMENT VARIABLES — MASTER LIST

```bash
# DATABASE
DATABASE_URL=               # Neon pooler (production + queries)
DATABASE_URL_DEV=           # Neon direct (local development)

# AUTH
NEXTAUTH_SECRET=            # openssl rand -base64 32
NEXTAUTH_URL=               # https://neardear.in
                            # (admin: https://admin.neardear.in)

# EMAIL
ZOHO_SMTP_HOST=smtp.zoho.in
ZOHO_SMTP_PORT=465
ZOHO_SMTP_USER=hello@neardear.in
ZOHO_SMTP_PASS=             # Zoho app-specific password
RESEND_API_KEY=             # For transactional email
RESEND_FROM_EMAIL=noreply@neardear.in

# AI
ANTHROPIC_API_KEY=          # Haiku API key
ANTHROPIC_MODEL=claude-haiku-4-5-20251001

# PAYMENTS
RAZORPAY_KEY_ID=            # Public key (safe in client)
RAZORPAY_KEY_SECRET=        # Server-side ONLY. Never in browser.
RAZORPAY_WEBHOOK_SECRET=    # Webhook signature verification

# FILE STORAGE
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=neardear-documents
R2_PUBLIC_URL=

# MOBILE / PUSH
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# SECURITY
CRON_SECRET=                # openssl rand -base64 32
ADMIN_SECRET_KEY=           # For admin destructive operations
UPSTASH_REDIS_URL=          # Rate limiting
UPSTASH_REDIS_TOKEN=

# IDENTITY VERIFICATION
UIDAI_API_KEY=              # Aadhaar verification
DIGILOCKER_CLIENT_ID=
DIGILOCKER_CLIENT_SECRET=

# PLATFORM CONFIG
PLATFORM_NAME=NearDear
PLATFORM_URL=https://neardear.in
ADMIN_EMAIL=admin@neardear.in
COMMISSION_PERCENT=20
COMPANION_EARNINGS_PERCENT=80

# ENVIRONMENT
NODE_ENV=development        # production on Netlify
```

---

## 25. CTA MASTER LIST

### Service Receiver CTAs

```
Hero left CTA:              [ Find a NearDear ]
Hero secondary:             How does it work? →
Services section:           [ See all services and fees ]
Match card primary:         [ Request [Name] ]
Match card secondary:       [ See more options ]
Match card recurring:       [ Set up recurring ]
NRI section:                [ Set up care for my parent ]
Verification section:       [ Read our full safety framework ]
After request submitted:    [ Track your request ]
After companion accepted:   [ Make payment ]
Post session note:          [ Confirm session ]
Post session note:          [ Flag a concern ]
After 4 sessions:           [ Set up recurring visits ]
Dashboard always visible:   [ Describe a new need ]
Elder profile:              [ Book a session for [Name] ]
Empty state:                [ Find a companion now ]
Coming soon city:           [ Join the waitlist → ]
```

### Service Provider CTAs

```
Hero right CTA:             [ Start Contributing ]
Hero secondary:             See what you can earn →
Earnings calculator:        [ Start Your Application ]
Verification link:          What does verification involve? →
Stage 1:                    [ Submit Expression of Interest ]
Stage 2:                    [ Submit Full Application ]
Interview:                  [ Confirm Interview Slot ]
Orientation:                [ Begin Orientation ]
Orientation:                [ Continue ]
Orientation:                [ Take Quiz ]
Post-approval:              [ Set Up Your Profile ]
Request inbox — accept:     [ ✓ Yes, I can serve ]
Request inbox — decline:    [ ✗ Not available ]
Request inbox — question:   [ ? Ask a question ]
Session pre:                [ Get Directions ]
SESSION ARRIVAL:            [ CHECK IN ] / [ હાજર થયા ]
SESSION DEPARTURE:          [ CHECK OUT ] / [ વિદાય ]
Session note:               [ Submit Note ]
Earnings wallet:            [ Withdraw to Bank ]
Trust level:                [ See what Level N unlocks ]
Community:                  [ Join the conversation ]
Settings — pause:           [ Pause my account ]
Settings — resume:          [ Resume accepting requests ]
Settings — cancel:          [ Close my account ]
```

### Admin CTAs

```
Application queue:          [ Review Application ]
PCC review:                 [ Accept ] [ Reject ] [ Request new ]
Reference:                  [ Mark Called ] [ Add Notes ]
Interview:                  [ Schedule Interview ]
Interview:                  [ Submit Scorecard ]
Final decision:             [ Approve — Level: X ]
Final decision:             [ Hold — Reason: ___ ]
Final decision:             [ Reject — Reason: ___ ]
Companion management:       [ Upgrade Level ]
Companion management:       [ Issue Warning ]
Companion management:       [ Suspend ]
Concern queue:              [ Open Investigation ]
Concern queue:              [ Resolve ]
Reports:                    [ Export CSV ]
```

---

## 26. CONTENT AND COPY PRINCIPLES

### Voice and Tone

Warm. Direct. Honest. Indian. Modern without being cold.
Serious without being clinical.
Like the most trusted person you know — not a corporation.

When speaking to families:
  Acknowledge the emotion first. Then the solution.

When speaking to companions:
  They are not gig workers. Their empathy has value.
  The platform honours it.

When speaking about safety:
  Never over-promise. Be honest about limits.
  Be clear about the commitment.

### Language Rules

```
ALWAYS SAY              NEVER SAY
───────────────         ──────────────────
Companion               Gig worker / Agent
Elder / your parent     Senior citizen / Aged
Verified Companion      Certified / Guaranteed
Session note            Report / Log
Trust Level             Rating / Score
Concern / Flag          Complaint / Grievance
The platform connects   We are responsible for advice
80% to you              We keep only 20%
Near + Dear             Nearby services / Local help
```

### Platform Disclaimer (Every Service Page)

> NearDear.in connects verified companions and advisors
> with people who need help. NearDear is not a medical,
> legal, or financial services provider. All companions
> are independent individuals, not employees of NearDear.
> The platform is not responsible for session outcomes.
> In any medical emergency, call 112 immediately.

---

## 27. BUILD ORDER AND TIMELINE

### Correct Build Sequence

```
Step 1: Prisma migration + seed data        (1 day)
  → npx prisma migrate dev --name "initial_schema"
  → Seed: cities (Ahmedabad + Gandhinagar ACTIVE)
  → Seed: service_categories (all 14 services)
  → Without this: nothing works

Step 2: Environment variable validation     (2 hours)
  → instrumentation.ts: validateEnv() at startup
  → Zod schema for all required vars
  → App refuses to start if any critical var missing

Step 3: Authentication                      (1-2 days)
  → Phone OTP flow (receive + verify)
  → OTP: 10 minutes, single use, deleted after use
  → Role-based sessions
  → Auth.js HTTP-only cookies
  → Admin: email + password + 2FA

Step 4: Health check endpoint               (1 hour)
  → GET /api/health
  → Checks DB connection
  → Returns status + timestamp
  → Set up UptimeRobot monitoring

Step 5: Hero page                           (1-2 days)
  → Split hero (both halves)
  → Language toggle (EN ↔ GU)
  → Trust signal bar
  → All sections per spec
  → All CTAs functional

Step 6: Service Receiver flow               (2-3 days)
  → Registration + elder profile
  → Request form (free text + checkboxes)
  → AI extraction (Haiku)
  → Match results with companion cards

Step 7: Companion application flow          (3-4 days)
  → Expression of interest
  → Full application (all stages)
  → Document upload (R2)
  → Admin notification on submission

Step 8: Admin panel                         (2-3 days)
  → Application queue
  → Review + approve / reject
  → Trust level management
  → Basic dashboard metrics

Step 9: Matching engine                     (2-3 days)
  → Haiku extracts request details
  → Database filter (city + service + trust + status)
  → Rank results
  → Generate match card copy (EN + GU)
  → Request notifications to top 3 companions
  → 3-hour expiry on notifications

Step 10: Session protocol                   (3-4 days)
  → Companion accepts request
  → Payment (Razorpay)
  → Check-in with GPS (mobile)
  → Check-out
  → Session note (5 fields, mandatory)
  → Family notification
  → Confirmation + payment release

Step 11: Notifications                      (1-2 days)
  → Push (FCM)
  → SMS
  → Email (Resend)
  → Full notification table per Section 17

Step 12: Mobile app                         (2-3 weeks)
  → After web platform stable
  → Companion app first (GPS check-in is core)
  → Receiver app second
  → Both: language toggle + push notifications

Total web platform V1:   3-4 weeks
Total mobile app:        2-3 weeks after web
Soft launch target:      5-7 weeks from today
```

---

## 28. FUTURE ROADMAP

### V2 — 6 to 12 Months

```
→ iOS app (Expo build)
→ In-app messaging (platform-mediated only)
→ Public ratings system (after sufficient data)
→ Featured companion listings (revenue)
→ Advisor subscription plans
→ Hindi language support
→ Marathi language support
→ State police API verification (where available)
→ Grief companion — trained specialist category
→ DigiLocker credential verification (professional advisors)
→ NearDear Companion training certification program
→ Expand to Surat, Vadodara, Rajkot
```

### V3 — 12 to 24 Months

```
→ AI advisory bot (Claude-powered, human-backed)
→ Insurance coverage for sessions (insurer pilot)
→ NearDear Foundation (training + certification body)
→ Government partnership (elder care referrals)
→ Corporate employee assistance program (B2B)
→ Video sessions hosted within platform
→ Group companion sessions (community elder visits)
→ Pan-India expansion (all major cities)
→ International (NRI families, diaspora markets)
```

---

## APPENDIX — THE FOUNDING DOCUMENT

### Why NearDear Exists

In the era of AI — when information is everywhere and answers
come instantly — what becomes rare is not knowledge.
What becomes rare is presence.
The willingness to sit beside someone.
To listen. To show up on a Tuesday when no one else will.

NearDear exists because of a wound that no technology will heal:
the disappearance of the near and dear.

Children migrate. Parents age alone. Students arrive in cities
where they know no one. People grieve without anyone beside them.
The elderly navigate hospitals, banks, and government offices
alone — in systems not designed for them, without a hand to hold.

We are not building NearDear because it is a business opportunity.
We are building it because we have seen this wound.
We understand it personally.
And we believe it is possible to respond with something more
than an app.

We are building trust infrastructure.

Every Companion on this platform has been chosen carefully.
Every session is tracked.
Every family is kept informed.
Every concern is reviewed.
Not because we distrust people — but because the people we serve
are vulnerable, and they deserve a system that takes that seriously.

This platform will never be perfect.
People will sometimes fail the trust placed in them.
But the system makes bad behaviour structurally costly,
visible, and consequential.
And it makes good behaviour the natural path for good people.

That is the most a platform can do.
And we will do it without compromise.

---

**The founding question remains:**

> *"How do we create a platform where vulnerable people can
> receive human help with the maximum possible safety,
> traceability, dignity, and accountability?"*

Every decision — from a colour choice to a database field
to a Companion approval — must answer to this question.

---

```
NearDear.in
Master Product Document v2.0
March 2026 | Ahmedabad, India
Private and Confidential

"Someone near. Someone dear."

Founder: Jaydeep Buch
jaydeep@neardear.in
```
