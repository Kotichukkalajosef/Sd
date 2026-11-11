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
    tagline: "STG Outages, TDBFP & BFPT, Erection, Fabrication, Valves & Technical Manpower Supply",
    shortBio: "Specialist engineering contractor delivering Steam Turbine Generator (STG) capital outages, TDBFP & BFPT overhauls, heavy equipment erection, structural & piping fabrication, critical valve reconditioning, and certified technical manpower supply across power utilities and heavy industries.",
    phone: "+91 98765 43210", // Placeholder - easily updated
    emergencyPhone: "+91 98765 43211",
    email: "outages@sdenterprises.in",
    supportEmail: "info@sdenterprises.in",
    headOffice: "Industrial Hub, Power Sector Corridor, India",
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
    { id: "tdbfp", label: "TDBFP & BFPT" },
    { id: "erection", label: "Erection" },
    { id: "fabrication", label: "Fabrication" },
    { id: "valves", label: "Valves" },
    { id: "manpower", label: "Manpower Supply" }
  ],

  services: [
    {
      id: "stg-outage",
      category: "stg",
      anchor: "stg",
      title: "STG Outage & Capital Overhauling",
      shortDesc: "Specialized capital outages and emergency breakdown overhauls for Steam Turbine Generators (10 MW to 800 MW supercritical sets).",
      fullDesc: "We provide comprehensive planned outage and emergency breakdown overhauling for Steam Turbine Generators. Our specialized field scope encompasses top casing lift, rotor extraction, in-situ clearance measurement (bump checks, labyrinth seals, oil baffles), blading dye-penetrant / NDT inspection, diaphragm re-alignment, journal and thrust bearing scraping/re-metalling, dynamic balancing, and laser shaft alignment to OEM tolerances.",
      highlights: [
        "HP, IP & LP cylinder opening, dismantling & box-up",
        "Rotor runout, journal inspection & dynamic balancing",
        "Diaphragm alignment, nozzle box & labyrinth seal replacement",
        "Pedestal & casing leveling, oil wedge & clearance adjustment",
        "Coupling runout check, blue matching & laser alignment",
        "Turning gear overhauling & lube/jacking oil circuit flushing"
      ],
      equipmentHandled: ["Toshiba (660 MW & 800 MW Supercritical)", "BHEL (up to 800 MW)", "Siemens / KWU", "GE / Alstom", "Doosan", "Triveni / Shin Nippon", "Elliott / Dresser-Rand"],
      icon: "rotor"
    },
    {
      id: "tdbfp-bfpt",
      category: "tdbfp",
      anchor: "tdbfp",
      title: "TDBFP & BFPT Overhauling",
      shortDesc: "Precision overhauls of Turbine Driven Boiler Feed Pumps (TDBFP), BFPT drive steam turbines, barrel assemblies, and cartridge renewals.",
      fullDesc: "Boiler feed pumps operate under extreme hydraulic pressures and thermal gradients. Our precision overhauling restores pump efficiency, minimizes internal recirculation, and ensures reliable feedwater supply. We overhaul both the drive steam turbine (BFPT) and multi-stage barrel or split-casing pump assemblies.",
      highlights: [
        "Drive steam turbine (BFPT) dismantling, blading, governor & trip valve overhaul",
        "Multi-stage cartridge / inner bundle pullout & replacement",
        "Impeller, diffuser & wear ring clearance restoration (0.30 - 0.45 mm)",
        "Balancing drum & balance disc refacing & blue contact matching",
        "Mechanical seal & gland packing renewal",
        "Full rotor dynamic balancing & hydrodynamic bearing refurbishment"
      ],
      equipmentHandled: ["BHEL / Weir", "KSB Multitec / HGC", "Sulzer (MD300 / CPT)", "Flowserve", "Ebara"],
      icon: "pump"
    },
    {
      id: "erection",
      category: "erection",
      anchor: "erection",
      title: "Plant Equipment & TG Island Erection",
      shortDesc: "Heavy equipment erection, steam turbine generator island installation, condenser rigging, auxiliary equipment positioning, and pre-commissioning.",
      fullDesc: "From greenfield power projects to plant expansions, SD Enterprises executes precision equipment erection for turbo-generator sets and mechanical balance of plant. We manage heavy rigging, synchronized crane lifts, foundation sole plate preparation, equipment leveling, laser shaft alignment, and pre-commissioning trial runs.",
      highlights: [
        "Turbine & Generator heavy rigging, stator placement & synchronized crane lifting",
        "Sole plate positioning, chemical anchoring & precision leveling to ±0.05 mm",
        "Surface condenser erection, expansion bellows fitting & neck welding",
        "Feedwater heaters, deaerators, BFP skids, and auxiliary equipment installation",
        "Sub-micron laser alignment across all turbine-generator and pump couplings",
        "Barring gear rolling, lubrication system commissioning & solo run supervision"
      ],
      equipmentHandled: ["STG Turbo-Generators", "Surface Condensers", "Deaerators & LP/HP Heaters", "Centrifugal Pumps", "Auxiliary Skids"],
      icon: "erection"
    },
    {
      id: "fabrication",
      category: "fabrication",
      anchor: "fabrication",
      title: "Heavy Structural & High-Pressure Piping Fabrication",
      shortDesc: "Shop and site fabrication of heavy structural steel, high-pressure IBR steam piping spools, ducting, tanks, and custom industrial skids.",
      fullDesc: "We provide comprehensive heavy fabrication capabilities adhering to Indian Boiler Regulations (IBR) and ASME standards. Our certified fabrication teams deliver precision high-pressure steam piping spools (P11, P22, P91 alloy steels), heavy structural platforms, galleries, pipe racks, flue gas ducting, and industrial storage tanks.",
      highlights: [
        "High-pressure IBR steam piping spools fabrication with pre/post-weld heat treatment (PWHT)",
        "Heavy structural steel fabrication: gantries, turbine access galleries & pipe racks",
        "Flue gas & air ducting fabrication, expansion joints & damper installations",
        "Industrial atmospheric & pressurized storage tanks fabrication",
        "ASME Section IX & IBR certified welders for GTAW, SMAW, and FCAW processes",
        "100% QA/QC inspection: Radiographic (RT), Ultrasonic (UT), Magnetic Particle (MPT)"
      ],
      equipmentHandled: ["P91 / P22 / P11 Alloy Piping", "Carbon & Stainless Steel Spools", "Heavy Steel Structures", "Storage Tanks & Silos"],
      icon: "fabrication"
    },
    {
      id: "valves",
      category: "valves",
      anchor: "valves",
      title: "Critical High-Pressure Valve Reconditioning",
      shortDesc: "Specialized overhaul, in-situ optical diamond lapping, spindle straightening, and pressure testing of MSV, ESV, CV, RSV, and safety valves.",
      fullDesc: "Steam isolation and control valves operate under supercritical steam temperatures and pressures. SD Enterprises delivers precision reconditioning for Main Steam Stop Valves (MSV), Control Valves (CV), Reheat Stop Valves (RSV), Intercept Valves (IV), and HP/LP bypass stations.",
      highlights: [
        "In-situ seat machining & optical diamond lapping",
        "Blue matching of valve plug to seat achieving >95% contact area",
        "Valve spindle runout checking, NDT inspection & stelliting repair",
        "Actuator overhaul: Hydraulic servo cylinders, racks & link mechanisms",
        "Live-loaded gland packing replacement & torque tightening",
        "Hydrostatic & pneumatic nitrogen pressure decay testing"
      ],
      equipmentHandled: ["Fisher / Emerson", "CCI / IMI", "Hopkinsons", "BHEL", "Koso / Samson", "Copes-Vulcan"],
      icon: "valve"
    },
    {
      id: "manpower",
      category: "manpower",
      anchor: "manpower",
      title: "Specialized Technical Manpower Supply",
      shortDesc: "Rapid mobilization of certified millwright fitters, turbine outage engineers, NDT Level-II technicians, IBR welders, and safety officers.",
      fullDesc: "Plant shutdowns demand disciplined, battle-tested mechanics who understand turbine safety and critical tolerances. We supply trade-tested, safety-briefed technical manpower mobilized within 24 to 48 hours for short-duration turnarounds, capital overhauls, and annual maintenance.",
      highlights: [
        "Certified Millwright Fitters & Turbine Erector Specialists",
        "Dynamic Balancing & Vibration Analysis Technicians",
        "NDT Level-II Technicians (DPT, MPT, UT, Boroscopy)",
        "High-Pressure Certified Pipe Welders (IBR qualified)",
        "Experienced Turbine Outage Supervisors & Safety Stewards",
        "Pre-mobilized shutdown squads equipped with calibrated precision toolkits"
      ],
      equipmentHandled: ["Short turnaround outages (7-15 days)", "Capital overhauls (25-45 days)", "Annual Maintenance Contracts (AMC)"],
      icon: "manpower"
    }
  ],

  projects: [
    {
      id: "p1",
      title: "800 MW Supercritical STG Outage (Toshiba Turbine)",
      category: "stg",
      capacity: "800 MW Supercritical",
      clientType: "NTPC Kudgi Super Thermal Power Project",
      location: "Kudgi, Karnataka",
      turnaround: "28 Days",
      year: "2025",
      summary: "Major mechanical capital outage of Toshiba 800 MW supercritical steam turbine. HP, IP, and double-flow LP cylinder dismantling, rotor extraction, NDT, labyrinth seal renewal, diaphragm alignment, and laser shaft re-alignment.",
      achievements: "Completed ahead of critical-path schedule; post-overhaul vibration < 1.1 mm/s RMS."
    },
    {
      id: "p2",
      title: "800 MW Supercritical STG Overhaul (Toshiba Turbine)",
      category: "stg",
      capacity: "800 MW Supercritical",
      clientType: "NTPC Darlipalli Super Thermal Power Station",
      location: "Darlipalli, Odisha",
      turnaround: "26 Days",
      year: "2024 - 2025",
      summary: "Complete mechanical overhaul of Toshiba 800 MW supercritical turbine-generator unit. HP/IP cylinder opening, journal bearing scraping, rotor runout checks, coupling blue matching, and casing box-up.",
      achievements: "Zero safety incidents across all shifts; restored OEM clearances with flawless recommissioning."
    },
    {
      id: "p3",
      title: "660 MW Supercritical STG Capital Outage (Toshiba Turbine)",
      category: "stg",
      capacity: "660 MW Supercritical",
      clientType: "NTPC / MUNPL Meja Thermal Power Project",
      location: "Meja (Varanasi / Prayagraj Region), Uttar Pradesh",
      turnaround: "25 Days",
      year: "2024",
      summary: "Planned capital outage of Toshiba 660 MW supercritical set. Cylinder casing lift, rotor inspection, blading dye-penetrant examination, optical diaphragm alignment, and valve servo actuator overhauling.",
      achievements: "Executed 3 days ahead of outage schedule with exceptional cold and hot alignment concentricity."
    },
    {
      id: "p4",
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

  gallery: [
    {
      id: "g1",
      title: "Turbine Rotor Casing Lift",
      category: "stg",
      caption: "Precision crane sling setup for HP/IP turbine inner casing lift during a 660 MW capital overhaul.",
      image: "assets/images/turbine-rotor-lift.svg"
    },
    {
      id: "g2",
      title: "TDBFP Cartridge Extraction",
      category: "tdbfp",
      caption: "Specialized extraction rig removing high-pressure boiler feed pump inner cartridge for clearance renewal.",
      image: "assets/images/tdbfp-cartridge.svg"
    },
    {
      id: "g3",
      title: "Turbine Island Equipment Erection",
      category: "erection",
      caption: "Heavy rigging and sole plate alignment of turbo-generator set during plant expansion.",
      image: "assets/images/control-room.svg"
    },
    {
      id: "g4",
      title: "High-Pressure Piping Fabrication",
      category: "fabrication",
      caption: "IBR certified welding and fitting of alloy steel high-pressure steam spools.",
      image: "assets/images/safety-crew.svg"
    },
    {
      id: "g5",
      title: "In-Situ Valve Seat Lapping",
      category: "valves",
      caption: "Optical lapping plate grinding stellite seat on Main Steam Valve (MSV) to achieve mirror finish.",
      image: "assets/images/valve-lapping.svg"
    },
    {
      id: "g6",
      title: "Turbine Diaphragm Inspection",
      category: "stg",
      caption: "Optical alignment and axial/radial clearance verification of LP diaphragm stages.",
      image: "assets/images/diaphragm-inspection.svg"
    },
    {
      id: "g7",
      title: "Laser Shaft Alignment",
      category: "stg",
      caption: "Sub-micron laser alignment between steam turbine coupling and generator shaft.",
      image: "assets/images/laser-alignment.svg"
    },
    {
      id: "g8",
      title: "Specialized Shutdown Crew",
      category: "manpower",
      caption: "Certified millwright fitters and turbine engineers mobilizing for scheduled plant turnaround.",
      image: "assets/images/safety-crew.svg"
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
