import type {
  Faq,
  Founder,
  Milestone,
  ProcessStep,
  Project,
  Service,
  Stat,
  TeamMember,
} from "./types";

/**
 * Content in this file mirrors angkasaarchitects.com. Project prose, sizes,
 * locations, statuses, credits and photography are reproduced from the
 * studio's own published records rather than paraphrased, so the site cannot
 * drift from the source of truth.
 */

// Angkasa's photography, mirrored into this repo. Served from our own origin
// rather than the studio CMS: that host is intermittently slow, and Next's
// image optimizer has a fixed 7s fetch timeout with no config option, so a
// slow upstream response rendered the "image unavailable" placeholder to
// whoever loaded a page first. Re-run scripts/sync-cms-images.mjs to refresh.
const CMS = "/cms";

export const company = {
  name: "Angkasa Architects",
  founded: 2015,
  motto: "We create space for a better place.",
  hashtag: "#TerbangBersamaAngkasa",
  address: "Jl. Muhammad Yamin No. 47, Pekanbaru, Riau",
  email: "angkasaarchitects@gmail.com",
  phones: ["+62 811-7579-668", "+62 818-0690-2904"],
  instagram: "@angkasaarchitects",
  cities: [
    "Pekanbaru",
    "Jakarta",
    "Bali",
    "Surabaya",
    "Medan",
    "Pontianak",
    "Batam",
  ],
};

export const founders: Founder[] = [
  {
    name: "Ar. Jeffri Angkasa, S.T., IAI.",
    role: "Principal & Co-Founder",
    bio: "Jeffri brought years of experience from a Singapore-based architecture firm into the studio he co-founded in 2015. His approach is structured and experimental in equal measure, working through mass, space function, environment, sunlight, air and materials — from large scale down to the smallest detail. Member of Ikatan Arsitek Indonesia (IAI).",
    image: `${CMS}/2025/01/Jeffri-Angkasa-1024x1024.png`,
    instagram: "@jeffriangkasa",
  },
  {
    name: "Ar. Indri Sisilia, S.T., IAI.",
    role: "Principal & Co-Founder",
    bio: "Indri's background as head of development at a Pekanbaru property company gives the studio its commercial instinct. She and Jeffri hold distinct views on design aesthetics but, like yin and yang, they complement each other — a pairing the studio credits for the unique, bold and unexpected outcomes in its work. Member of Ikatan Arsitek Indonesia (IAI).",
    image: `${CMS}/2025/01/Indri-Sisilia-1024x1024.png`,
    instagram: "@indri_kho_",
  },
];

/** Studio roster as listed on the official About page. */
export const team: TeamMember[] = [
  {
    name: "Ar. Jeffri Angkasa, IAI.",
    role: "Principal",
    image: `${CMS}/2025/01/Jeffri-Angkasa-1024x1024.png`,
  },
  {
    name: "Ar. Indri Sisilia, IAI.",
    role: "Principal",
    image: `${CMS}/2025/01/Indri-Sisilia-1024x1024.png`,
  },
  {
    name: "Muhammad Kurniawan, S.T.",
    role: "Architect",
    image: `${CMS}/2025/01/Muhammad-kurniawan-1024x1024.png`,
  },
  {
    name: "Muhammad Zukhrufi Lutfi, S.T., M. Ars.",
    role: "Architect",
    image: `${CMS}/2025/01/Zukhrufi-lutfhi-1024x1024.png`,
  },
  {
    name: "Afif Eidwar, S.Ds.",
    role: "Designer",
    image: `${CMS}/2025/01/Afif-Eidwar-1024x1024.png`,
  },
  {
    name: "Vedita Tego Kuncoro, S.T.",
    role: "Architect",
    image: `${CMS}/2025/01/Vedita-Tego-Kuncoro-1024x1024.png`,
  },
];

/** Client list exactly as published on the official About page. */
export const clients: string[] = [
  "Arief Muhammad & Tia Pangestika",
  "Ken & Grat",
  "Kaesang Pangarep",
  "Kevin Hendrawan",
  "Ayu Ting Ting",
  "Ivan Gunawan",
  "Krisna Oleh-Oleh Bali",
  "Andre Taulany",
  "Dewa Gede Adiputra & Maharani Kemala",
  "Awkarin",
  "Rachel Vennya",
  "Dyland Pros",
  "Bakajin",
  'Muhammad Ahsan "The Daddies"',
  "Najla Bisyir (Owner of Bittersweet by Najla)",
];

export const achievements: string[] = [
  'Featured in "100+ Indonesian Architecture Firms and Emerging", selected among 100 Arsitek Indonesia',
  "Best Architecture Firm & Best Architect — Inara Award 2019",
];

/** The six disciplines listed under "What We Do" on the official site. */
export const services: Service[] = [
  {
    slug: "private-housing",
    name: "Private Housing",
    description: "Private homes designed from concept through construction detail.",
    detail:
      "Every plan starts from how the household actually lives: where the family gathers, which rooms take the morning sun, how often the kitchen is really used. Form, openings and materials follow from that — and everything specified has to hold up in a humid tropical climate.",
    deliverables: [
      "Plans, elevations and sections",
      "Construction drawings (DED)",
      "3D visualisation, exterior and interior",
      "Bill of quantities and cost plan",
      "Material and finishing schedule",
    ],
  },
  {
    slug: "residential-area",
    name: "Residential Area",
    description: "Planning for small to mid-scale residential developments.",
    detail:
      "From site to block layout, we lay out neighbourhoods that circulate efficiently while still leaving communal space worth living around, with house types that can repeat without becoming monotonous.",
    deliverables: [
      "Site plan and block layout",
      "House type designs and variants",
      "Facade language guide across units",
      "Circulation and communal space plan",
      "Construction drawings per type",
    ],
  },
  {
    slug: "villas-and-resorts",
    name: "Villas and Resorts",
    description: "Retreat and hospitality projects that answer to their landscape.",
    detail:
      "Resort work begins with the terrain rather than the floor plan. Orientation, privacy between units and the sequence from arrival to view are settled before massing, so each unit earns its own outlook instead of repeating the one next door.",
    deliverables: [
      "Site and contour study",
      "Unit typologies and orientation plan",
      "Facade and material palette",
      "Landscape and outdoor area design",
      "Construction drawings per unit type",
    ],
  },
  {
    slug: "commercial-and-office",
    name: "Commercial and Office Complex",
    description: "Offices, retail and business facilities.",
    detail:
      "The first priority is a visitor flow legible enough that you don't need signage everywhere, then operating costs that still make sense ten years out. A facade worth remembering comes after those two are settled.",
    deliverables: [
      "Visitor flow and zoning study",
      "Facade and building identity design",
      "Construction drawings (DED)",
      "Bill of quantities and cost plan",
      "Coordination with structural and MEP consultants",
    ],
  },
  {
    slug: "master-planning",
    name: "Master Planning",
    description: "Large-scale area planning and phased development.",
    detail:
      "Master planning is where circulation, land use and phasing are resolved before any single building is drawn. The aim is a framework that still holds when the programme shifts halfway through — because on projects this size, it will.",
    deliverables: [
      "Land use and zoning framework",
      "Circulation and access strategy",
      "Development phasing plan",
      "Public and green space allocation",
      "Design guidelines for later stages",
    ],
  },
  {
    slug: "architectural-interiors",
    name: "Architectural Interiors",
    description: "Interiors developed as a continuation of the architecture.",
    detail:
      "Interiors are treated as a continuation of the architecture, not a layer applied afterwards. Materials, lighting and furniture are chosen so the inside reads as whole with the outside.",
    deliverables: [
      "Furniture layout per room",
      "Ceiling and lighting plan",
      "Material and colour scheme",
      "Built-in furniture details",
      "3D interior visualisation",
    ],
  },
];

/**
 * The studio's working method. Deliberately states no fee figures and no
 * durations -- those vary per project scope and are settled in consultation,
 * so publishing fixed numbers here would be a claim we cannot stand behind.
 */
export const processSteps: ProcessStep[] = [
  {
    name: "Initial Consultation",
    description:
      "We start by listening: what you want to build, on what site, and for whom. Including the part people usually skip — how many will live or work there five years from now.",
    output: "Brief summary and scope of work",
  },
  {
    name: "Design Concept",
    description:
      "From that brief we shape the spatial idea: how the massing sits on the site, where the openings face, and how sun and air are handled.",
    output: "Preliminary plans, massing and 3D visualisation",
  },
  {
    name: "Design Development",
    description:
      "The approved concept is resolved down to material choices, facade detail and interior arrangement. By the end of this stage the building can be seen whole.",
    output: "Final plans, elevations, sections and material scheme",
  },
  {
    name: "Construction Drawings & Cost Plan",
    description:
      "The design is translated into documents a contractor can build from, with quantities costed so the budget is measurable before work starts.",
    output: "Construction drawings (DED) and bill of quantities",
  },
  {
    name: "Periodic Supervision",
    description:
      "We stay involved through construction to confirm what goes up matches the drawings, and to help make decisions when site conditions demand adjustment.",
    output: "Site visits and progress reports",
  },
];

/**
 * Answers are derived from facts already recorded in this file (city coverage,
 * service list, process stages). Questions about fee and duration are answered
 * honestly without numbers, because those genuinely depend on scope.
 */
export const faqs: Faq[] = [
  {
    question: "Do you only take projects in Pekanbaru?",
    answer: `No. Our studio is in Pekanbaru, but our built work spans ${company.cities.length} cities: ${company.cities.join(", ")}. For projects outside the city, coordination runs online with scheduled site visits.`,
  },
  {
    question: "What kinds of buildings do you work on?",
    answer:
      "Private housing, residential areas, villas and resorts, commercial and office complexes, master planning, and architectural interiors. These six can be taken separately or combined within one project.",
  },
  {
    question: "How does the process work?",
    answer:
      "Five stages: initial consultation, design concept, design development, construction drawings with cost plan, then periodic supervision during construction. Each stage has a defined output and only proceeds once you have approved it.",
  },
  {
    question: "What do I receive at the end?",
    answer:
      "It depends which services you take, but typically plans, elevations, sections, construction-ready drawings, 3D visualisation, material specifications and a bill of quantities. Per-service detail is listed on this page.",
  },
  {
    question: "How much do design services cost?",
    answer:
      "There is no single honest figure for this, because fees follow floor area, complexity and which services you take. We prepare a quote once the scope is clear at the initial consultation — and that consultation itself is free.",
  },
  {
    question: "How long does the design process take?",
    answer:
      "It depends heavily on project scale and how quickly decisions are made at each stage. What we can commit to: a schedule agreed upfront with deadlines per stage, so you know when your approval is needed to keep things moving.",
  },
  {
    question: "Can you help us find a contractor?",
    answer:
      "Yes. We regularly work alongside contractors chosen by the client, and can recommend ones we have built with before. Our drawings are prepared so any competent contractor can build from them, not just one.",
  },
  {
    question: "How do we start?",
    answer:
      "Reach us through the form on the Contact page, WhatsApp, or email. Tell us the site location, rough area and an outline of what you need — that is enough to schedule an initial consultation.",
  },
];

export const milestones: Milestone[] = [
  {
    year: "2015",
    title: "Angkasa Architects founded",
    text: "Jeffri Angkasa and Indri Sisilia established the studio in Pekanbaru, pairing a design background from Singapore with property development experience.",
  },
  {
    year: "2019",
    title: "Early work and recognition",
    text: "Tika House, Jenny ART Center, MP Mall, TH House and PSMTI Riau were all in design or underway. The same year Angkasa won Best Architecture Firm and Best Architect at the Inara Award.",
  },
  {
    year: "2020",
    title: "Public and hospitality work",
    text: "Sariputta Budhist School was completed in Pekanbaru, alongside The Parkville in Rumbai, Saham Rakyat Office in South Jakarta and Bakajin House in Alam Sutera.",
  },
  {
    year: "2021",
    title: "Beyond Riau",
    text: "CI House in Surabaya, Marco Revy House in Pondok Indah, LT House in PIK 2 and Antonius House in Pekanbaru — the studio's most concentrated year of residential work.",
  },
  {
    year: "2022",
    title: "Neighbourhood scale",
    text: `Cassaville, developed with Abode Property in Pekanbaru, took the studio into full residential-area planning. Built work now spans ${company.cities.length} cities.`,
  },
  {
    year: "2026",
    title: "AD House, Jakarta",
    text: "A completed tropical contemporary sanctuary in the dense Pluit district — a full rebuild organised around a central courtyard, and the studio's most extensively documented project to date.",
  },
];

export const projects: Project[] = [
  {
    slug: "ad-house",
    name: "AD House",
    category: "House",
    location: "Pluit, Jakarta",
    year: 2026,
    status: "completed",
    landSize: 300,
    buildingSize: 690.19,
    summary:
      "A tropical contemporary sanctuary in dense Pluit, organised around a central courtyard.",
    description:
      "The house is located in a crowded Pluit area in Jakarta, with a 12x25 metre strip foundation and east-facing orientation. This project is generally challenging because of the urban tropical scene with limited sunlight exposure, ventilation, privacy, and also limited scenery of the outer building. Instead of focusing on the limitation, we choose to focus on the inner layer and embrace the interior in the house. A courtyard is placed as the center of the building, applying a green landscape as a visual orientation as well as the source of natural light and ventilation for all the main area of the house. Built as a New Build overlapping the house the client was previously staying, this project is not just a mere renovating, but a re-evaluation towards building a more sustainable way of living. The space is organized based on a clear zoning between public, semi private, private and service areas — one of the most fundamental decisions being to move the stairs to the side of the building, freeing the family room, dining room and kitchen to align as a whole open space. Material like travertine, natural wood, and black accent are chosen not just because of the aesthetic, but also because of the ability to create a warm and elegant atmosphere.",
    architectsInCharge: ["Wahyu Prima Putra, S.T.", "Abdul Razak, S.T."],
    strategies: [
      "Central courtyard as the source of light and ventilation",
      "Stairs relocated to the side to free the main open space",
      "Clear zoning across public, semi-private, private and service areas",
      "Large glass openings blurring interior and courtyard",
      "Travertine, natural wood and black accents for warmth",
    ],
    source: "official",
    images: [
      `${CMS}/2026/07/R52_2926-Edit-683x1024.jpg`,
      `${CMS}/2026/07/R52_3537-Edit-683x1024.jpg`,
      `${CMS}/2026/07/R52_3533-Edit-683x1024.jpg`,
      `${CMS}/2026/07/R52_2914-Edit-683x1024.jpg`,
      `${CMS}/2026/07/R52_2953-Edit-1024x683.jpg`,
      `${CMS}/2026/07/R52_3555-Edit-1024x683.jpg`,
    ],
  },
  {
    slug: "ci-house",
    name: "CI House",
    category: "House",
    location: "Surabaya",
    year: 2021,
    status: "ongoing",
    landSize: 450,
    buildingSize: 690,
    summary:
      "A contemporary residence built around a double triangle mass floating on the upper floors.",
    description:
      "CI House was a residence house that was designed with the contemporary architecture principle. The geometry of the building had taken the shape of a double triangle mass that was floating on the 2nd and 3rd floor. The façade of the building was dominated by the shape of triangle, the front mass was covered with metal cladding that formed a shadow on the front part of the building. The triangular mass on the 3rd floor would look like a “peep hole” from the front forming a repetition of triangle geometry. On the first floor area, there was a wide garden by the side of the main corridor creating a dramatic experience when passers-by. The garden also functioned as natural sunlight and air circulation distributed into the house. The 2nd floor was functioned as a private area that consisted of the master bedroom and children’s bedroom, with a small patio between them looking straight into the garden area below.",
    architectsInCharge: ["M. Zukhrufi Lutfi, S.T., M. Ars"],
    strategies: [
      "Double triangle mass floating on the 2nd and 3rd floor",
      "Metal cladding casting shadow across the front mass",
      "Third-floor triangular mass reading as a “peep hole”",
      "Side garden driving daylight and air circulation",
      "Patio between bedrooms overlooking the garden",
    ],
    source: "official",
    images: [
      `${CMS}/2025/01/1-edit-3-1024x576.jpg`,
      `${CMS}/2025/01/2-edit-3-1024x576.jpg`,
      `${CMS}/2025/01/3-edit-2-1-1024x576.jpg`,
      `${CMS}/2025/01/4-edit-2-1-1024x576.jpg`,
      `${CMS}/2025/01/5-edit-1-1024x576.jpg`,
      `${CMS}/2025/01/6-edit-1-1024x576.jpg`,
    ],
  },
  {
    slug: "marco-revy-house",
    name: "Marco Revy House",
    category: "House",
    location: "Pondok Indah, Jakarta",
    year: 2021,
    status: "design",
    landSize: 1000,
    buildingSize: 1427.35,
    summary:
      "A modern futuristic tropical house in Pondok Indah, shaped after the metaphor of a female frame.",
    description:
      "The land lot from MR House was rectangular in shape and east oriented, therefore the design was focused on the direct sunlight to the front of the house. The 2 levels with rooftop plus 1 semi-basement located in Pondok Indah was designed with a modern futuristic tropical theme. The design development focused on the mass and geometry for every angle of the house, designed as such to adopt the metaphor of a female frame that was tender but also strong and powerful. The first-floor mass was made light with a transparent façade using numerous windows and openings so that visual quality shines through from front to back, maximising natural sunlight and saving energy. This house was designed as a one stop entertainment house. At the rooftop there was a helipad e-hang and relaxation area with outdoor barbeque, spa and saloon. The basement area was utilised as a garage and entertainment room for pool tables, karaoke lounge and home theatre.",
    architectsInCharge: ["Muhammad Zukhrufi Lutfi, S.T., M.Ars"],
    strategies: [
      "Massing shaped after the metaphor of a female frame",
      "Curved angles and aerodynamic physical form",
      "Transparent ground-floor facade for front-to-back daylight",
      "Rooftop helipad, spa and outdoor barbeque",
      "Semi-basement garage and entertainment level",
    ],
    source: "official",
    images: [
      `${CMS}/2025/01/1-1024x576.png`,
      `${CMS}/2025/01/Malam-1-1024x576.png`,
      `${CMS}/2025/01/11-1-1024x576.png`,
      `${CMS}/2025/01/4-1024x576.png`,
      `${CMS}/2025/01/foyer-lt1.02-1024x576.png`,
      `${CMS}/2025/01/LDK-piano-09-1024x576.png`,
    ],
  },
  {
    slug: "lt-house",
    name: "LT House",
    category: "House",
    location: "PIK 2, North Jakarta",
    year: 2021,
    status: "ongoing",
    landSize: 525,
    buildingSize: 1224.95,
    summary:
      "“Curvy House” — a four-storey home whose arched facade carries through into the interior.",
    description:
      "“Curvy House” is the facade concept for this house. The facade composition is designed to be more dynamic, with different height levels for each arch. This idea arose from the background of complex space requirements with a landform that extends backwards and has 4 floors, so the building is designed in such a way that it does not have a monotonous design form. Incorporating the exterior concept into the interior, there are also curved lines in the wall to ceiling area, creating a continuous impression. From the main entrance there is a corridor leading to the LDK area, with curvy wall panels continuous to the ceiling and rotating stairs to the 2nd floor. The LDK area is designed with double height and every meeting of ceiling and walls is designed as if there are no breaks. Material tones between exterior and interior are matched, dominated by white, grey and wood shades. This house is also equipped with a swimming pool with a void above it, to maximise lighting and ventilation into the house.",
    architectsInCharge: ["Afif Eidwar, S.Ds."],
    strategies: [
      "Arches at varying heights across the facade",
      "Curved lines carried from exterior into wall-to-ceiling interior",
      "Double-height LDK with seamless wall and ceiling junctions",
      "White, grey and wood tones matched inside and out",
      "Swimming pool set under a void for light and ventilation",
    ],
    source: "official",
    images: [
      `${CMS}/2024/02/LT-HOUSE-V01-1024x576.png`,
      `${CMS}/2024/02/LT-HOUSE-V02a-1024x576.png`,
      `${CMS}/2024/02/LT-HOUSE-V10-1024x576.png`,
      `${CMS}/2024/02/LT-HOUSE-INT-V08-1024x576.png`,
      `${CMS}/2024/02/LT-HOUSE-INT-V06-1024x576.png`,
      `${CMS}/2024/02/LT-HOUSE-INT-V14-1024x576.jpg`,
    ],
  },
  {
    slug: "th-house",
    name: "TH House",
    category: "House",
    location: "Pekanbaru",
    year: 2019,
    status: "ongoing",
    landSize: 1800,
    buildingSize: 2387,
    summary:
      "A modern classic house on the largest plot in an elite Pekanbaru development.",
    description:
      "A house taking modern classic as its principal concept. It sits in one of Pekanbaru's elite residential developments and occupies the largest plot in the complex. The main facade is symmetrical, emphasising the centre as the primary entrance. Entering the foyer, you take in the core of the house — the living, dining and pantry areas, together with a generous piano area in an open layout without partitions. To the rear is an extension building dedicated to the owner's special events and sporting activities. The house has 7 bedrooms and 9 bathrooms.",
    architectsInCharge: ["Muhammad Kurniawan, S.T."],
    strategies: [
      "Symmetrical main facade centred on the entrance",
      "Open-plan living, dining, pantry and piano area",
      "Rear extension for events and sport",
      "Seven bedrooms and nine bathrooms",
    ],
    source: "official",
    images: [
      `${CMS}/2025/01/TH-HOUSE-V01-1024x569.jpg`,
      `${CMS}/2025/01/TH-HOUSE-V03-1024x576.jpg`,
      `${CMS}/2025/01/TH-HOUSE-V04-1024x576.png`,
      `${CMS}/2025/01/tangga-putih-1024x576.jpg`,
      `${CMS}/2025/01/TH-HOUSE-V05-1024x576.jpg`,
      `${CMS}/2025/01/LDK-1024x576.jpg`,
    ],
  },
  {
    slug: "antonius-house",
    name: "Antonius House",
    category: "House",
    location: "Pekanbaru",
    year: 2021,
    status: "completed",
    landSize: 200,
    buildingSize: 365,
    summary:
      "A “cantilever canopy house” that turns a modest plot into a single bold gesture.",
    description:
      "The design concept of the house was “cantilever canopy house”. The idea was inspired by the desire to create one unique element of design on a not so large piece of land. The cantilever canopy stretched 5 metres and lengthened 6 metres at the front of the house. The combination of planter box and synthetic rattan finishing created a tropical and natural visual façade quality. On the same note as the exterior concept, the interior offered a simple and neat arrangement of rooms, with a wide innercourt on the east side giving sunlight and natural air circulation into the house. Material and finishing were dominated by white combined with woody elements to add texture and warmth. The unique element of the interior was the staircase — the cantilever concept implemented in every flight, a dagger-shaped cantilever with a thin blade at the end running one metre.",
    architectsInCharge: ["Muhammad Zukhrufi Lutfi, S.T., M. Ars"],
    strategies: [
      "Five-metre cantilever canopy across the frontage",
      "Planter box and synthetic rattan facade finish",
      "East-side innercourt for daylight and cross ventilation",
      "Cantilever concept repeated in every staircase flight",
    ],
    source: "official",
    images: [
      `${CMS}/2025/01/ANTONIUS-HOUSE-V01-1024x576.jpg`,
      `${CMS}/2025/01/ANTONIUS-HOUSE-V02-1024x576.jpg`,
      `${CMS}/2025/01/ANTONIUS-HOUSE-V09-1024x576.png`,
      `${CMS}/2025/01/ANTONIUS-HOUSE-V03-1024x576.png`,
      `${CMS}/2025/01/ANTONIUS-HOUSE-V04-1024x576.png`,
      `${CMS}/2025/01/ANTONIUS-HOUSE-V05-1024x576.png`,
    ],
  },
  {
    slug: "bakajin-house",
    name: "Bakajin House",
    category: "House",
    location: "Alam Sutera, Tangerang",
    year: 2020,
    status: "ongoing",
    landSize: 976,
    buildingSize: 2053,
    summary:
      "A modern tropical house built around its owner's car collection, with a batman-cave garage.",
    description:
      "The Bakajin house was located in Alam Sutera in Tangerang. The design of this house was dedicated to the owner’s love of automobiles and also as the owner of RWB in Indonesia. Building on the concept of modern tropical with the integration of outdoor and indoor area as a response to the tropical climate here in Indonesia. Varieties of vegetation were planted in the outdoor area, with numerous openings and glass walls combined with darker tones of marbling skin and a special grey wood finishing, all to achieve the best ventilation and lighting. A few interesting elements were the garage designed with a batman cave concept, with a car elevator from basement to first floor as a showcase that could be cherished from the living dining kitchen area. The façade was implemented with strong horizontal lines and a forward-backward box composition, including a 6-metre floating cantilever housing the master bedroom, designed with no column and no exposure to the façade. The swimming pool area was located on the 2nd floor.",
    architectsInCharge: ["Vedita Tego Kuncoro, S.T."],
    strategies: [
      "Batman-cave garage with car elevator from basement to ground floor",
      "Six-metre floating cantilever housing the master bedroom, column-free",
      "Strong horizontal lines with forward-backward box composition",
      "Swimming pool raised to the second floor for privacy",
      "Glass walls with dark marbling and grey wood finishing",
    ],
    source: "official",
    images: [
      `${CMS}/2023/02/BAKAJIN-HOUSE-V05-1024x576.jpg`,
      `${CMS}/2023/02/BAKAJIN-HOUSE-V06-1024x576.jpg`,
      `${CMS}/2023/02/BAKAJIN-HOUSE-V07-1024x768.jpg`,
      `${CMS}/2023/02/BAKAJIN-HOUSE-V08-1024x768.png`,
      `${CMS}/2023/02/BAKAJIN-HOUSE-V09-1024x576.png`,
    ],
  },
  {
    slug: "tika-house",
    name: "Tika House",
    category: "House",
    location: "Pekanbaru",
    year: 2019,
    status: "design",
    summary:
      "An industrial-concept dormitory built around communal space for its tenants.",
    description:
      "Tika House was a dormitory with its own uniqueness, implementing the industrial design concept with exposed and unfinished material to express the soft texture that was popular at the time. We wanted to create a modern and simple feel that could be implemented into minimalist contemporary design. The grey colour created a cool and neutral outdoor, and brick colour gave a warm and light sensation. The use of sequence on the exterior created a more dynamic building, as if a few blocks merged into one solid design, with a slanted design in every block and personal balconies. Tika House was also designed to tackle the biophilic issue in a wider context — not only seeing the natural habitat but seeing humans as living organisms to be treated equally. The dormitory provided communal space for tenants to interact and socialise, located on the first floor with a void connecting to the 2nd floor and rooftop.",
    architectsInCharge: ["Muhammad Kurniawan, S.T."],
    strategies: [
      "Industrial concept using exposed, unfinished material",
      "Blocks merged into one mass with slanted forms and private balconies",
      "Ground-floor communal space with void to upper levels",
      "Biophilic approach extended to the tenants themselves",
    ],
    source: "official",
    images: [
      `${CMS}/2023/02/TIKA-KOS-V04-1024x772.jpg`,
      `${CMS}/2023/02/TIKA-KOS-V05-1024x683.jpg`,
      `${CMS}/2023/02/TIKA-KOS-V06-1024x683.jpg`,
      `${CMS}/2023/02/TIKA-KOS-V07-1024x614.jpg`,
      `${CMS}/2023/02/TIKA-KOS-V08-1024x683.jpg`,
      `${CMS}/2023/02/TIKA-KOS-V09-1024x768.jpg`,
    ],
  },
  {
    slug: "cassaville",
    name: "Cassaville",
    category: "Housing",
    location: "Pekanbaru",
    year: 2022,
    status: "ongoing",
    summary:
      "A futuristic housing development with Abode Property, aimed at first-time buyers.",
    description:
      "Cassaville was developed by Angkasa Architects with Abode Property, located in Pekanbaru city with a futuristic concept and out of the box design. The housing area had 2 types with the same façade design. The unique selling point of the houses lay in the alignment of straight lines and curves mixed into a unity of design, as well as the mixture of brick material and line texture on the walls. The futuristic concept suited young generations looking for a future house at an affordable price. The house also had a complete package, with foyer and living dining kitchen facing directly onto the backyard, with 3 bedrooms.",
    architectsInCharge: ["Arvin Farez, S.Ars"],
    strategies: [
      "Two house types sharing one facade language",
      "Straight lines and curves resolved into a single composition",
      "Brick and line-textured wall surfaces",
      "Living dining kitchen opening directly to the backyard",
    ],
    source: "official",
    images: [
      `${CMS}/2023/02/CASSAVILLE-V02-1024x576.jpg`,
      `${CMS}/2023/02/CASSAVILLE-V03-1024x576.jpg`,
      `${CMS}/2023/02/CASSAVILLE-V04-1024x576.jpg`,
      `${CMS}/2023/02/CASSAVILLE-V05-1024x576.jpg`,
      `${CMS}/2023/02/CASSAVILLE-V06-1024x544.jpg`,
      `${CMS}/2023/02/CASSAVILLE-V07-1024x574.jpg`,
    ],
  },
  {
    slug: "the-parkville",
    name: "The Parkville",
    category: "Housing",
    location: "Rumbai",
    year: 2020,
    status: "ongoing",
    landSize: 60000,
    summary:
      "Affordable housing given diverse rooflines so no two buyers get the same house.",
    description:
      "The initial idea in the design of The Parkville was to revolutionise the small housing environment to be more interesting, comfortable and earnest. With an affordable price, we wanted to create a worthy but bold design. We designed the houses with diverse roofs, so that every buyer would have their own signature home design. The Parkville had a one-way circulation concept and one-gate system that made it easy for every resident to move around. The Parkville also provided numerous facilities that other smaller housing areas normally did not have, such as a sports field, jogging track and children's playground. At night, every house had a bold light line shining through to make The Parkville even more attractive.",
    architectsInCharge: ["Arvin Farez, S.Ars"],
    strategies: [
      "Diverse rooflines giving each buyer a distinct house",
      "One-way circulation with a single-gate system",
      "Sports field, jogging track and playground on site",
      "Signature illuminated line on every house at night",
    ],
    source: "official",
    images: [
      `${CMS}/2023/02/THE-PARKVILLE-V01-1024x576.jpg`,
      `${CMS}/2023/02/THE-PARKVILLE-V02-1024x576.jpg`,
      `${CMS}/2023/02/THE-PARKVILLE-V03-1024x576.jpg`,
      `${CMS}/2023/02/THE-PARKVILLE-V04-1024x576.jpg`,
      `${CMS}/2023/02/THE-PARKVILLE-V05-1024x573.jpg`,
      `${CMS}/2023/02/THE-PARKVILLE-V06-768x767.png`,
    ],
  },
  {
    slug: "jenny-art-center",
    name: "Jenny ART Center",
    category: "Commercial",
    location: "Serpong, Tangerang",
    year: 2019,
    status: "design",
    landSize: 180,
    buildingSize: 540,
    summary:
      "Two shophouses merged behind a curved brick facade patterned after batik craftsmanship.",
    description:
      "“Ethnicity in New Look” — a concept we wanted to embrace for the design of this art center located in Tangerang. The existing building was two shophouses on the main road, which made it a challenge to embrace the design on the outlook of the place. The flat image of the shophouses was camouflaged with an interesting placement of curvy composition arranged in a curve and overlap. We chose brick material arranged along the curvy shape of the façade and embraced ethnicity with craftsmanship batik patterns using the bricks, adding uniqueness to the building's outlook. For the indoor area, the 2 shophouses were merged into one with void and trees as the ideation that brought a natural feel into the space, serving as an oasis room combined with architectural and ethnic patterns.",
    architectsInCharge: ["Muhammad Zukhrufi Lutfi, S.T., M. Ars"],
    strategies: [
      "Curved, overlapping composition camouflaging a flat shophouse frontage",
      "Brick laid to batik craftsmanship patterns",
      "Two shophouses merged into a single interior",
      "Void and trees forming an interior oasis",
    ],
    source: "official",
    images: [
      `${CMS}/2023/02/JENNY-ART-CENTER-V01-849x1024.jpg`,
      `${CMS}/2023/02/JENNY-ART-CENTER-V02-1024x576.jpg`,
      `${CMS}/2023/02/JENNY-ART-CENTER-V03-1024x576.jpg`,
      `${CMS}/2023/02/JENNY-ART-CENTER-V04-1024x576.jpg`,
      `${CMS}/2023/02/JENNY-ART-CENTER-V05-1024x576.jpg`,
      `${CMS}/2023/02/JENNY-ART-CENTER-V06-1024x576.jpg`,
    ],
  },
  {
    slug: "mp-mall",
    name: "MP Mall",
    category: "Commercial",
    location: "Pekanbaru",
    year: 2019,
    status: "design",
    landSize: 1700,
    buildingSize: 650,
    summary:
      "A new face for one of Pekanbaru's oldest malls, drawn from mountain silhouette and Melayu pattern.",
    description:
      "As one of the oldest malls in Pekanbaru, it made us at Angkasa Architects very excited to design and create a new face with a modern contemporary concept for this old building. The design concept for the façade of Mal Pekanbaru was a longing and romancing towards the natural environment in the heart of Pekanbaru city. Pekanbaru with its low topography became the fundamental idea for the façade and hanging space. The silhouette of high mountains was incorporated into the lines at the front of the building. Without overlooking the Melayu influence, the façade design was collaborated with the mountain silhouette into a unified design, with the Melayu pattern applied at the mall entrance. As a contemporary element, the hook area aligned with the pedestrian crossroad was given a floating container functioning as a culinary area and canopy for pedestrians and the bus stop. The corner area was changed with an LED screen covering the cylinder on the façade, functioning as signage and promotional panel.",
    architectsInCharge: ["Muhammad Zukhrufi Lutfi, S.T., M. Ars"],
    strategies: [
      "Mountain silhouette translated into facade lines",
      "Melayu pattern applied at the mall entrance",
      "Floating container as culinary area and pedestrian canopy",
      "LED cylinder at the corner for signage and promotion",
    ],
    source: "official",
    images: [
      `${CMS}/2023/02/01.-MP-PERSPECTIVE-1-1024x576.jpg`,
      `${CMS}/2023/02/02.-MP-PERSPECTIVE-2-1024x581.jpg`,
      `${CMS}/2023/02/03.-MP-PERSPECTIVE-3-1024x576.jpg`,
      `${CMS}/2023/02/05.-MP-PERSPECTIVE-5-1024x576.jpg`,
      `${CMS}/2023/02/06.-MP-PERSPECTIVE-6-1024x576.jpg`,
      `${CMS}/2023/02/07.-MP-PERSPECTIVE-7-1024x576.jpg`,
    ],
  },
  {
    slug: "saham-rakyat-office",
    name: "Saham Rakyat Office",
    category: "Interior",
    location: "South Jakarta",
    year: 2020,
    status: "completed",
    landSize: 720,
    summary:
      "A co-working interior where each division's function carries its own form and pattern.",
    description:
      "The first step of designing this co-working space was to divide it into smaller sections and plant functional need into every section. Each function has its own unique characteristic and each function is done by a different division, therefore the interior design is expected to carry different shape and pattern. Despite the differences, a unity of design is required by combining a few concepts represented by basic forms and prime colours. The flexibility of stocks graphics is the inspiration behind this design.",
    architectsInCharge: [
      "Afif Eidwar, S.Ds.",
      "Wahyu Prima Putra, S.T.",
      "Vedita Tego Kuncoro, S.T.",
    ],
    strategies: [
      "Space divided by functional need per division",
      "Distinct shape and pattern for each function",
      "Unity held by basic forms and prime colours",
      "Stock-graphic flexibility as the design inspiration",
    ],
    source: "official",
    images: [
      `${CMS}/2024/02/SAHAM-RAKYAT-V01-1024x683.jpg`,
      `${CMS}/2024/02/SAHAM-RAKYAT-V02-1024x683.jpg`,
      `${CMS}/2024/02/SAHAM-RAKYAT-V03-1024x683.jpg`,
      `${CMS}/2024/02/SAHAM-RAKYAT-V04-1024x683.jpg`,
      `${CMS}/2024/02/SAHAM-RAKYAT-V05-1024x683.jpg`,
      `${CMS}/2024/02/SAHAM-RAKYAT-V06-1024x880.jpg`,
    ],
  },
  {
    slug: "psmti-riau",
    name: "PSMTI Riau",
    category: "Public Building",
    location: "Pekanbaru",
    year: 2019,
    status: "design",
    landSize: 10000,
    buildingSize: 3088,
    summary:
      "A Chinese cultural complex where a ramp curls the building like a dragon around its columns.",
    description:
      "PSMTI was a Chinese society organisation in Indonesia. This project was a Chinese Cultural Housing area that included a Chinese surname house, safe house, and building for PSMTI in Pekanbaru. The overall concept emphasised traditional Chinese architecture with a modern twist. The main building was designed with a higher mass to show respect to the traditional Melayu stage house. The ramp was designed to surround the PSMTI building as an analogy to a dragon curling the columns inside the building, where those columns served as a metaphor for the diversity of Chinese surnames. The roof took the traditional Chinese form with high slanted ceilings and a curvy top in gold as a symbol of prosperity.",
    architectsInCharge: ["Vedita Tego Kuncoro, S.T."],
    strategies: [
      "Raised main mass in deference to the Melayu stage house",
      "Ramp curling the building as a dragon analogy",
      "Interior columns as a metaphor for Chinese surname diversity",
      "Traditional slanted roof with a gold curved top",
    ],
    source: "official",
    images: [
      `${CMS}/2023/02/PSMTI-V01-1024x576.png`,
      `${CMS}/2023/02/PSMTI-V02-1024x576.png`,
      `${CMS}/2023/02/PSMTI-V03-1024x576.png`,
      `${CMS}/2023/02/PSMTI-V04-1024x576.png`,
      `${CMS}/2023/02/PSMTI-V05-1024x576.png`,
      `${CMS}/2023/02/PSMTI-V06-768x432.png`,
    ],
  },
  {
    slug: "sariputta-buddhist-school",
    name: "Sariputta Budhist School",
    category: "Hospitality",
    location: "Pekanbaru, Riau",
    year: 2020,
    status: "completed",
    landSize: 450,
    buildingSize: 1100,
    summary:
      "A shophouse renovation whose facade panels are modelled on the lotus flower.",
    description:
      "This project was the renovation of a shophouse used as a Sunday Buddhist school in Pekanbaru. The initial idea for the exterior façade was adapted from the shape of a lotus flower, symbolising resurrection and enlightenment. The lotus flower panels were arranged into two parts — a module of lotus petals and a module of massive closure — then arranged horizontally and vertically. The grey gradation on the panels made this shophouse façade very interesting and different from shophouse façades in general. Not only the façade design: the rooftop area and canopy were designed according to the shape of the lotus flower so that the design would be a unity. The rooftop area functioned as a meditation room and common room.",
    architectsInCharge: ["Wahyu Prima Putra, S.T."],
    strategies: [
      "Facade panels modelled on lotus petals and closure modules",
      "Grey gradation distinguishing it from ordinary shophouse fronts",
      "Rooftop and canopy following the same lotus geometry",
      "Rooftop used as meditation and common room",
    ],
    source: "official",
    images: [
      `${CMS}/2023/02/SARIPUTTA-MP-V01-819x1024.jpg`,
      `${CMS}/2023/02/SARIPUTTA-V01-820x1024.jpg`,
      `${CMS}/2023/02/IMG_20230705_142750-576x1024.jpg`,
      `${CMS}/2023/02/SARIPUTTA-V03-1024x682.jpg`,
      `${CMS}/2023/02/SARIPUTTA-V06-1024x569.jpg`,
      `${CMS}/2023/02/SARIPUTTA-V05-1024x569.jpg`,
    ],
  },

  /* ------------------------------------------------------------------ *
   * Instagram-sourced records below. These do NOT appear on
   * angkasaarchitects.com and their prose is unverified — retained at the
   * client's request pending review. Marked `source: "instagram"` so the UI
   * can flag them, and deliberately left without `strategies`, since there
   * is no authoritative description to derive them from.
   * ------------------------------------------------------------------ */
  {
    slug: "at-house",
    name: "AT House",
    category: "House",
    location: "Serpong, South Tangerang",
    year: 2026,
    summary:
      "Deconstructivist home for Arief Muhammad & Tia Pangestika, with a floating cantilever and edible garden.",
    description:
      "Designed for Arief Muhammad and Tia Pangestika, AT House takes a deconstructivist approach marked by sharp lines, dynamic tilted massing and a cantilever that appears to float. Drawing on the owners' love of gardening, the planting is functional as well as decorative — chosen so it can be harvested for everyday cooking. On a plot of roughly 200 m² it still accommodates a swimming pool, generous open space, a rooftop garden and an underground garage serving as a gallery for the owner's classic car collection.",
    source: "instagram",
    images: [],
    imageSeed: "angkasa-at-house-facade",
  },
  {
    slug: "l-house",
    name: "L House",
    category: "House",
    location: "Serpong, South Tangerang",
    year: 2026,
    summary:
      "A tropical house with a patterned timber lattice facade and a waterfall-edged pool.",
    description:
      "L House presents a geometrically patterned timber lattice facade that filters light while giving the building its visual identity. In the rear garden, a swimming pool with a waterfall wall sits among dense tropical planting, framed by full-height glass that dissolves the boundary between inside and out.",
    source: "instagram",
    images: [],
    imageSeed: "angkasa-l-house-facade",
  },
  {
    slug: "g-house",
    name: "G House",
    category: "House",
    location: "Serpong, South Tangerang",
    year: 2026,
    summary:
      "A family home wrapped in vertical timber, with a waterfall pool at its centre.",
    description:
      "G House wraps its facade in warm vertical timber, framing a family swimming pool with a waterfall wall among mature trees. The outdoor space is designed as an extension of the family room — a place for children to play and for the household to gather in shade through the day.",
    source: "instagram",
    images: [],
    imageSeed: "angkasa-g-house-facade",
  },
  {
    slug: "ska-mall-extension",
    name: "SKA Mall Extension with 21 Cineplex",
    category: "Commercial",
    location: "Pekanbaru",
    summary:
      "A mall extension with cinema as the primary draw for visitor traffic.",
    description:
      "An extension to SKA Mall designed so the new cinema area connects seamlessly with the existing visitor flow, while giving the addition its own facade identity as a marker of the new wing.",
    source: "instagram",
    images: [],
    imageSeed: "angkasa-ska-mall-extension",
  },
  {
    slug: "ochado-cafe",
    name: "Ochado Cafe",
    category: "Commercial",
    location: "Pekanbaru",
    summary: "A cafe whose open frontage blurs the line between inside and out.",
    description:
      "Ochado Cafe blurs the boundary between the interior and the terrace with full folding openings, letting the cafe spill into the outdoor space during peak hours.",
    source: "instagram",
    images: [],
    imageSeed: "angkasa-ochado-cafe",
  },
  {
    slug: "p-villas",
    name: "P Villas",
    category: "Villa & Resort",
    location: "West Sumatra",
    summary: "A villa cluster that follows the contours of its hillside site.",
    description:
      "P Villas follows the contours of its hillside site in West Sumatra rather than levelling them, so each unit gains a different orientation and view while remaining private from its neighbours.",
    source: "instagram",
    images: [],
    imageSeed: "angkasa-p-villas",
  },
];

export const stats: Stat[] = [
  { value: String(company.founded), label: "Founded in Pekanbaru" },
  {
    value: `${projects.filter((p) => p.source === "official").length}+`,
    label: "Documented projects",
  },
  { value: String(company.cities.length), label: "Cities covered" },
  { value: "2019", label: "Best Architecture Firm, Inara Award" },
];
