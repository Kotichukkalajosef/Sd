/**
 * SD ENTERPRISES - Centralized Configuration & Data Source
 * 
 * HOW TO ADD NEW CONTENT IN THE FUTURE:
 * 1. To add a new PROJECT: Add a new object to the `SITE_DATA.projects` array.
 * 2. To add a new GALLERY IMAGE: Add a new object to `SITE_DATA.gallery`.
 * 3. To add a new SERVICE or CATEGORY: Add to `SITE_DATA.services` or add a new category string in `SITE_DATA.categories`.
 * 4. All images support local files (e.g. 'assets/images/my-photo.jpg') or external URLs.
 *    If an image path is left empty or not found, an industrial SVG fallback is automatically displayed!
 */

var SITE_DATA = {
  company: {
    name: "SD ENTERPRISES",
    tagline: "STG Outage, O&M (Operation & Maintenance), Technical Man Power Supply, Fabrication & Erection",
    shortBio: "Specialist engineering contractor delivering Steam Turbine Generator (STG) outages, Operation and Maintenance (O&M), certified Technical Manpower Supply, heavy structural and high-pressure piping Fabrication, and mechanical Erection across power utilities and heavy industries.",
    phone: "+91 80886 40058", // Placeholder - easily updated
    emergencyPhone: "+91 80886 40058",
    email: "info@sdenterprises.co",
    supportEmail: "info@sdenterprises.co",
    headOffice: "Plot No. 57, Sai Park, Vijayapura, Karnataka - 586109",
    gstin: "29ABGFM5037Q1ZK",
    certificationsText: "ISO 9001 | ISO 14001 | ISO 45001",
    workingHours: "24/7 Mobilization for Outages & Projects",
    stats: [
      { value: "150+", label: "STG Outages Delivered", sub: "Up to 800 MW units" },
      { value: "48+", label: "Power Plants Served", sub: "Thermal, CPP & Cogen" },
      { value: "300+", label: "Certified Technicians", sub: "Millwrights & Specialists" },
      { value: "9+", label: "Years Field Excellence", sub: "Established in 2017" }
    ]
  },

  categories: [
    { id: "all", label: "All Disciplines" },
    { id: "stg", label: "STG Outage" },
    { id: "om", label: "O&M" },
    { id: "manpower", label: "Technical Manpower" },
    { id: "fabrication", label: "Fabrication" },
    { id: "erection", label: "Erection" }
  ],

  /**
   * CORE SERVICES CONFIGURATION
   * To add a new service in the future, simply add an object below with:
   * { id, category, anchor, serviceNumber, shortCode, title, fullTitle, heroTag, shortDesc, fullDesc, highlights, specTags, equipmentHandled, icon }
   * The website's hero rotator, hero chips, and services showcase will automatically include it!
   */
  services: [
    {
      id: "stg-outage",
      category: "stg",
      anchor: "stg",
      serviceNumber: "01",
      shortCode: "STG OUTAGE",
      title: "STG Outage",
      fullTitle: "STG Outage & Capital Overhauls",
      heroTag: "660 / 800 MW Supercritical",
      shortDesc: "Comprehensive capital outages, cylinder opening, rotor extraction, blading NDT, and precision alignment up to 800 MW supercritical sets.",
      fullDesc: "Specialized planned outages and forced breakdown overhauls for Steam Turbine Generators (up to 800 MW supercritical units, with proven specialization on NTPC Toshiba turbines). Scope encompasses HP/IP/LP casing lift, rotor inspection, labyrinth seal renewal, diaphragm alignment, bearing refurbishment, and sub-micron laser alignment.",
      highlights: [
        "HP, IP & LP cylinder opening, dismantling, overhaul & box-up",
        "Rotor extraction, journal inspection, runout check & dynamic balancing",
        "Diaphragm alignment, nozzle box & labyrinth seal replacement",
        "Journal and thrust bearing scraping, re-metalling & oil clearance verification",
        "Coupling runout check, blue matching & laser alignment",
        "Turning gear overhauling & lube/jacking oil system flushing"
      ],
      specTags: ["10–800 MW Sets", "HP/IP/LP Opening", "Toshiba & Supercritical", "Laser Alignment"],
      equipmentHandled: ["Toshiba (660 MW & 800 MW Supercritical)", "BHEL (up to 800 MW)", "Siemens / KWU", "GE / Alstom", "Doosan", "Triveni / Shin Nippon"],
      icon: "rotor"
    },
    {
      id: "om-maintenance",
      category: "om",
      anchor: "om",
      serviceNumber: "02",
      shortCode: "O&M",
      title: "O&M (Operation and Maintenance)",
      fullTitle: "Plant Operation & Comprehensive Maintenance (O&M)",
      heroTag: "24/7 Operations & Reliability",
      shortDesc: "Complete round-the-clock plant operation, routine & preventive maintenance, BOP upkeep, vibration monitoring, and outage readiness.",
      fullDesc: "End-to-end Operation and Maintenance (O&M) solutions for power generation utilities, captive power plants (CPP), and industrial co-generation units. Our skilled engineers and technicians execute shift operations, routine condition monitoring, lubrication management, balance of plant (BOP) servicing, and planned preventive upkeep to ensure peak heat rates and maximum plant availability.",
      highlights: [
        "24/7 continuous plant operations, shift monitoring & log-sheet parameter control",
        "Comprehensive preventive, predictive & scheduled maintenance management",
        "Balance of Plant (BOP) systems upkeep: cooling towers, pumps, compressors & fans",
        "Online vibration monitoring, lube oil health analysis & heat rate optimization",
        "Rapid emergency breakdown troubleshooting & defect rectification",
        "Statutory compliance, safety permit-to-work (PTW) execution & log audit"
      ],
      specTags: ["24/7 Plant Operations", "Preventive Maintenance", "BOP & Auxiliaries", "Vibration Monitoring"],
      equipmentHandled: ["Thermal Power Plants", "Captive Power Plants (CPP)", "Co-generation Systems", "Balance of Plant (BOP)"],
      icon: "om"
    },
    {
      id: "manpower-supply",
      category: "manpower",
      anchor: "manpower",
      serviceNumber: "03",
      shortCode: "MANPOWER",
      title: "Technical Man Power Supply",
      fullTitle: "Specialized Technical Manpower Supply",
      heroTag: "Certified Outage Technicians",
      shortDesc: "Rapid mobilization of certified turbine bladers, millwright fitters, IBR high-pressure welders, riggers, and safety supervisors.",
      fullDesc: "Supply of trade-tested, disciplined, and safety-certified technical manpower for planned turnarounds, emergency shutdowns, and long-term maintenance contracts. Every specialist is screened for turbomachinery expertise and strict adherence to zero-incident safety protocols.",
      highlights: [
        "Certified Millwright Fitters & Turbine Specialist Mechanics",
        "Precision Turbine Blading Technicians & Alignment Specialists",
        "High-Pressure IBR Qualified Pipe Welders (GTAW / SMAW / FCAW)",
        "Heavy Rigging Specialists & Synchronized Crane Signalers",
        "NDT Level-II Technicians (DPT, MPT, UT & Boroscopy)",
        "Outage Safety Officers, Shift Supervisors & QA Inspectors"
      ],
      specTags: ["Millwright Fitters", "IBR Pipe Welders", "Turbine Bladers", "24–48h Mobilization"],
      equipmentHandled: ["Short turnaround outages (7-15 days)", "Capital overhauls (25-45 days)", "Annual Maintenance Contracts (AMC)"],
      icon: "manpower"
    },
    {
      id: "fabrication",
      category: "fabrication",
      anchor: "fabrication",
      serviceNumber: "04",
      shortCode: "FABRICATION",
      title: "Fabrication",
      fullTitle: "Structural & High-Pressure Piping Fabrication",
      heroTag: "IBR Certified Spools & Structures",
      shortDesc: "Shop and site fabrication of heavy structural steel, high-pressure IBR alloy steam piping, ducting, tanks, and custom industrial skids.",
      fullDesc: "High-precision structural and piping fabrication adhering strictly to Indian Boiler Regulations (IBR) and ASME standards. We execute high-pressure alloy steel piping spools (P11, P22, P91), heavy steel platforms, turbine access galleries, pipe racks, flue gas ducting, and custom equipment skids with 100% QA/QC testing.",
      highlights: [
        "High-pressure IBR alloy piping spools (P11, P22, P91) with controlled PWHT",
        "Heavy structural steel fabrication: turbine galleries, pipe racks & gantries",
        "Flue gas & air ducting fabrication, expansion joints & damper assemblies",
        "Industrial atmospheric & pressurized storage tanks fabrication",
        "ASME Section IX & IBR certified welders for GTAW, SMAW, and FCAW",
        "100% QA/QC inspection: Radiographic (RT), Ultrasonic (UT), and MPT"
      ],
      specTags: ["IBR Alloy P11/P22/P91", "Heavy Structural Steel", "100% NDT Tested", "Steam Spools"],
      equipmentHandled: ["P91 / P22 / P11 Alloy Piping", "Carbon & Stainless Steel Spools", "Heavy Steel Structures", "Storage Tanks & Silos"],
      icon: "fabrication"
    },
    {
      id: "erection",
      category: "erection",
      anchor: "erection",
      serviceNumber: "05",
      shortCode: "ERECTION",
      title: "Erection",
      fullTitle: "Plant Equipment & TG Island Erection",
      heroTag: "Heavy Rigging & Laser Alignment",
      shortDesc: "Heavy equipment erection, steam turbine-generator installation, surface condenser assembly, auxiliary skids, and pre-commissioning.",
      fullDesc: "Complete mechanical erection services for turbo-generator sets, heavy balance of plant machinery, and plant expansions. We deliver synchronized heavy crane lifting, foundation sole plate preparation, equipment leveling to ±0.05 mm, laser alignment, and solo run supervision.",
      highlights: [
        "Turbine & Generator heavy rigging, stator placement & tandem crane lifting",
        "Sole plate positioning, chemical anchoring & precision leveling to ±0.05 mm",
        "Surface condenser erection, neck welding & expansion bellows fitting",
        "Auxiliary equipment: BFP skids, deaerators, LP/HP heaters & lube skids",
        "Sub-micron laser alignment across all turbine-generator-pump couplings",
        "Barring gear rolling, lube oil flushing & solo run commissioning"
      ],
      specTags: ["TG Heavy Rigging", "Sole Plate Leveling", "Condenser Assembly", "Barring Trials"],
      equipmentHandled: ["STG Turbo-Generators", "Surface Condensers", "Deaerators & LP/HP Heaters", "Centrifugal Pumps", "Auxiliary Skids"],
      icon: "erection"
    }
  ],

  projects: [
    {
      id: "p1",
      featuredHome: true, // Set to true to show on Homepage Projects section
      title: "800 MW Supercritical STG Outage (Toshiba Turbine)",
      category: "stg",
      capacity: "800 MW Supercritical",
      clientType: "NTPC Kudgi Super Thermal Power Project",
      location: "Kudgi, Karnataka",
      turnaround: "28 Days",
      year: "2025",
      summary: "Major mechanical capital outage of Toshiba 800 MW supercritical steam turbine. HP, IP, and double-flow LP cylinder dismantling, rotor extraction, NDT, labyrinth seal renewal, diaphragm alignment, and laser shaft re-alignment.",
      achievements: "Vibration < 1.1 mm/s RMS upon synchronization · 100% OEM clearance adherence"
    },
    {
      id: "p2",
      featuredHome: true, // Set to true to show on Homepage Projects section
      title: "800 MW Supercritical STG Overhaul (Toshiba Turbine)",
      category: "stg",
      capacity: "800 MW Supercritical",
      clientType: "NTPC Darlipalli Super Thermal Power Station",
      location: "Darlipalli, Odisha",
      turnaround: "26 Days",
      year: "2024 - 2025",
      summary: "Complete mechanical overhaul of Toshiba 800 MW supercritical turbine-generator unit. HP/IP cylinder opening, journal bearing scraping, rotor runout checks, coupling blue matching, and casing box-up.",
      achievements: "Zero safety incidents across all shifts · Flawless steam rolling on schedule"
    },
    {
      id: "p3",
      featuredHome: true, // Set to true to show on Homepage Projects section
      title: "660 MW Supercritical STG Capital Outage (Toshiba Turbine)",
      category: "stg",
      capacity: "660 MW Supercritical",
      clientType: "NTPC / MUNPL Meja Thermal Power Project",
      location: "Meja (Varanasi / Prayagraj Region), Uttar Pradesh",
      turnaround: "25 Days",
      year: "2024",
      summary: "Planned capital outage of Toshiba 660 MW supercritical set. Cylinder casing lift, rotor inspection, blading dye-penetrant examination, optical diaphragm alignment, and valve servo actuator overhauling.",
      achievements: "Sub-micron alignment concentricity · 3 days ahead of outage schedule"
    },
    {
      id: "p4",
      featuredHome: false,
      title: "Supercritical Unit TDBFP Overhaul & Cartridge Renewal",
      category: "tdbfp",
      capacity: "660 / 800 MW Class",
      clientType: "NTPC Supercritical Thermal Stations",
      location: "Northern & Eastern Region",
      turnaround: "12 Days",
      year: "2024",
      summary: "Dismantling of drive steam turbine (BFPT) and multi-stage barrel boiler feed pump. Inner cartridge replacement, balance disc blue matching, mechanical seal renewals, and clearance restoration.",
      achievements: "Restored pump discharge pressure to rated 185+ bar with optimal hydraulic efficiency."
    },
    {
      id: "p5",
      featuredHome: false,
      title: "Critical High-Pressure Valve Overhaul (MSV/CV & Reheat)",
      category: "valves",
      capacity: "660 MW Class",
      clientType: "Supercritical Thermal Utility",
      location: "Central & Northern Grid",
      turnaround: "10 Days",
      year: "2024",
      summary: "In-situ seat reconditioning and optical diamond lapping for Main Steam Stop Valves (MSV), Control Valves (CV), and Intercept Valves. Servo actuator seals and live-loaded packings renewed.",
      achievements: "100% tight seal achieved; eliminated chronic steam gland leakage under high temperature."
    },
    {
      id: "p6",
      featuredHome: false,
      title: "Specialized Shutdown Manpower & Mechanical Crew Deputation",
      category: "manpower",
      capacity: "Utility Fleet",
      clientType: "Thermal Power & Integrated Complexes",
      location: "Pan-India Outage Sites",
      turnaround: "18 Days",
      year: "2024",
      summary: "Deputation of certified technical personnel including trade-tested millwright fitters, turbine lead engineers, vibration specialists, and safety officers for synchronized multi-unit turnarounds.",
      achievements: "Over 36,000 safe man-hours executed with zero punch-list items on recommissioning."
    }
  ],

  /**
   * Dedicated Gallery Categories (Including O&M and Our Store Equipments & Machineries)
   * This is dedicated exclusively for the Gallery filter tabs.
   */
  galleryCategories: [
    { id: "all", label: "All Photos" },
    { id: "stg", label: "STG Outages" },
    { id: "om", label: "O&M Operations" },
    { id: "manpower", label: "Technical Manpower" },
    { id: "fabrication", label: "Fabrication" },
    { id: "erection", label: "Erection" },
    { id: "store", label: "Our Store & Machinery" }
  ],

  gallery: [
    {
      id: "g1",
      featuredHome: true, // Shows in Homepage Gallery
      title: "Turbine Rotor Casing Lift",
      category: "stg",
      categoryLabel: "TURBINE",
      caption: "Precision crane sling setup for HP/IP turbine inner casing lift during a 660 MW supercritical capital overhaul.",
      image: "assets/images/turbine-rotor-lift.svg"
    },
    {
      id: "g2",
      featuredHome: true, // Shows in Homepage Gallery
      title: "TDBFP Cartridge Extraction",
      category: "stg",
      categoryLabel: "TDBFP",
      caption: "Specialized extraction rig removing high-pressure boiler feed pump inner cartridge for clearance renewal.",
      image: "assets/images/tdbfp-cartridge.svg"
    },
    {
      id: "g5",
      featuredHome: true, // Shows in Homepage Gallery
      title: "In-Situ Valve Seat Lapping",
      category: "stg",
      categoryLabel: "VALVES",
      caption: "Optical diamond lapping restoring >95% blue contact on MSV stellite seat right on the machine floor.",
      image: "assets/images/valve-lapping.svg"
    },
    {
      id: "g7",
      featuredHome: true, // Shows in Homepage Gallery
      title: "Sub-Micron Laser Alignment",
      category: "stg",
      categoryLabel: "ALIGNMENT",
      caption: "Sub-micron laser alignment between steam turbine coupling and generator shaft with thermal growth offset.",
      image: "assets/images/laser-alignment.svg"
    },
    {
      id: "g6",
      featuredHome: true, // Shows in Homepage Gallery
      title: "Turbine Diaphragm Inspection",
      category: "stg",
      categoryLabel: "DIAPHRAGMS",
      caption: "Optical alignment and axial/radial labyrinth seal clearance verification of LP diaphragm stages.",
      image: "assets/images/diaphragm-inspection.svg"
    },
    {
      id: "g8",
      featuredHome: true, // Shows in Homepage Gallery
      title: "Pre-Shift Toolbox Safety & Crew",
      category: "manpower",
      categoryLabel: "MANPOWER",
      caption: "Daily safety briefing, permit-to-work review, and PPE calibration on the turbine operating deck.",
      image: "assets/images/safety-crew.svg"
    },
    {
      id: "g3",
      featuredHome: false,
      title: "Turbine Island Equipment Erection",
      category: "erection",
      categoryLabel: "ERECTION",
      caption: "Heavy rigging and sole plate alignment of turbo-generator set during plant expansion.",
      image: "assets/images/control-room.svg"
    },
    {
      id: "g4",
      featuredHome: false,
      title: "High-Pressure Piping Fabrication",
      category: "fabrication",
      categoryLabel: "FABRICATION",
      caption: "IBR certified welding and fitting of alloy steel high-pressure steam spools.",
      image: "assets/images/safety-crew.svg"
    },
    // O&M Category Photos
    {
      id: "om1",
      featuredHome: false,
      title: "24/7 Plant Control & Health Monitoring",
      category: "om",
      categoryLabel: "O&M",
      caption: "Round-the-clock plant control room shift operations, continuous online bearing vibration tracking, and temperature differential logging.",
      image: "assets/images/control-room.svg"
    },
    {
      id: "om2",
      featuredHome: false,
      title: "Balance of Plant (BOP) Routine Maintenance",
      category: "om",
      categoryLabel: "O&M",
      caption: "Routine preventive maintenance on auxiliary boiler feed pumps, cooling water circuits, and chemical dosing skids during live operations.",
      image: "assets/images/tdbfp-cartridge.svg"
    },
    // Dedicated Gallery Category: Our Store Equipments & Machinery
    {
      id: "m1",
      featuredHome: false,
      title: "Hydraulic Torque Wrenches & Power Pack (700 Bar)",
      category: "store",
      categoryLabel: "STORE MACHINERY",
      caption: "Heavy-duty low profile hydraulic torque wrench heads, multi-stud tensioning tools, and calibrated 700 bar power pack units for turbine casing split joint bolts.",
      image: "assets/images/hydraulic-torque-tensioner.svg"
    },
    {
      id: "m2",
      featuredHome: false,
      title: "Calibrated Precision Metrology Tool Crib",
      category: "store",
      categoryLabel: "STORE MACHINERY",
      caption: "NABL traceable master tool crib featuring Mitutoyo 0.001 mm dial test indicators, bridge depth micrometers, inside bore micrometers, and precision feeler gauge sets.",
      image: "assets/images/store-tools-crib.svg"
    },
    {
      id: "m3",
      featuredHome: false,
      title: "Sub-Micron Laser Shaft Alignment System",
      category: "store",
      categoryLabel: "STORE MACHINERY",
      caption: "Optical dual-laser alignment sensors and digital receiver heads for turbine-generator and feed pump coupling alignment.",
      image: "assets/images/laser-alignment.svg"
    },
    {
      id: "m4",
      featuredHome: false,
      title: "Portable In-Situ Optical Valve Lapping Machine",
      category: "store",
      categoryLabel: "STORE MACHINERY",
      caption: "Dedicated pneumatically driven rotary lapping machines with diamond-plated abrasive discs for restoring supercritical MSV and CRV valve seats.",
      image: "assets/images/valve-lapping.svg"
    },
    {
      id: "m5",
      featuredHome: false,
      title: "FFT Spectrum Vibration & Dynamic Balancing Analyser",
      category: "store",
      categoryLabel: "STORE MACHINERY",
      caption: "Multi-channel portable dynamic balancing computer and piezoelectric accelerometer transducers for on-site turbine trim balancing.",
      image: "assets/images/rotor-balancing.svg"
    }
  ],

  certifications: [
    { title: "ISO 9001:2015", subtitle: "Quality Management Systems", badge: "Certified", detail: "Rigorous QA/QC inspection protocols, clearance logging, and traceable calibration standards." },
    { title: "ISO 45001:2018", subtitle: "Occupational Health & Safety", badge: "Zero LTI", detail: "Comprehensive site safety plans, lock-out/tag-out (LOTO), confined space permits, and PPE audits." },
    { title: "ISO 14001:2015", subtitle: "Environmental Management", badge: "Compliant", detail: "Controlled waste oil recovery, green workshop practices, and strict spill prevention." }
  ],

  principles: [
    {
      num: "01",
      title: "Safety Before Schedule",
      desc: "No deadline supersedes human safety. Every shift initiates with risk assessments, LOTO verification, and calibrated PPE."
    },
    {
      num: "02",
      title: "Precision You Can Verify",
      desc: "Every radial clearance, axial float, and coupling runout is logged with micrometer precision and signed off with client engineers."
    },
    {
      num: "03",
      title: "Transparent Scope Accountability",
      desc: "When unforeseen metallurgical wear or erosion is found upon dismantling, we diagnose and report immediately with practical remedies."
    },
    {
      num: "04",
      title: "Engineered For The Restart Date",
      desc: "We build critical-path schedule models backwards from synchronization time, guaranteeing your plant re-enters the grid on time."
    }
  ],

  faqs: [
    {
      q: "How fast can SD Enterprises mobilize an emergency outage squad?",
      a: "For emergency trips, forced outages, or bearing repairs, our rapid-response flying squad mobilizes within 24 to 48 hours anywhere across India, complete with precision optical tooling and NDT equipment."
    },
    {
      q: "What turbine and pump OEMs do you service?",
      a: "Our core leads are factory-trained and experienced across BHEL (up to 800 MW), Siemens / KWU, GE / Alstom, Doosan, Triveni, Elliott, Sulzer, KSB, Weir, and auxiliary OEMs."
    },
    {
      q: "Do you supply both site overhauling and mobile workshop machining?",
      a: "Yes. We execute in-situ line boring, flange facing, valve seat lapping, and rotor journal polishing right on your turbine deck to save transit time, supported by our off-site heavy engineering workshop for major blade or re-metalling requirements."
    },
    {
      q: "What documentation and QA reports are handed over upon completion?",
      a: "Every project concludes with a certified Turnaround Dossier: before-and-after clearance log sheets, NDT dye penetrant & magnetic particle certificates, dynamic balancing reports, laser alignment graphs, and operation recommissioning advice."
    },
    {
      q: "Can we hire technical manpower independently of full outage contracts?",
      a: "Yes. We offer flexible deployment models: specialized technical manpower supply (certified millwrights, welders, riggers, turbine leads) charged on per-day or unit-rate basis, as well as specialized mechanical outage service contracts."
    }
  ]
};

// Expose globally to window, globalThis, and CommonJS/Node environments
if (typeof window !== 'undefined') {
  window.SITE_DATA = SITE_DATA;
}
if (typeof globalThis !== 'undefined') {
  globalThis.SITE_DATA = SITE_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_DATA;
}
