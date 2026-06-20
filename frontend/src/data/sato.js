export const ASCII_BANNER = `=========================================================
          [ S O L A R   A S S O C I A T E D ]
=========================================================`;

export const DEPARTMENTS = [
    {
        slug: "presidential-guard",
        name: "Presidential Guard",
        code: "Secret Service",
        cipher: "DEPT-01",
        logo_file: "SATOPG512.png",
        desc: "Elite protection for the High Council. Authorized for absolute enforcement within SATO territory and high-value VIP escort.",
    },
    {
        slug: "military-police",
        name: "Military Police",
        code: "SATO TAC MP",
        cipher: "DEPT-02",
        logo_file: "SATOMP512.png",
        desc: "Ensuring operational discipline and internal law. Tasked with prisoner transport, border security, and protocol enforcement.",
    },
    {
        slug: "intel-recon",
        name: "Intel & Recon",
        code: "SATO Intel",
        cipher: "DEPT-03",
        logo_file: "SATOINT512.png",
        desc: "Deep-space reconnaissance and information gathering. The eyes and ears of the fleet, scouting the Iron Corridor.",
    },
    {
        slug: "tactical-operations",
        name: "Tactical Operations",
        code: "SATO TAC",
        cipher: "DEPT-04",
        logo_file: "SATOTAC512.png",
        desc: "Commanding the Void Sentinels, Capital assets, and theater-wide engagements. Specialized in fleet dominance and strategic defense.",
    },
    {
        slug: "marine-corps",
        name: "Marine Corps",
        code: "Ironclad Griffin",
        cipher: "DEPT-05",
        logo_file: "SATOMC512.png",
        desc: "Planetary assault and ship boarding specialists. The 'Griffin Strike' units represent our primary shock force.",
    },
    {
        slug: "science-division",
        name: "Science Division",
        code: "Research & Dev",
        cipher: "DEPT-06",
        logo_file: "SATORND512.png",
        desc: "Developing 'Ghost Wire' stealth protocols and industrial optimization. The intelligence engine of the state.",
    },
    {
        slug: "industrial-power",
        name: "Industrial Power",
        code: "SATO LOG",
        cipher: "DEPT-07",
        logo_file: "SATOLOG512.png",
        desc: "The economic backbone. Fueling, mining, and salvage operations that sustain our military reach.",
    },
];

// Lookup helper for department logos (set via /admin once you upload PNGs to /app/frontend/public/logos/)
export const LOGO_BASE = "/logos";
export const logoUrl = (file) => file ? `${LOGO_BASE}/${file}` : null;

export const CODEX_ARTICLES = [
    {
        section: "I. Governance & Command",
        items: [
            { code: "Art 1.1", title: "Absolute Authority", text: "Command authority lies with the President and CO during Ops." },
            { code: "Art 1.2", title: "Pulse Mandate", text: "30-day activity logs required for rank maintenance." },
            { code: "Art 1.3", title: "Primary Directive", text: "Leadership requires SATO to be set as the Primary Organization." },
        ],
    },
    {
        section: "II. Void Laws",
        items: [
            { code: "Art 2.1", title: "The 5KM Buffer", text: "Unauthorized approach to Cap Ships is a hostile act." },
            { code: "Art 2.2", title: "White-Cross", text: "Medical craft are neutral; attacks are Tier 1 War Crimes." },
        ],
    },
    {
        section: "III. Economics & Assets",
        items: [
            { code: "Art 3.1", title: "Tax Tiers", text: "Citizen 10% · Partner 15% · Government 25% of yield to State Treasury." },
            { code: "Art 3.2", title: "State Requisition", text: "Capital ships may be commanded by the State during Red Alert." },
            { code: "Art 3.3", title: "Industrial Yield", text: "Mining/Salvage must yield to Military refueling in combat." },
        ],
    },
    {
        section: "IV. Security & Comms",
        items: [
            { code: "Code 4.1", title: "Dark Void", text: "UI masking required for all streams during official Ops." },
            { code: "Code 4.2", title: "High Treason", text: "Leaking fleet intel is grounds for permanent exile." },
        ],
    },
    {
        section: "V. Civic & Moral Conduct",
        items: [
            { code: "Art 5.1", title: "Real-World Primacy", text: "Real-world commitments always supersede game tasks." },
            { code: "Art 5.2", title: "Deep Space Transit", text: "Absences over 14 days require a 'Deep Space Transit' notice." },
            { code: "Art 5.3", title: "Zero-Tolerance", text: "Discrimination results in immediate exile." },
            { code: "Art 5.4", title: "Uniform", text: "SATO gear is required for formal State functions." },
        ],
    },
    {
        section: "VI. Frontier & Expansion",
        items: [
            { code: "Art 6.1", title: "Keeger Sovereignty", text: "SATO claims the Keeger Belt; all mining there is taxed." },
            { code: "Art 6.3", title: "Pioneer Clause", text: "Outpost placement must be approved by High Council." },
            { code: "Art 6.4", title: "Salvage Sanction", text: "Only SATO-tagged ships may salvage in SATO battle sites." },
        ],
    },
];

export const GOVERNMENT = [
    { title: "President of SATO",            rank: "PRESIDENT",                clearance: 5, branch: "Executive Cabinet",
      mandate: "Sovereign authority. Issues decrees. Final arbiter of war, peace, and the Codex." },
    { title: "Vice President of SATO",       rank: "VICE PRESIDENT",           clearance: 5, branch: "Executive Cabinet",
      mandate: "Acting authority in the President's absence. Chair of the Sovereign Council." },
    { title: "Chief of Naval Operations",    rank: "CNO",                      clearance: 4, branch: "Executive Cabinet",
      mandate: "Commands SATO Navy. Capital fleet doctrine, fleet-wide ROE, Red Alert protocols." },
    { title: "Chief Technical Officer",      rank: "CTO",                      clearance: 4, branch: "Executive Cabinet",
      mandate: "Ghost Wire stealth doctrine. Research & Development division oversight." },
    { title: "Director of Intelligence",     rank: "DIRECTOR",                 clearance: 4, branch: "Executive Cabinet",
      mandate: "Deep-space recon. Custodian of the Iron Corridor intelligence network." },
    { title: "High Admiral of Logistics",    rank: "HIGH ADMIRAL",             clearance: 4, branch: "Executive Cabinet",
      mandate: "Logistics, refueling, salvage, mining yield, supply convoy security." },
    { title: "Trade Minister",               rank: "MINISTER",                 clearance: 4, branch: "Executive Cabinet",
      mandate: "External economic accords. Sovereign tax tier enforcement (10/15/25%)." },
    { title: "Grand Marshal",                rank: "GRAND MARSHAL",            clearance: 5, branch: "Marine Corps",
      mandate: "Supreme authority of the Marine Corps. Commands Griffin Strike planetary assault units." },
    { title: "Brigadier",                    rank: "BRIGADIER",                clearance: 4, branch: "Marine Corps",
      mandate: "Field command of marine task forces. Boarding & ground sector control." },
];
