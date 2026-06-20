export const ASCII_BANNER = `=========================================================
          [ S O L A R   A S S O C I A T E D ]
=========================================================`;

export const DEPARTMENTS = [
    {
        slug: "presidential-guard",
        name: "Presidential Guard",
        code: "Secret Service",
        cipher: "DEPT-01",
        desc: "Elite protection for the High Council. Authorized for absolute enforcement within SATO territory and high-value VIP escort.",
        color: "from-red-900/30 to-black",
    },
    {
        slug: "military-police",
        name: "Military Police",
        code: "SATO TAC MP",
        cipher: "DEPT-02",
        desc: "Ensuring operational discipline and internal law. Tasked with prisoner transport, border security, and protocol enforcement.",
    },
    {
        slug: "intel-recon",
        name: "Intel & Recon",
        code: "SATO Intel",
        cipher: "DEPT-03",
        desc: "Deep-space reconnaissance and information gathering. The eyes and ears of the fleet, scouting the Iron Corridor.",
    },
    {
        slug: "fleet-operations",
        name: "Fleet Operations",
        code: "SATO Navy",
        cipher: "DEPT-04",
        desc: "Commanding the Void Sentinels and Capital assets. Specialized in heavy naval dominance and strategic defense.",
    },
    {
        slug: "marine-corps",
        name: "Marine Corps",
        code: "Ironclad Griffin",
        cipher: "DEPT-05",
        desc: "Planetary assault and ship boarding specialists. The 'Griffin Strike' units represent our primary shock force.",
    },
    {
        slug: "science-division",
        name: "Science Division",
        code: "Research & Dev",
        cipher: "DEPT-06",
        desc: "Developing 'Ghost Wire' stealth protocols and industrial optimization. The intelligence engine of the state.",
    },
    {
        slug: "industrial-power",
        name: "Industrial Power",
        code: "SATO LOG",
        cipher: "DEPT-07",
        desc: "The economic backbone. Fueling, mining, and salvage operations that sustain our military reach.",
    },
];

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
    { title: "Head of State", rank: "PRESIDENT", occupant: "Jeremiah", clearance: 5, dept: "High Council",
      mandate: "Absolute command authority. Issues sovereign decrees. Final arbiter of war and peace." },
    { title: "Fleet Admiral", rank: "ADMIRAL", occupant: "Vex Halloran", clearance: 4, dept: "Fleet Operations",
      mandate: "Commands SATO Navy and Capital fleet. Executes Red Alert protocols." },
    { title: "Marshal of the Marines", rank: "MARSHAL", occupant: "Mara Tully", clearance: 4, dept: "Marine Corps",
      mandate: "Oversees Griffin Strike units and planetary deployment." },
    { title: "Chief of Intel", rank: "DIRECTOR", occupant: "Ka'el", clearance: 4, dept: "Intel & Recon",
      mandate: "Deep-space recon. Custodian of Ghost Wire protocols." },
    { title: "Sovereign Magistrate", rank: "MAGISTRATE", occupant: "Sera Voss", clearance: 4, dept: "Judiciary",
      mandate: "Tribunal authority. Sentences and exile decrees." },
    { title: "Lord Industrialist", rank: "MINISTER", occupant: "K. Brennan", clearance: 3, dept: "Industrial Power",
      mandate: "Logistics, salvage, mining, refueling lifelines." },
];
