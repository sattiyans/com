export type ToolFaq = { question: string; answer: string };

export type ToolDef = {
  slug: string;
  href: string;
  name: string;
  shortName: string;
  /** Exact H1 — primary search phrase people type */
  h1: string;
  category: string;
  /** Primary search intent phrase */
  primaryKeyword: string;
  description: string;
  keywords: string;
  summary: string;
  features: string[];
  howItWorks: string[];
  faqs: ToolFaq[];
};

export const TOOLS: ToolDef[] = [
  {
    slug: "lhdn-tax-relief",
    href: "/tools/lhdn-tax-relief",
    name: "Free LHDN Tax Relief Calculator Malaysia (EPF, SSPN, PRS)",
    shortName: "LHDN Tax Relief Optimizer",
    h1: "LHDN Tax Relief Calculator Malaysia",
    category: "Finance",
    primaryKeyword: "lhdn tax relief calculator",
    description:
      "Free LHDN tax relief calculator for Malaysia. Estimate personal income tax savings from EPF, lifestyle, medical, sports, SSPN & PRS reliefs. 100% offline — no signup.",
    keywords:
      "lhdn tax relief calculator, lhdn tax calculator, malaysia income tax calculator, personal tax relief malaysia, epf tax relief, sspn tax relief, prs tax relief, lifestyle relief lhdn, cukai pendapatan relief",
    summary:
      "Enter your annual income, toggle claimable LHDN reliefs under standard caps, and see estimated tax saved with Malaysia’s progressive brackets. Runs entirely on your device — nothing is uploaded.",
    features: [
      "Progressive resident tax bracket estimate",
      "EPF, lifestyle, sports, medical, SSPN, PRS reliefs",
      "Live tax-saved comparison",
      "No signup · no server · educational use",
    ],
    howItWorks: [
      "Enter chargeable income before reliefs (RM).",
      "Enable reliefs you can claim and adjust amounts within common caps.",
      "The tool recalculates tax with and without reliefs using progressive brackets.",
      "Review estimated tax saved and which reliefs move the needle.",
    ],
    faqs: [
      {
        question: "Is this an official LHDN calculator?",
        answer:
          "No. This is an educational estimate for planning. Always confirm figures with LHDN e-Filing, IRBM guidelines, or a licensed tax agent before filing.",
      },
      {
        question: "Does my income data leave the browser?",
        answer:
          "No. All calculations run client-side with JavaScript. Nothing is sent to a server or stored remotely.",
      },
      {
        question: "Which tax year do the reliefs follow?",
        answer:
          "Relief caps and brackets are illustrative of common resident individual rules (recent YA patterns). Caps change over time — verify against the current year of assessment.",
      },
    ],
  },
  {
    slug: "exif-stripper",
    href: "/tools/exif-stripper",
    name: "Free EXIF Stripper Online — Remove GPS & Metadata From Photos",
    shortName: "EXIF / Metadata Stripper",
    h1: "EXIF Stripper — Remove GPS From Photos",
    category: "Privacy",
    primaryKeyword: "exif stripper online",
    description:
      "Free EXIF stripper online. View GPS, camera model & exposure metadata, then download a clean JPEG with EXIF removed. Runs in your browser — photos never uploaded.",
    keywords:
      "exif stripper, exif stripper online, remove exif data, remove gps from photo, metadata remover, strip exif jpeg, photo privacy tool, remove location from photo",
    summary:
      "Drop a JPEG or WebP to inspect embedded EXIF (GPS, camera model, exposure). Download a re-encoded image with metadata stripped. Privacy-first: files never leave your device.",
    features: [
      "Read common EXIF / GPS tags",
      "Canvas re-encode to strip metadata",
      "JPEG · WebP · PNG support",
      "No upload · fully private",
    ],
    howItWorks: [
      "Choose or drop an image file.",
      "The tool parses JPEG APP1/EXIF segments locally when present.",
      "Preview metadata such as camera make/model, datetime, and GPS.",
      "Click download to re-encode via canvas — EXIF is not copied into the new file.",
    ],
    faqs: [
      {
        question: "Will stripping EXIF remove GPS location?",
        answer:
          "Yes for typical JPEG EXIF. Re-encoding through canvas produces a new image without the original EXIF APP1 segment, including GPS tags.",
      },
      {
        question: "Are my photos uploaded?",
        answer:
          "Never. Parsing and stripping happen with FileReader, typed arrays, and canvas in your browser only.",
      },
      {
        question: "Does this work for PNG and WebP?",
        answer:
          "You can load them and download a stripped JPEG. Classic EXIF is most common on JPEG; PNG/WebP may show little or no EXIF.",
      },
    ],
  },
  {
    slug: "cron-parser",
    href: "/tools/cron-parser",
    name: "Cron Expression Parser Online — Next Run Times Explained",
    shortName: "Cron Parser & Visualizer",
    h1: "Cron Expression Parser Online",
    category: "DevOps",
    primaryKeyword: "cron expression parser",
    description:
      "Free cron expression parser online. Translate crontab strings into plain English and see the next 10 run times in your timezone. No API — pure JavaScript.",
    keywords:
      "cron expression parser, cron parser online, crontab explained, cron next run, cron schedule visualizer, parse cron expression, */15 cron meaning",
    summary:
      "Paste a 5-field cron expression (e.g. */15 * * * *) for an instant human-readable explanation and the next 10 scheduled timestamps in your local timezone.",
    features: [
      "Human-readable cron breakdown",
      "Next 10 execution times (local TZ)",
      "Step, range, and list field support",
      "Works offline in the browser",
    ],
    howItWorks: [
      "Type or paste a standard 5-field cron string.",
      "Optional examples fill common schedules (weekdays, monthly, etc.).",
      "Fields are expanded (*, ranges, steps) into match sets.",
      "The visualizer walks minute-by-minute to list the next matching runs.",
    ],
    faqs: [
      {
        question: "What cron format is supported?",
        answer:
          "Standard 5-field cron: minute hour day-of-month month day-of-week. Some 6-field strings are accepted by dropping a leading seconds field.",
      },
      {
        question: "Are next runs in UTC or local time?",
        answer:
          "Local browser timezone, formatted with your locale settings.",
      },
      {
        question: "Does day-of-month and day-of-week use OR logic?",
        answer:
          "Yes when both are restricted (neither is *), matching common cron semantics where either field can match.",
      },
    ],
  },
  {
    slug: "svg-sanitizer",
    href: "/tools/svg-sanitizer",
    name: "SVG Sanitizer & Minifier Online — Clean Figma / Illustrator SVG",
    shortName: "SVG Sanitizer & Minifier",
    h1: "SVG Sanitizer & Minifier Online",
    category: "Frontend",
    primaryKeyword: "svg sanitizer online",
    description:
      "Free SVG sanitizer and minifier online. Clean Figma/Illustrator junk, strip metadata & comments, preview inline, and copy optimized SVG. Client-side only.",
    keywords:
      "svg sanitizer, svg minifier online, clean svg figma, optimize svg illustrator, remove svg metadata, svg cleaner tool, minify svg",
    summary:
      "Paste SVG exported from Figma or Illustrator. Strip comments, metadata, editor namespaces, and noisy attributes. Preview live and copy a leaner asset.",
    features: [
      "DOMParser-based cleanup",
      "Strip metadata, titles, editor attrs",
      "Optional whitespace minify",
      "Live inline preview + copy",
    ],
    howItWorks: [
      "Paste raw SVG markup into the input.",
      "The tool parses with DOMParser and removes junk nodes/attributes.",
      "Optional minify collapses whitespace for smaller payloads.",
      "Preview updates instantly; copy the optimized markup.",
    ],
    faqs: [
      {
        question: "Will sanitizing break my SVG?",
        answer:
          "It targets editor metadata and common bloat. Complex SVGs with required IDs or CSS may need a second pass — always preview before shipping.",
      },
      {
        question: "Is this safer than uploading to an optimizer SaaS?",
        answer:
          "For privacy, yes. Your SVG never leaves the browser. For maximum compression, dedicated SVGO pipelines can still go further.",
      },
      {
        question: "Does it remove inline styles?",
        answer:
          "Yes, the default pass drops style attributes and several editor-specific attributes to reduce noise.",
      },
    ],
  },
  {
    slug: "storage-inspector",
    href: "/tools/storage-inspector",
    name: "Cookie & LocalStorage Inspector — Parse Headers Online",
    shortName: "Storage & Cookie Inspector",
    h1: "Cookie Header & LocalStorage Inspector",
    category: "Debug",
    primaryKeyword: "cookie header parser",
    description:
      "Free cookie header parser and localStorage inspector. Paste Cookie strings or JSON dumps into a searchable key–value tree. Debug frontend state in-browser.",
    keywords:
      "cookie parser online, cookie header parser, localstorage formatter, parse cookies, json key value viewer, cookie inspector tool",
    summary:
      "Paste stringified localStorage objects or raw Cookie HTTP headers. Parse, nest-expand JSON string values, and filter a searchable key–value tree — client-side only.",
    features: [
      "localStorage JSON mode",
      "Cookie header mode",
      "Nested value flattening",
      "Instant key/value search",
    ],
    howItWorks: [
      "Choose localStorage JSON or Cookie header mode.",
      "Paste a dump from DevTools or an HTTP Cookie header.",
      "JSON string values are auto-parsed when possible.",
      "Browse or filter the flattened key–value tree.",
    ],
    faqs: [
      {
        question: "Can this read my real browser cookies?",
        answer:
          "No. For security, pages cannot access arbitrary cookies. Paste values you copy from DevTools or docs yourself.",
      },
      {
        question: "Is pasted data uploaded?",
        answer:
          "No. Parsing runs locally in JavaScript with no network request.",
      },
      {
        question: "Why flatten nested JSON?",
        answer:
          "A searchable path like user.roles.0 makes debugging large storage blobs faster than reading raw minified JSON.",
      },
    ],
  },
  {
    slug: "car-loan-rule-of-78",
    href: "/tools/car-loan-rule-of-78",
    name: "Malaysia Car Loan Calculator — Flat Rate vs Rule of 78 Early Settlement",
    shortName: "Car Loan Rule of 78",
    h1: "Malaysia Car Loan Calculator (Rule of 78)",
    category: "Finance",
    primaryKeyword: "malaysia car loan calculator rule of 78",
    description:
      "Free Malaysia car loan calculator. Convert flat interest to effective rate (EIR) and estimate Rule of 78 early settlement balances — 100% offline in your browser.",
    keywords:
      "malaysia car loan calculator, rule of 78 calculator, flat rate vs eir, hire purchase early settlement, car loan rebate malaysia, early settlement car loan",
    summary:
      "Enter loan amount, flat interest rate, and tenure. See total interest, monthly instalment, approximate EIR, and what you still owe if you settle early under the Rule of 78 rebate method.",
    features: [
      "Flat rate → instalment & total interest",
      "Approximate effective interest rate (EIR)",
      "Rule of 78 early settlement estimate",
      "Private · client-side · educational",
    ],
    howItWorks: [
      "Enter principal (RM), flat annual rate (%), and tenure in years.",
      "The tool computes total flat interest and monthly instalment.",
      "Pick how many months you have already paid.",
      "Remaining balance uses the Rule of 78 interest rebate formula.",
    ],
    faqs: [
      {
        question: "Is Rule of 78 how Malaysian hire-purchase works?",
        answer:
          "Many Malaysian hire-purchase / car loans advertise a flat rate and rebate interest on early settlement using a Rule of 78–style formula. Confirm the exact method in your agreement or with the bank/finance company.",
      },
      {
        question: "Is the EIR exact?",
        answer:
          "It is an approximation from the flat-rate structure for education. Your bank’s disclosed EIR / IRR may differ slightly.",
      },
      {
        question: "Is my loan data uploaded?",
        answer: "No. Everything runs in your browser with no server round-trip.",
      },
    ],
  },
  {
    slug: "tnb-bill-calculator",
    href: "/tools/tnb-bill-calculator",
    name: "TNB Electricity Bill Calculator Malaysia (New Tariff + EEI)",
    shortName: "TNB Bill Calculator",
    h1: "TNB Electricity Bill Calculator Malaysia",
    category: "Lifestyle",
    primaryKeyword: "tnb bill calculator",
    description:
      "Free TNB electricity bill calculator for Peninsular Malaysia. Estimate domestic bills under the July 2025 tariff (generation, capacity, network, retail, EEI, AFA). Client-side only.",
    keywords:
      "tnb bill calculator, tenaga nasional calculator, electricity bill malaysia, tnb tariff calculator, aircon electricity cost malaysia, tnb eei",
    summary:
      "Enter monthly kWh (or estimate from appliances). See generation, capacity, network, retail, Energy Efficiency Incentive (EEI), optional AFA, KWTBB, and SST — based on the domestic tariff structure from July 2025.",
    features: [
      "July 2025 domestic unbundled tariff",
      "EEI banded discount",
      "Optional AFA sen/kWh",
      "Appliance quick-estimate helper",
    ],
    howItWorks: [
      "Enter monthly consumption in kWh, or use appliance presets to estimate usage.",
      "Optionally set the current AFA (sen/kWh) from TNB’s monthly declaration.",
      "The tool applies generation/capacity/network, EEI band, retail waiver rules, then KWTBB & SST where applicable.",
      "Review the component breakdown and estimated total.",
    ],
    faqs: [
      {
        question: "Is this the official myTNB calculator?",
        answer:
          "No. It is an educational estimate using published domestic rate components. Always verify against your bill or myTNB’s official calculator.",
      },
      {
        question: "What about Sabah / Sarawak?",
        answer:
          "Tariffs differ. This tool targets Peninsular Malaysia (TNB) domestic general rates.",
      },
      {
        question: "Why include AFA as an input?",
        answer:
          "AFA changes monthly. Enter the latest declared sen/kWh (or 0) so the estimate stays current.",
      },
    ],
  },
  {
    slug: "dsr-housing-eligibility",
    href: "/tools/dsr-housing-eligibility",
    name: "Malaysia Housing Loan DSR & Eligibility Checker",
    shortName: "Housing DSR Checker",
    h1: "Housing Loan DSR Calculator Malaysia",
    category: "Finance",
    primaryKeyword: "dsr calculator malaysia",
    description:
      "Free Malaysia housing loan DSR calculator. Check debt service ratio vs common bank ceilings (≈60–70%) using net salary, commitments, and estimated home loan instalment. Offline.",
    keywords:
      "dsr calculator malaysia, housing loan eligibility malaysia, debt service ratio calculator, home loan affordability malaysia, maybank dsr, cimb dsr",
    summary:
      "Enter net monthly income, existing commitments, and a target property price (or instalment). See your Debt Service Ratio and how it sits against common bank DSR ceilings — for planning only.",
    features: [
      "DSR % from income + commitments",
      "Optional instalment from loan amount / rate / tenure",
      "Illustrative bank ceiling bands",
      "Private · not a bank approval",
    ],
    howItWorks: [
      "Enter net monthly salary and recurring commitments (car, PTPTN, cards, etc.).",
      "Either enter a proposed housing instalment, or estimate one from loan amount, rate, and years.",
      "DSR = (commitments + housing instalment) ÷ net income.",
      "Compare against illustrative 60% / 70% ceilings used in market discussions.",
    ],
    faqs: [
      {
        question: "Will Maybank / CIMB / Public Bank approve me?",
        answer:
          "This tool cannot say. Banks use their own policies, CCRIS, margins of finance, and internal scorecards. Treat results as a planning estimate only.",
      },
      {
        question: "Gross or net income?",
        answer:
          "Use net take-home for a conservative estimate. Some banks start from gross and apply their own deductions — confirm with your banker.",
      },
      {
        question: "Is my salary data uploaded?",
        answer: "No. Calculations stay in the browser.",
      },
    ],
  },
  {
    slug: "ptptn-repayment",
    href: "/tools/ptptn-repayment",
    name: "PTPTN Loan Repayment & Discount Calculator Malaysia",
    shortName: "PTPTN Repayment Calculator",
    h1: "PTPTN Loan Repayment Calculator",
    category: "Finance",
    primaryKeyword: "ptptn repayment calculator",
    description:
      "Free PTPTN repayment calculator. Estimate monthly instalments with 1% ujrah, and see savings from full-settlement or direct-debit style discounts. 100% client-side.",
    keywords:
      "ptptn calculator, ptptn repayment calculator, ptptn discount, ptptn full settlement, ptptn ujrah, bayar ptptn",
    summary:
      "Enter outstanding PTPTN balance and repayment years. See estimated monthly instalments with 1% ujrah, plus illustrative savings if you apply a full-settlement or salary-deduction discount.",
    features: [
      "1% ujrah estimate",
      "Monthly instalment projection",
      "Full settlement discount slider",
      "Direct debit / salary deduction savings",
    ],
    howItWorks: [
      "Enter outstanding principal (RM) and intended repayment years.",
      "Ujrah is modelled at ~1% per year on principal for education.",
      "Toggle illustrative discounts for full settlement or direct debit.",
      "Compare standard vs discounted totals.",
    ],
    faqs: [
      {
        question: "Is this an official PTPTN statement?",
        answer:
          "No. Use it for planning. Official balances, ujrah, and promotions come from PTPTN / i-majlis / your statement.",
      },
      {
        question: "How is ujrah modelled?",
        answer:
          "As a simple 1% per annum × years × principal estimate. Actual PTPTN charging may differ by scheme and date.",
      },
      {
        question: "Are discount rates fixed?",
        answer:
          "Promotions change. The sliders let you plug in the % from a current PTPTN campaign.",
      },
    ],
  },
  {
    slug: "long-weekend-planner",
    href: "/tools/long-weekend-planner",
    name: "Malaysia Long Weekend & Public Holiday Planner 2026",
    shortName: "Long Weekend Planner",
    h1: "Malaysia Long Weekend Planner 2026",
    category: "Lifestyle",
    primaryKeyword: "malaysia long weekend 2026",
    description:
      "Free Malaysia long weekend planner for 2026. See federal public holidays, spot bridge days, and find which 1–2 annual leave days unlock 4–5 day breaks. Offline.",
    keywords:
      "malaysia long weekend 2026, public holiday malaysia 2026, cuti umum 2026, annual leave planner malaysia, long weekend calendar malaysia",
    summary:
      "Browse 2026 federal public holidays, switch weekend style (Sat–Sun vs Fri–Sat), and get suggested annual-leave “bridge” days that create longer breaks.",
    features: [
      "2026 federal holiday dataset",
      "Sat–Sun or Fri–Sat weekend modes",
      "Bridge-day / AL suggestions",
      "State note: verify local gazettes",
    ],
    howItWorks: [
      "Pick your weekend style (most states Sat–Sun; some East Coast / Johor styles use Fri–Sat).",
      "Review the 2026 federal holiday list embedded in the page.",
      "The planner finds holidays next to weekends and suggests 1–2 leave days to bridge gaps.",
      "Confirm final dates against JPM / state gazette notices (religious dates can shift).",
    ],
    faqs: [
      {
        question: "Are state holidays included?",
        answer:
          "The core list is federal. Some states observe extra days (Sultan’s birthday, Thaipusam, etc.). Always check your state calendar.",
      },
      {
        question: "Do religious holiday dates change?",
        answer:
          "Yes — Hari Raya and similar dates can move with official announcements. Treat the dataset as a planning baseline.",
      },
      {
        question: "What is a bridge day?",
        answer:
          "A working day sandwiched between a holiday and a weekend (or two holidays). Taking AL that day often creates a 4–5 day break.",
      },
    ],
  },
];

export function getTool(slug: string): ToolDef | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function relatedTools(slug: string, limit = 3): ToolDef[] {
  const current = getTool(slug);
  const others = TOOLS.filter((t) => t.slug !== slug);
  if (!current) return others.slice(0, limit);
  const same = others.filter((t) => t.category === current.category);
  const rest = others.filter((t) => t.category !== current.category);
  return [...same, ...rest].slice(0, limit);
}
