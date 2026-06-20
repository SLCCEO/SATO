// SATO official rank hierarchy — exact Discord role-name matches.
// Order matters: highest clearance first; we return the first match.

export const RANK_HIERARCHY = [
    // ====== CLR 5 :: SOVEREIGN — order matters! more-specific names first
    { match: "vice president of sato",     label: "VICE PRESIDENT",           clearance: 5, branch: "Executive Cabinet" },
    { match: "president of sato",          label: "PRESIDENT",                clearance: 5, branch: "Executive Cabinet" },
    { match: "grand marshal",              label: "GRAND MARSHAL",            clearance: 5, branch: "Marine Corps" },

    // ====== CLR 4 :: HIGH COMMAND ======
    { match: "chief of naval operations",  label: "CHIEF OF NAVAL OPS",       clearance: 4, branch: "Executive Cabinet" },
    { match: "chief technical officer",    label: "CHIEF TECHNICAL OFFICER",  clearance: 4, branch: "Executive Cabinet" },
    { match: "director of intelligence",   label: "DIRECTOR OF INTELLIGENCE", clearance: 4, branch: "Executive Cabinet" },
    { match: "high admiral of logistics",  label: "HIGH ADMIRAL OF LOGISTICS",clearance: 4, branch: "Executive Cabinet" },
    { match: "trade minister",             label: "TRADE MINISTER",           clearance: 4, branch: "Executive Cabinet" },
    { match: "brigadier",                  label: "BRIGADIER",                clearance: 4, branch: "Marine Corps" },

    // ====== CLR 3 :: OFFICER CORPS ======
    { match: "commander",                  label: "COMMANDER",                clearance: 3, branch: "Officer Corps" },
    { match: "recruitment officer",        label: "RECRUITMENT OFFICER",      clearance: 3, branch: "Officer Corps" },
    { match: "lieutenant",                 label: "LIEUTENANT",               clearance: 3, branch: "Officer Corps" },
    { match: "operations officer",         label: "OPERATIONS OFFICER",       clearance: 3, branch: "Officer Corps" },
    { match: "intelligence officer",       label: "INTELLIGENCE OFFICER",     clearance: 3, branch: "Officer Corps" },

    // ====== CLR 2 :: ENLISTED ======
    { match: "marine",                     label: "MARINE",                   clearance: 2, branch: "Marine Corps" },
    { match: "crewman",                    label: "CREWMAN",                  clearance: 2, branch: "Enlisted" },
    { match: "medical personnel",          label: "MEDICAL PERSONNEL",        clearance: 2, branch: "Enlisted" },
    { match: "vanguard",                   label: "VANGUARD",                 clearance: 2, branch: "Enlisted" },

    // ====== CLR 1 :: CADET / CIVILIAN ======
    { match: "cadet",                      label: "CADET",                    clearance: 1, branch: "Enlisted" },
    { match: "citizen of sato",            label: "CITIZEN",                  clearance: 1, branch: "Civil Registry" },
    { match: "merchant pilot",             label: "MERCHANT PILOT",           clearance: 1, branch: "Civil Registry" },
    { match: "foreign consultant",         label: "FOREIGN CONSULTANT",       clearance: 1, branch: "Civil Registry" },
];

export const rankFromRoles = (roles = []) => {
    const lower = roles.map((r) => String(r).toLowerCase().trim());
    for (const tier of RANK_HIERARCHY) {
        if (lower.some((r) => r === tier.match || r.includes(tier.match))) {
            return { rank: tier.label, clearance: tier.clearance, branch: tier.branch };
        }
    }
    return { rank: "RECRUIT", clearance: 1, branch: "Unassigned" };
};
