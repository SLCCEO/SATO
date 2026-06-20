// SATO Constitution — sourced from official Trello board:
// https://trello.com/b/cdg9nSqD/the-constitution-of-the-solar-associated-treaty-organization-sato

export const PREAMBLE = `We, the citizens of the Solar Associated Treaty Organization, in order to forge a sovereign nation among the stars, secure the prosperity and safety of our citizenry, establish a just government beholden to law, and project our authority across the void — do ordain and establish this Constitution for the Solar Associated Treaty Organization.`;

export const CONSTITUTION = [
    {
        article: "Article I",
        title: "Sovereignty & Territory",
        tags: ["CONSTITUTIONAL"],
        sections: [
            {
                code: "I.1",
                title: "Declaration of Sovereignty",
                text: "SATO is hereby declared a sovereign, independent militarized power. It recognizes no superior authority within its claimed territory and operates beyond the jurisdiction of the UEE.",
            },
            {
                code: "I.2",
                title: "Territorial Jurisdiction",
                text: "Sovereignty extends across all space, stations, outposts, and assets formally claimed by SATO — including the Keeger Belt and any frontier outpost ratified by the High Council.",
            },
            {
                code: "I.3",
                title: "Inviolability of Borders",
                text: "Unauthorized incursion into SATO-claimed territory is recognized as a hostile act. All citizens and assets are subject to the protections and obligations of the State.",
            },
        ],
    },
    {
        article: "Article II",
        title: "The Executive Branch — The Presidency",
        tags: ["ADMINISTRATIVE", "CONSTITUTIONAL"],
        sections: [
            {
                code: "II.1",
                title: "Vested Executive Authority",
                text: "All executive authority of SATO is vested in the President, who serves as Head of State, Commander-in-Chief, and chief diplomat.",
            },
            {
                code: "II.2",
                title: "Powers and Administrative Duties",
                text: "The President executes ratified law, directs the State Departments, commands all military assets in concert with the CO during operations, and may issue sovereign decrees consistent with this Constitution.",
            },
            {
                code: "II.3",
                title: "Executive Emergency Powers",
                text: "In a declared crisis, the President may invoke temporary emergency powers per Article XI, subject to the safeguards of Article XIII.",
                tags: ["EMERGENCY", "INTEGRITY"],
            },
            {
                code: "II.4",
                title: "Asset Tenure & Non-Transferability",
                text: "State capital assets are held in trust for the citizenry. They may not be transferred, sold, or gifted by any individual office-holder without High Council ratification.",
                tags: ["SECURITY"],
            },
            {
                code: "II.5",
                title: "Preservation of Private Property",
                text: "Private property of SATO citizens — ships, equipment, in-game holdings — is recognized and protected by the State.",
                tags: ["INTEGRITY", "PRIVATE"],
            },
            {
                code: "II.6",
                title: "Intellectual Property & Branding Rights",
                text: "SATO emblems, codenames, and creative works are the sovereign IP of the organization. Unauthorized commercial use by external parties is prohibited.",
                tags: ["INTEGRITY", "PRIVATE"],
            },
        ],
    },
    {
        article: "Article III",
        title: "The Legislative Branch — The High Council",
        tags: ["ADMINISTRATIVE", "CONSTITUTIONAL"],
        sections: [
            {
                code: "III.1",
                title: "Legislative Authority & Mandate",
                text: "The High Council is vested with the authority to draft, debate, and ratify statutory law. It is the deliberative voice of the citizenry and a check upon executive overreach.",
            },
            {
                code: "III.2",
                title: "Veto & Override Procedures",
                text: "The President may veto Council legislation. The Council may override a veto by a supermajority vote, in accordance with procedure ratified herein.",
            },
        ],
    },
    {
        article: "Article IV",
        title: "The Judicial Branch — The High Tribunal",
        tags: ["INTEGRITY", "CONSTITUTIONAL"],
        sections: [
            {
                code: "IV.1",
                title: "Judicial Authority & Jurisdiction",
                text: "The High Tribunal holds final authority over the interpretation of this Constitution, adjudication of statutory disputes, and sentencing of war crimes.",
            },
            {
                code: "IV.2",
                title: "Judicial Review & Adjudication",
                text: "Acts of the Executive or the Council may be reviewed and struck down by the Tribunal if found in violation of this Constitution.",
            },
        ],
    },
    {
        article: "Article V",
        title: "Citizenship & Rights",
        tags: ["CONSTITUTIONAL"],
        sections: [
            {
                code: "V.1",
                title: "Citizenship is a Privilege",
                text: "Citizenship in SATO is a privilege granted by oath of allegiance. It carries both rights and obligations and may be revoked for cause.",
            },
            {
                code: "V.2",
                title: "Bill of Rights",
                text: "Every citizen is entitled to: the right to fair tribunal; the right to security of person and property; freedom of speech subject to OPSEC; freedom of conscience; and the right to petition the High Council.",
            },
        ],
    },
    {
        article: "Article VI",
        title: "Defense & Rules of Engagement",
        tags: ["MILITARY", "INTEGRITY"],
        sections: [
            {
                code: "VI.1",
                title: "Command of Military Assets",
                text: "All military assets are subject to the direct command of the President.",
            },
            {
                code: "VI.2",
                title: "Defensive vs Offensive Operations",
                text: "Defensive operations may be initiated by any officer to repel immediate threats. Offensive operations require Presidential authorization.",
            },
        ],
    },
    {
        article: "Article VII",
        title: "War Crimes & Prohibited Warfare",
        tags: ["MILITARY", "INTEGRITY"],
        sections: [
            { code: "VII.0", title: "Recognition", text: "Acts committed by any entity against SATO, or by SATO citizens, that constitute a War Crime include the following." },
            { code: "VII.1", title: "False Flag Operations", text: "Unauthorized use of SATO transponders, identification beacons, or callsigns." },
            { code: "VII.2", title: "Attacks on Protected Craft", text: "Firing on vessels openly marked with medical or rescue beacons." },
            { code: "VII.3", title: "Perfidy", text: "Using a white flag, parley signal, or surrender pretext to lure forces into an ambush." },
            { code: "VII.4", title: "Targeting Non-Combatants", text: "Bombardment of unarmed civilian habitats, refugee transports, or non-combatant infrastructure." },
            { code: "VII.5", title: "Illegal Tech", text: "Use of exploits, malicious API manipulation, or any out-of-game technical interference." },
        ],
    },
    {
        article: "Article VIII",
        title: "Diplomatic Protocols",
        sections: [
            { code: "VIII.1", title: "Parley Mandate", text: "Before any offensive action, SATO shall attempt to initiate a Parley with the opposing party where feasible." },
            { code: "VIII.2", title: "Accredited Envoys", text: "Only personnel designated by the President may negotiate treaties on behalf of SATO." },
            { code: "VIII.3", title: "Reciprocity", text: "Allied citizens are granted the same legal protections as SATO citizens within our territory." },
            { code: "VIII.4", title: "Diplomatic Immunity", text: "Accredited envoys carry immunity from arrest during formal parley proceedings." },
        ],
    },
    {
        article: "Article IX",
        title: "Administrative By-laws",
        tags: ["ADMINISTRATIVE"],
        sections: [
            { code: "Art 1.1", title: "Authority", text: "Command authority lies with the President and CO during Ops." },
            { code: "Art 1.2", title: "Pulse Mandate", text: "30-day activity logs required for rank maintenance." },
            { code: "Art 1.3", title: "Primary Directive", text: "Leadership requires SATO to be set as the Primary Organization." },
            { code: "Art 2.1", title: "The 5KM Buffer", text: "Unauthorized approach to Capital Ships is a hostile act." },
            { code: "Art 2.2", title: "White-Cross", text: "Medical craft are neutral; attacks are Tier 1 War Crimes." },
            { code: "Art 3.1", title: "Taxation", text: "Citizen: 10% · Partner: 15% · Government: 25%." },
            { code: "Art 3.2", title: "State Requisition", text: "Capital ships may be commanded by the State during Red Alert." },
            { code: "Art 3.3", title: "Industrial Yield", text: "Mining/Salvage must yield to Military refueling in combat." },
            { code: "Code 4.1", title: "Dark Void", text: "UI masking required for all streams during official Ops." },
            { code: "Code 4.2", title: "High Treason", text: "Leaking fleet intel is grounds for permanent exile." },
            { code: "Art 5.1", title: "Real-world Primacy", text: "Real-world commitments always supersede game tasks." },
            { code: "Art 5.2", title: "Transit", text: "Absences over 14 days require a 'Deep Space Transit' notice." },
            { code: "Art 5.3", title: "Zero-Tolerance", text: "Discrimination results in immediate exile." },
            { code: "Art 5.4", title: "Uniform", text: "SATO gear is required for formal State functions." },
            { code: "Art 6.1", title: "Keeger Sovereignty", text: "SATO claims the Keeger Belt; all mining is taxed." },
            { code: "Art 6.3", title: "Pioneer Clause", text: "Outpost placement must be approved by the High Council." },
            { code: "Art 6.4", title: "Salvage Sanction", text: "Only SATO-tagged ships may salvage in SATO battle sites." },
        ],
    },
    {
        article: "Article X",
        title: "Amendments & Supremacy",
        sections: [
            { code: "X.1", title: "Proposal", text: "An amendment may be proposed by the President or by a quorum of the High Council." },
            { code: "X.2", title: "Ratification", text: "Ratification requires a supermajority vote of the High Council." },
            { code: "X.3", title: "Presidential Sign-off", text: "Ratified amendments take effect upon Presidential signature and publication in the Sovereign Codex." },
        ],
    },
    {
        article: "Article XI",
        title: "Emergency Powers",
        tags: ["EMERGENCY"],
        sections: [
            { code: "XI.0", title: "The Foundations", text: "Emergency powers may be invoked only in declared crisis and are bounded by the safeguards of Article XIII." },
            { code: "XI.1", title: "Declaration of Crisis", text: "The President may declare a crisis upon credible threat to the sovereignty, citizenry, or capital assets of SATO." },
            { code: "XI.2", title: "Temporary Transfer of Authority", text: "Operational authority may be temporarily centralized under the Executive for the duration of the crisis." },
            { code: "XI.3", title: "Succession Protocol", text: "If the President is incapacitated, succession passes per Article VIII of the Statutory Code (Chain of Command)." },
            { code: "XI.4", title: "Restoration of Governance", text: "Upon de-escalation, all emergency powers are returned and ordinary constitutional governance is restored." },
        ],
    },
    {
        article: "Article XII",
        title: "Crisis Protocol",
        tags: ["EMERGENCY"],
        sections: [
            { code: "XII.1", title: "Detection & Verification", text: "Intel & Recon detects and verifies the inciting threat before crisis declaration." },
            { code: "XII.2", title: "Declaration", text: "The President issues a formal Crisis Declaration via Sovereign Comm-Net broadcast." },
            { code: "XII.3", title: "Centralization", text: "Command and control are centralized under the Executive Cabinet for the duration of the crisis." },
            { code: "XII.4", title: "Execution", text: "Authorized force levels are deployed in accordance with Statutory ROE." },
            { code: "XII.5", title: "De-escalation", text: "Once the threat is neutralized, formal de-escalation protocols are initiated." },
            { code: "XII.6", title: "Limitation of Scope", text: "Crisis powers do not extend beyond what is necessary to neutralize the inciting threat." },
            { code: "XII.7", title: "Mandatory Reporting", text: "A full crisis report is filed with the High Tribunal within seven cycles of de-escalation." },
        ],
    },
    {
        article: "Article XIII",
        title: "Constitutional Safeguards & Anti-Abuse Provisions",
        tags: ["INTEGRITY"],
        sections: [
            { code: "XIII.1", title: "Non-Retroactivity", text: "No law shall be applied retroactively to punish acts that were lawful when committed." },
            { code: "XIII.2", title: "Judicial Review", text: "All executive emergency actions are subject to subsequent judicial review by the Tribunal." },
            { code: "XIII.3", title: "Veto of Emergency Powers", text: "The High Council retains a veto over the continuation of emergency powers beyond a defined window." },
            { code: "XIII.4", title: "Prohibition of Self-Dealing", text: "No office-holder may use State assets or authority for personal enrichment." },
            { code: "XIII.5", title: "Impeachment for Malfeasance", text: "Any office-holder may be impeached by the Council and removed by the Tribunal for malfeasance." },
            { code: "XIII.6", title: "Transparency Mandate", text: "All non-classified State actions are recorded in the Sovereign Codex Archive accessible to citizens." },
        ],
    },
];

export const STATUTORY_LAWS = [
    {
        code: "I",
        title: "Property & Asset Management Law",
        sections: [
            { title: "Asset Classification", text: "All SATO holdings are classified as Capital (state-owned), Issued (assigned to office), or Private (citizen-owned). Each class carries distinct protection and disposition rules." },
            { title: "Maintenance Protocols", text: "Capital assets require certified maintenance logs filed every 30 cycles. Failure triggers status review." },
            { title: "Procurement Procedure", text: "Acquisition of capital-class assets follows the four-stage procurement chain: Request → Council Approval → Funding → Acquisition." },
            { title: "Asset Liquidation", text: "Liquidation of Capital assets requires High Council ratification and a published rationale in the Archive." },
        ],
    },
    {
        code: "II",
        title: "Communications & Intel Law",
        sections: [
            { title: "Secure Channel Policy", text: "Operational comms occur on encrypted SATO Comm-Net only. Open channels are reserved for non-sensitive parley." },
            { title: "Intel Handling & OPSEC", text: "Classified intel is compartmentalized by clearance level. Unauthorized disclosure is grounds for tribunal." },
            { title: "Public Relations Protocol", text: "External-facing statements may be issued only by accredited PR officers under the Presidential office." },
            { title: "Data Retention Policy", text: "Combat logs and tribunal evidence are retained indefinitely. Personal data is purged after revocation of citizenship." },
        ],
    },
    {
        code: "III",
        title: "Citizenship & Legal Standing",
        sections: [
            { title: "Requirements for Enlistment", text: "Candidates must take the Sovereign Oath, set SATO as Primary Organization, and complete the Cadet familiarization program." },
            { title: "Rights of Members", text: "Members receive full protection of the Bill of Rights, voting privileges in Council referenda, and equitable access to State resources." },
            { title: "Obligations of Members", text: "Pulse-mandate compliance, uniform adherence at formal functions, and lawful conduct under the Penal Code." },
            { title: "Revocation of Citizenship", text: "Citizenship may be revoked by tribunal verdict for high treason, repeated discrimination, or fraudulent enlistment." },
        ],
    },
    {
        code: "IV",
        title: "Frontier Expansion & Outpost Governance",
        sections: [
            { title: "Claiming Territory", text: "Territory is claimed by Presidential decree following High Council ratification. Claims are published in the Archive." },
            { title: "Outpost Management", text: "Each outpost reports to a designated Marshal or Officer responsible for operational integrity." },
            { title: "Resource Rights", text: "All resources extracted from claimed territory are subject to the standard Tax Tier schedule (10/15/25%)." },
            { title: "Defense Obligations", text: "Every outpost must maintain a minimum defensive garrison and a 30-cycle resupply window." },
        ],
    },
    {
        code: "V",
        title: "Rules of Engagement & Conduct (ROE)",
        sections: [
            { title: "Authorized Force Levels", text: "Force is graduated: warning hail → warning shot → disabling fire → lethal force, escalating only as the threat justifies." },
            { title: "Diplomatic Immunity", text: "Accredited envoys carry full immunity during active parley and for one cycle following its conclusion." },
            { title: "Boarding & Capture Rules", text: "Boarding is authorized only after disabling action and only by Marine Corps personnel under Brigadier authority." },
            { title: "Neutrality Zones", text: "Medical, refugee, and diplomatic zones designated by the State are off-limits to offensive operations." },
        ],
    },
    {
        code: "VI",
        title: "Penal Code & Disciplinary Procedures",
        sections: [
            { title: "Classification of Offenses", text: "Tier 1 (War Crime), Tier 2 (Felony), Tier 3 (Misdemeanor), Tier 4 (Administrative Violation)." },
            { title: "Sentencing Table", text: "Tier 1 → exile or open bounty; Tier 2 → demotion + asset confiscation; Tier 3 → formal censure; Tier 4 → pulse-mandate extension." },
            { title: "Appeals Process", text: "Every verdict is appealable to the High Tribunal within seven cycles of sentencing." },
            { title: "Tribunal Conduct", text: "Tribunals are presided over by the Sovereign Magistrate. Evidence, witnesses, and counsel rights apply." },
        ],
    },
    {
        code: "VII",
        title: "Trade, Tax & Fiscal Policy",
        sections: [
            { title: "Organizational Taxation", text: "Tax tiers: Citizen 10%, Partner 15%, Government 25% of yield, paid to the State Treasury." },
            { title: "Emergency Funding", text: "During declared crisis, the President may authorize emergency draws from the Treasury subject to Article XIII safeguards." },
            { title: "Contractor Payment", text: "Contractor work is paid per published rate schedule. Disputes are arbitrated by the Trade Minister." },
            { title: "Audit Procedures", text: "Annual Treasury audits are conducted by the High Council and published in the Archive." },
        ],
    },
    {
        code: "VIII",
        title: "Chain of Command & Succession",
        sections: [
            { title: "Presidential Line of Succession", text: "Vice President → Chief of Naval Operations → Grand Marshal → Director of Intelligence → High Admiral of Logistics." },
            { title: "Emergency Takeover Protocol", text: "If the President is unreachable for more than 72 standard hours, automatic temporary transfer to the next-in-line is invoked." },
            { title: "Order Legitimacy", text: "Orders are legitimate when signed and broadcast through the Sovereign Comm-Net by a recognized office-holder." },
            { title: "Conflict of Interest Policy", text: "Office-holders must recuse themselves from any decision in which they hold a private stake." },
        ],
    },
];

// Quick-reference grid (the original 6 sections — kept for backwards compat)
export const CODEX_ARTICLES = [
    {
        section: "I. Governance & Command",
        items: [
            { code: "Art 1.1", title: "Authority", text: "Command authority lies with the President and CO during Ops." },
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
            { code: "Art 3.1", title: "Tax Tiers", text: "Citizen 10% · Partner 15% · Government 25% of yield." },
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
