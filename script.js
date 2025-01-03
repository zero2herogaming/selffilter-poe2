/***************************************************************
 * HELPER FUNCTIONS
 ***************************************************************/
function rgbaToHex(rgba) {
  if (!rgba) return "#ffffff";
  const match = rgba.match(/\d+/g);
  if (!match) return "#ffffff";
  const [r, g, b] = match;
  return `#${[r, g, b]
    .map((x) => parseInt(x).toString(16).padStart(2, "0"))
    .join("")}`;
}

function hexToRGB(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  // Default alpha = 255 if not specified
  return `${r} ${g} ${b} 255`;
}

/***************************************************************
 * A small function that constructs lines like "AreaLevel >= 70"
 * based on an operator dropdown plus numeric input.
 ***************************************************************/
function buildConditionLine(field, operator, value) {
  if (operator === "none") return "";
  if ((value === "" || value === null || value === undefined) && value !== 0) return "";
  return `${field} ${operator} ${value}`;
}

/***************************************************************
 * MASTER LIST OF RULES
 * Here we have EVERYTHING from your filters (mini, strict,
 * uber-strict, etc.) consolidated into one array. Each block 
 * is a Show/Hide rule with relevant conditions & settings.
 ***************************************************************/
const ALL_RULES = [
  /*************************************************************************
   * 1. OVERRIDES / UNIQUES
   * (From multiple filters, including uber strict, basic, etc.)
   *************************************************************************/
  {
    id: 1,
    name: "Override - Uniques (Rarity Unique) - Big highlight",
    description: "Matches the original mini-filter for Unique items",
    enabled: true,
    hideRule: false,
    conditions: { rarity: "Unique" },
    colorSettings: {
      textColor: "rgba(175,96,37,1)",
      borderColor: "rgba(175,96,37,1)",
      backgroundColor: "rgba(53,13,13,1)",
      fontSize: 40,
    },
    alertSound: { id: 3, duration: 300 },
    playEffect: { color: "Brown", temp: false },
    minimapIcon: { tier: 1, color: "Brown", shape: "Star" },
  },
  {
    id: 2,
    name: "Uber Strict Unique (Heavy Belt, Grand Regalia, etc.)",
    description: "Rarity Unique, includes belts/regalias/flasks (strict version)",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Unique",
      baseTypes: [
        "Heavy Belt",
        "Grand Regalia",
        "Armoured Cap",
        "Furtive Wraps",
        "Utility Belt",
        "Ornate Belt",
        "Smuggler Coat",
        "Flask",
      ],
    },
    colorSettings: {
      textColor: "rgba(255,0,0,1)",
      borderColor: "rgba(255,0,0,1)",
      backgroundColor: "rgba(255,255,255,1)",
      fontSize: 45,
    },
    alertSound: { id: 6, duration: 300 },
    playEffect: { color: "Red", temp: false },
    minimapIcon: { tier: 2, color: "Red", shape: "Star" },
  },
  {
    id: 3,
    name: "Uber Strict Unique (Crude Bow, Quarterstaff, etc.)",
    description: "Rarity Unique, baseTypes: Crude Bow, Long Quarterstaff...",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Unique",
      baseTypes: ["Crude Bow", "Long Quarterstaff", "Wrapped Greathelm", "Spiked Club"],
    },
    colorSettings: {
      textColor: "rgba(255,255,255,1)",
      borderColor: "rgba(255,255,255,1)",
      backgroundColor: "rgba(200,29,0,1)",
      fontSize: 45,
    },
    alertSound: { id: 10, duration: 300 },
    playEffect: { color: "Red", temp: false },
    minimapIcon: { tier: 2, color: "Red", shape: "Star" },
  },
  {
    id: 4,
    name: "Uber Strict Unique - Class Jewel",
    description: "Rarity Unique, Class Jewel => big highlight",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Unique",
      class: "Jewel",
    },
    colorSettings: {
      textColor: "rgba(255,255,255,1)",
      borderColor: "rgba(255,255,255,1)",
      backgroundColor: "rgba(200,29,0,1)",
      fontSize: 45,
    },
    alertSound: { id: 10, duration: 300 },
    playEffect: { color: "Red", temp: false },
    minimapIcon: { tier: 2, color: "Red", shape: "Star" },
  },
  {
    id: 5,
    name: "Regular Unique (Brown highlight)",
    description: "Rarity Unique, default from older filter",
    enabled: true,
    hideRule: false,
    conditions: { rarity: "Unique" },
    colorSettings: {
      textColor: "rgba(175,96,37,1)",
      borderColor: "rgba(175,96,37,1)",
      backgroundColor: "rgba(53,13,13,1)",
      fontSize: 35,
    },
    alertSound: { id: 3, duration: 300 },
    playEffect: { color: "Brown", temp: false },
    minimapIcon: { tier: 2, color: "Brown", shape: "Star" },
  },

  /*************************************************************************
   * 2. DIVINE ORB STYLE / HIGH VALUE CURRENCY
   *************************************************************************/
  {
    id: 6,
    name: "Divine Orb Style (Mirror, Divine, Perfect Jeweller's Orb, etc.)",
    description: "Class Currency, baseTypes including Mirror, Divine, Perfect Jeweller's Orb",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Currency",
      baseTypes: ["Mirror", "Divine", "Perfect Jeweller's Orb", "Greater Jeweller's Orb"],
    },
    colorSettings: {
      textColor: "rgba(255,0,0,1)",
      borderColor: "rgba(255,0,0,1)",
      backgroundColor: "rgba(255,255,255,1)",
      fontSize: 45,
    },
    alertSound: { id: 6, duration: 300 },
    playEffect: { color: "Red", temp: false },
    minimapIcon: { tier: 0, color: "Red", shape: "Star" },
  },

  /*************************************************************************
   * 3. LEAGUE ITEMS / DISTILLED / ESSENCES
   *************************************************************************/
  {
    id: 7,
    name: "League Currency (Distilled Fear, Suffering, Isolation, Essences...)",
    description: "Class Currency, multiple baseTypes (Distilled, Essences, etc.)",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Currency",
      baseTypes: [
        "Distilled Fear",
        "Distilled Suffering",
        "Distilled Isolation",
        "Greater Essence of Haste",
        "Greater Essence of Ruin",
        "Greater Essence of Torment",
        "Greater Essence of Electricity",
        "Greater Essence of Ice",
        "Greater Essence of Sorcery",
      ],
    },
    colorSettings: {
      textColor: "rgba(255,0,0,1)",
      borderColor: "rgba(255,0,0,1)",
      backgroundColor: "rgba(255,255,255,1)",
      fontSize: 45,
    },
    alertSound: { id: 6, duration: 300 },
    playEffect: { color: "Red", temp: false },
    minimapIcon: { tier: 0, color: "Red", shape: "Star" },
  },
  {
    id: 8,
    name: "League Currency Tier B (Distilled Despair, Disgust, etc.)",
    description: "Class Currency, baseTypes Distilled Despair, Distilled Disgust, etc.",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Currency",
      baseTypes: ["Distilled Despair", "Distilled Disgust", "Distilled Isolation", "Greater Essence"],
    },
    colorSettings: {
      textColor: "rgba(255,255,255,1)",
      borderColor: "rgba(255,255,255,1)",
      backgroundColor: "rgba(240,90,35,1)",
      fontSize: 40,
    },
    alertSound: { id: 1, duration: 300 },
    playEffect: { color: "White", temp: false },
    minimapIcon: { tier: 1, color: "White", shape: "Circle" },
  },
  {
    id: 9,
    name: "League Currency Tier C (Distilled, Catalyst, Essence of...)",
    description: "Class Currency, baseTypes Distilled, Catalyst, Essence of",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Currency",
      baseTypes: ["Distilled", "Catalyst", "Essence of"],
    },
    colorSettings: {
      textColor: "rgba(255,207,132,1)",
      borderColor: "rgba(255,207,132,1)",
      backgroundColor: "rgba(76,51,12,1)",
      fontSize: 45,
    },
    alertSound: { id: 2, duration: 300 },
    playEffect: { color: "White", temp: false },
    minimapIcon: { tier: 1, color: "White", shape: "Circle" },
  },
  {
    id: 10,
    name: "Neural / Adaptive Catalysts",
    description: "Class Currency, baseTypes Neural Catalyst, Adaptive Catalyst",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Currency",
      baseTypes: ["Neural Catalyst", "Adaptive Catalyst"],
    },
    colorSettings: {
      textColor: "rgba(255,207,132,1)",
      borderColor: "rgba(255,207,132,1)",
      backgroundColor: "rgba(76,51,12,1)",
      fontSize: 40,
    },
    alertSound: { id: 2, duration: 300 },
    playEffect: { color: "White", temp: false },
    minimapIcon: { tier: 1, color: "White", shape: "Circle" },
  },
  {
    id: 11,
    name: "Hide Catalyst (AreaLevel >= 65)",
    description: "Hide rule for Class Currency, BaseType Catalyst, if AreaLevel >= 65",
    enabled: true,
    hideRule: true,
    conditions: {
      class: "Currency",
      baseTypes: ["Catalyst"],
      areaLevelRange: { min: 65 },
    },
    colorSettings: {
      textColor: "rgba(255,207,132,1)",
      borderColor: "rgba(255,207,132,1)",
      backgroundColor: "rgba(76,51,12,1)",
      fontSize: 45,
    },
  },

  /*************************************************************************
   * 4. GOLD
   *************************************************************************/
  {
    id: 12,
    name: "Hide Gold - StackSize >= 500",
    description: "Hide rule for BaseType Gold if stack >= 500",
    enabled: true,
    hideRule: true,
    conditions: {
      baseTypes: ["Gold"],
      stackSizeRange: { min: 500 },
    },
    colorSettings: {
      textColor: "rgba(255,255,255,1)",
      borderColor: "rgba(255,255,255,1)",
    },
    playEffect: { color: "Orange", temp: true },
  },
  {
    id: 13,
    name: "Hide Gold in AreaLevel >= 65",
    description: "Hide rule for BaseType Gold if areaLevel >= 65",
    enabled: true,
    hideRule: true,
    conditions: {
      baseTypes: ["Gold"],
      areaLevelRange: { min: 65 },
    },
    colorSettings: {
      textColor: "rgba(180,180,180,1)",
      borderColor: "rgba(0,0,0,1)",
      backgroundColor: "rgba(0,0,0,0.7)",
    },
  },
  {
    id: 14,
    name: "Show Gold if AreaLevel < 65",
    description: "BaseType Gold, areaLevel < 65 => normal highlight",
    enabled: true,
    hideRule: false,
    conditions: {
      baseTypes: ["Gold"],
      // We'll interpret areaLevel < 65 in the UI as: user can set operator
    },
    colorSettings: {
      textColor: "rgba(180,180,180,1)",
      borderColor: "rgba(0,0,0,1)",
      backgroundColor: "rgba(0,0,0,0.7)",
      fontSize: 35,
    },
  },

  /*************************************************************************
   * 5. UNCUT GEMS
   *************************************************************************/
  {
    id: 15,
    name: "Uncut Gem iLvl = 20 (big highlight)",
    description: "BaseType 'Uncut', ItemLevel = 20 => big highlight",
    enabled: true,
    hideRule: false,
    conditions: {
      baseTypes: ["Uncut"],
      itemLevelRange: { min: 20, max: 20 },
    },
    colorSettings: {
      textColor: "rgba(255,0,0,1)",
      borderColor: "rgba(255,0,0,1)",
      backgroundColor: "rgba(255,255,255,1)",
      fontSize: 45,
    },
    alertSound: { id: 6, duration: 300 },
    playEffect: { color: "Red", temp: false },
    minimapIcon: { tier: 0, color: "Red", shape: "Star" },
  },
  {
    id: 16,
    name: "Uncut Gem iLvl <= 19 (generic show)",
    description: "BaseType 'Uncut', ItemLevel <= 19 => normal show",
    enabled: true,
    hideRule: false,
    conditions: {
      baseTypes: ["Uncut "], // Some samples had a space, keep it
      itemLevelRange: { max: 19 },
    },
  },
  {
    id: 17,
    name: "Hide Uncut Gems iLvl=3, AreaLevel >=65",
    description: "Hide rule for 'Uncut', itemLevel=3 in high zones",
    enabled: true,
    hideRule: true,
    conditions: {
      baseTypes: ["Uncut"],
      itemLevelRange: { min: 3, max: 3 },
      areaLevelRange: { min: 65 },
    },
  },
  {
    id: 18,
    name: "Hide Uncut Gems iLvl <= 19 if AreaLevel >=65",
    description: "Hide rule for 'Uncut', itemLevel <=19, areaLevel>=65",
    enabled: true,
    hideRule: true,
    conditions: {
      baseTypes: ["Uncut"],
      itemLevelRange: { max: 19 },
      areaLevelRange: { min: 65 },
    },
  },

  /*************************************************************************
   * 6. SOCKETABLES / SPECIAL ITEMS / RELICS / JEWELS / RUNES / CHARMS
   *************************************************************************/
  {
    id: 19,
    name: "Soul Core / Timeless (League specifics)",
    description: "BaseType 'Soul Core', 'Timeless'",
    enabled: true,
    hideRule: false,
    conditions: {
      baseTypes: ["Soul Core", "Timeless"],
    },
    colorSettings: {
      textColor: "rgba(0,240,190,1)",
      borderColor: "rgba(0,240,190,1)",
      fontSize: 40,
    },
    minimapIcon: { tier: 2, color: "Cyan", shape: "Triangle" },
    playEffect: { color: "Cyan", temp: false },
  },
  {
    id: 20,
    name: "Relics (Sanctum Relics)",
    description: "Class Relic => big highlight",
    enabled: true,
    hideRule: false,
    conditions: { class: "Relic" },
    colorSettings: {
      textColor: "rgba(0,240,190,1)",
      borderColor: "rgba(0,240,190,1)",
      fontSize: 40,
    },
    minimapIcon: { tier: 2, color: "Cyan", shape: "Triangle" },
    playEffect: { color: "Cyan", temp: false },
  },
  {
    id: 21,
    name: "Rare Jewels",
    description: "Class Jewel, Rarity Rare => highlight",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Jewel",
      rarity: "Rare",
    },
    colorSettings: {
      textColor: "rgba(0,240,190,1)",
      borderColor: "rgba(0,240,190,1)",
      fontSize: 40,
    },
    minimapIcon: { tier: 2, color: "Cyan", shape: "Triangle" },
    playEffect: { color: "Cyan", temp: false },
  },
  {
    id: 22,
    name: "Magic Jewels",
    description: "Class Jewel, Rarity Magic => highlight (temp effect)",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Jewel",
      rarity: "Magic",
    },
    colorSettings: {
      textColor: "rgba(0,240,190,1)",
      borderColor: "rgba(0,240,190,1)",
      fontSize: 40,
    },
    playEffect: { color: "Cyan", temp: true },
  },
  {
    id: 23,
    name: "Hide Runes & Charms (AreaLevel >= 65)",
    description: "BaseType includes 'Rune' or 'Charm', hide in high-level zones",
    enabled: true,
    hideRule: true,
    conditions: {
      baseTypes: ["Rune", "Charm"],
      areaLevelRange: { min: 65 },
    },
    colorSettings: {
      textColor: "rgba(0,240,190,1)",
    },
    playEffect: { color: "Cyan", temp: true },
  },
  {
    id: 24,
    name: "Show Runes & Charms (basic version)",
    description: "BaseType includes ' Rune' or ' Charm' => show them",
    enabled: true,
    hideRule: false,
    conditions: {
      baseTypes: [" Rune", " Charm"],
    },
    colorSettings: {
      textColor: "rgba(0,240,190,1)",
    },
    playEffect: { color: "Cyan", temp: true },
  },

  /*************************************************************************
   * 7. CURRENCY TIERS (ANNULMENT, CHANCE, ETC.)
   *************************************************************************/
  {
    id: 25,
    name: "Currency Tier A (Orb of Annulment, Orb of Chance, etc.)",
    description: "Class Currency, baseTypes: Orb of Annulment, Orb of Chance, etc.",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Currency",
      baseTypes: ["Orb of Annulment", "Orb of Chance", "Greater Jeweller's Orb"],
    },
    colorSettings: {
      textColor: "rgba(255,255,255,1)",
      borderColor: "rgba(255,255,255,1)",
      backgroundColor: "rgba(240,90,35,1)",
      fontSize: 40,
    },
    alertSound: { id: 1, duration: 300 },
    playEffect: { color: "White", temp: false },
    minimapIcon: { tier: 1, color: "White", shape: "Circle" },
  },
  {
    id: 26,
    name: "Class Omen - big highlight",
    description: "Show Class Omen => highlight them",
    enabled: true,
    hideRule: false,
    conditions: { class: "Omen" },
    colorSettings: {
      textColor: "rgba(255,255,255,1)",
      borderColor: "rgba(255,255,255,1)",
      backgroundColor: "rgba(240,90,35,1)",
      fontSize: 40,
    },
    alertSound: { id: 1, duration: 300 },
    playEffect: { color: "White", temp: false },
    minimapIcon: { tier: 1, color: "White", shape: "Circle" },
  },
  {
    id: 27,
    name: "Chaos Orb / GCP, highlight",
    description: "Class Currency, baseTypes: Chaos Orb, Gemcutter's Prism => highlight",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Currency",
      baseTypes: ["Chaos Orb", "Gemcutter's Prism"],
    },
    colorSettings: {
      textColor: "rgba(0,0,0,1)",
      borderColor: "rgba(0,0,0,1)",
      backgroundColor: "rgba(240,90,35,1)",
      fontSize: 45,
    },
    alertSound: { id: 2, duration: 300 },
    playEffect: { color: "Yellow", temp: false },
    minimapIcon: { tier: 1, color: "Yellow", shape: "Circle" },
  },
  {
    id: 28,
    name: "Exotic / Exalted / Glassblower's Bauble",
    description: "Class Currency, baseTypes: Exotic, Exalted Orb, Glassblower's Bauble",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Currency",
      baseTypes: ["Exotic", "Exalted Orb", "Glassblower's Bauble"],
    },
    colorSettings: {
      textColor: "rgba(0,0,0,1)",
      borderColor: "rgba(0,0,0,1)",
      backgroundColor: "rgba(249,150,25,1)",
      fontSize: 45,
    },
    alertSound: { id: 2, duration: 300 },
    playEffect: { color: "White", temp: false },
    minimapIcon: { tier: 1, color: "White", shape: "Circle" },
  },
  {
    id: 29,
    name: "Distilled / Essence of / Omen of => big highlight",
    description: "Class Currency, baseTypes Distilled, Essence of, Omen of",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Currency",
      baseTypes: ["Distilled", "Essence of", "Omen of"],
    },
    colorSettings: {
      textColor: "rgba(255,207,132,1)",
      borderColor: "rgba(255,207,132,1)",
      backgroundColor: "rgba(76,51,12,1)",
      fontSize: 45,
    },
    alertSound: { id: 2, duration: 300 },
    playEffect: { color: "White", temp: false },
    minimapIcon: { tier: 1, color: "White", shape: "Circle" },
  },
  {
    id: 30,
    name: "Currency Tier C: Vaal Orb, Orb of Alchemy, etc.",
    description: "Class Currency, baseTypes e.g. Armourer's Scrap, Chance Shard, Vaal Orb, Alchemy",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Currency",
      baseTypes: ["Armourer's Scrap", "Chance Shard", "Vaal Orb", "Orb of Alchemy"],
    },
    colorSettings: {
      textColor: "rgba(0,0,0,1)",
      borderColor: "rgba(0,0,0,1)",
      backgroundColor: "rgba(210,178,135,1)",
      fontSize: 40,
    },
    minimapIcon: { tier: 2, color: "Grey", shape: "Circle" },
  },
  {
    id: 31,
    name: "Simulacrum Splinter / Artifact, stackSize >=1",
    description: "Class Currency, baseTypes: Simulacrum Splinter, Artifact => highlight",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Currency",
      baseTypes: ["Simulacrum Splinter", " Artifact"],
      stackSizeRange: { min: 1 },
    },
    colorSettings: {
      textColor: "rgba(255,255,255,1)",
      borderColor: "rgba(255,255,255,1)",
      backgroundColor: "rgba(180,15,200,1)",
      fontSize: 40,
    },
    minimapIcon: { tier: 2, color: "Grey", shape: "Circle" },
  },
  {
    id: 32,
    name: "Pinnacle Keys",
    description: "Class Pinnacle Keys => big highlight",
    enabled: true,
    hideRule: false,
    conditions: { class: "Pinnacle Keys" },
    colorSettings: {
      textColor: "rgba(255,207,255,1)",
      borderColor: "rgba(255,207,255,1)",
      backgroundColor: "rgba(65,20,80,1)",
      fontSize: 40,
    },
    alertSound: { id: 2, duration: 300 },
    playEffect: { color: "White", temp: false },
    minimapIcon: { tier: 1, color: "Yellow", shape: "Square" },
  },
  {
    id: 33,
    name: "Breach Splinter, stackSize >=1 => highlight",
    description: "Class Currency, baseType Breach Splinter, stackSize >=1",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Currency",
      baseTypes: ["Breach Splinter"],
      stackSizeRange: { min: 1 },
    },
    colorSettings: {
      textColor: "rgba(255,255,255,1)",
      borderColor: "rgba(255,255,255,1)",
      backgroundColor: "rgba(180,15,200,1)",
      fontSize: 40,
    },
    minimapIcon: { tier: 2, color: "Grey", shape: "Circle" },
  },
  {
    id: 34,
    name: "Hide Breach Splinter if stackSize=1, areaLevel >=65",
    description: "Hide rule for single-splinter drops in high-level zones",
    enabled: true,
    hideRule: true,
    conditions: {
      class: "Currency",
      baseTypes: ["Breach Splinter"],
      stackSizeRange: { min: 1, max: 1 },
      areaLevelRange: { min: 65 },
    },
  },
  {
    id: 35,
    name: "Class Currency, baseTypes: lesser Jeweller, Whetstone, etc.",
    description: "Generic show for leftover currency with background color",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Currency",
      baseTypes: [
        " Artifact",
        "Lesser Jeweller's Orb",
        "Arcanist's Etcher",
        "Blacksmith's Whetstone",
        "Artificer's Orb",
        "Regal Orb",
        "Shard",
        "Aug",
        "Orb of Transmutation",
      ],
    },
    colorSettings: {
      textColor: "rgba(190,178,135,1)",
      borderColor: "rgba(190,178,135,1)",
      backgroundColor: "rgba(20,20,0,1)",
      fontSize: 40,
    },
    minimapIcon: { tier: 2, color: "Grey", shape: "Circle" },
  },
  {
    id: 36,
    name: "Hide Wisdom, Shard, Aug if areaLevel >=65",
    description: "Hide rule for low-value currency in high-level areas",
    enabled: true,
    hideRule: true,
    conditions: {
      class: "Currency",
      baseTypes: ["Wisdom", "Shard", "Aug", "Orb of Transmutation"],
      areaLevelRange: { min: 65 },
    },
  },
  {
    id: 37,
    name: "Show Wisdom, Shard, Aug, lesser Jeweller if areaLevel <65",
    description: "Class Currency => show them at lower area levels",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Currency",
      baseTypes: ["Wisdom", "Shard", "Aug", "Orb of Transmutation", "Lesser Jeweller's Orb"],
      areaLevelRange: { max: 64 },
    },
    colorSettings: {
      textColor: "rgba(255,207,132,1)",
      borderColor: "rgba(255,207,132,1)",
      fontSize: 40,
    },
    minimapIcon: { tier: 2, color: "Grey", shape: "Circle" },
  },
  {
    id: 38,
    name: "Unknown Currency (Class Currency, no baseType specified)",
    description: "Fallback show for any currency not matched above",
    enabled: true,
    hideRule: false,
    conditions: { class: "Currency" },
    colorSettings: {
      textColor: "rgba(255,207,132,1)",
      borderColor: "rgba(255,207,132,1)",
      backgroundColor: "rgba(76,51,12,1)",
    },
    alertSound: { id: 2, duration: 300 },
    playEffect: { color: "Pink", temp: false },
    minimapIcon: { tier: 1, color: "White", shape: "Circle" },
  },

  /*************************************************************************
   * 8. FRAGMENTS (Simulacrum, Tablet, Breachstone, etc.)
   *************************************************************************/
  {
    id: 39,
    name: "Fragments (Simulacrum, Tablet, Breachstone, etc.)",
    description: "BaseTypes: Simulacrum, Tablet, Barya, Ultimatum, Fragment, etc.",
    enabled: true,
    hideRule: false,
    conditions: {
      baseTypes: [
        "Simulacrum",
        " Tablet",
        "Breachstone",
        "Barya",
        "Ultimatum",
        " Fragment",
        "Cowardly Fate",
        "Deadly Fate",
        "Victorious Fate",
      ],
    },
    colorSettings: {
      textColor: "rgba(255,207,255,1)",
      borderColor: "rgba(255,207,255,1)",
      backgroundColor: "rgba(65,20,80,1)",
      fontSize: 40,
    },
    alertSound: { id: 2, duration: 300 },
    playEffect: { color: "White", temp: false },
    minimapIcon: { tier: 1, color: "White", shape: "Square" },
  },

  /*************************************************************************
   * 9. WAYSTONES, LOGBOOKS
   *************************************************************************/
  {
    id: 40,
    name: "Waystone / Logbook, Rarity <= Rare => highlight",
    description: "BaseType Waystone or Logbook, big highlight",
    enabled: true,
    hideRule: false,
    conditions: {
      baseTypes: ["Waystone", "Logbook"],
      rarityMax: "Rare",
    },
    colorSettings: {
      textColor: "rgba(255,255,255,1)",
      borderColor: "rgba(255,255,255,1)",
      fontSize: 40,
    },
    alertSound: { id: 4, duration: 300 },
    playEffect: { color: "White", temp: false },
    minimapIcon: { tier: 1, color: "White", shape: "Square" },
  },
  {
    id: 41,
    name: "Show Waystone with WaystoneTier >=15",
    description: "BaseType Waystone, tier gating => big highlight",
    enabled: true,
    hideRule: false,
    conditions: {
      baseTypes: ["Waystone"],
      rarityMax: "Rare",
      waystoneTierRange: { min: 15 },
    },
    colorSettings: {
      textColor: "rgba(255,255,255,1)",
      borderColor: "rgba(255,255,255,1)",
      fontSize: 40,
    },
    alertSound: { id: 4, duration: 300 },
    playEffect: { color: "White", temp: false },
    minimapIcon: { tier: 1, color: "White", shape: "Square" },
  },
  {
    id: 42,
    name: "Hide Waystone if WaystoneTier < 15",
    description: "Hide lesser waystones",
    enabled: true,
    hideRule: true,
    conditions: {
      baseTypes: ["Waystone"],
      waystoneTierRange: { max: 14 },
    },
  },

  /*************************************************************************
   * 10. VALUE RARES (Rings, Amulets, Belts)
   *************************************************************************/
  {
    id: 43,
    name: "Value Rares (Rings, Amulets, Belts)",
    description: "Class Rings/Amulets/Belts, Rarity Rare => highlight",
    enabled: true,
    hideRule: false,
    conditions: {
      class: "Rings Amulets Belts",
      rarity: "Rare",
    },
    colorSettings: {
      textColor: "rgba(233,206,75,1)",
      borderColor: "rgba(233,206,75,1)",
      fontSize: 40,
    },
    playEffect: { color: "Yellow", temp: false },
    minimapIcon: { tier: 1, color: "Yellow", shape: "Diamond" },
  },

  /*************************************************************************
   * 11. Normal/Magic Rings, Amulets, Belts
   *************************************************************************/
  {
    id: 44,
    name: "Normal Rings/Amulets/Belts",
    description: "Rarity Normal + Class = Rings Amulets Belts => fontSize 40",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Normal",
      class: "Rings Amulets Belts",
    },
    colorSettings: {
      fontSize: 40,
    },
  },
  {
    id: 45,
    name: "Magic Rings/Amulets/Belts",
    description: "Rarity Magic + Class = Rings Amulets Belts => fontSize 40",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Magic",
      class: "Rings Amulets Belts",
    },
    colorSettings: {
      fontSize: 40,
    },
  },

  /*************************************************************************
   * 12. SALVAGEABLE ITEMS
   *************************************************************************/
  {
    id: 46,
    name: "Normal w/ sockets > 0 => salvage",
    description: "Rarity Normal, Sockets > 0 => highlight salvage",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Normal",
      socketsMin: 1,
    },
    colorSettings: {
      borderColor: "rgba(200,200,200,1)",
      fontSize: 35,
    },
  },
  {
    id: 47,
    name: "Normal w/ quality > 1 => salvage",
    description: "Rarity Normal, Quality>1 => highlight salvage",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Normal",
      qualityMin: 2,
    },
    colorSettings: {
      borderColor: "rgba(200,200,200,1)",
      fontSize: 35,
    },
  },
  {
    id: 48,
    name: "Magic w/ sockets > 0 => salvage",
    description: "Rarity Magic, Sockets>0 => highlight salvage",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Magic",
      socketsMin: 1,
    },
    colorSettings: {
      borderColor: "rgba(0,0,200,1)",
      fontSize: 35,
    },
  },
  {
    id: 49,
    name: "Magic w/ quality > 1 => salvage",
    description: "Rarity Magic, quality>1 => highlight salvage",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Magic",
      qualityMin: 2,
    },
    colorSettings: {
      borderColor: "rgba(0,0,200,1)",
      fontSize: 35,
    },
  },
  {
    id: 50,
    name: "Hide Normal w/ quality>10, areaLevel>=65",
    description: "Hide rule for over-quality normal gear in high zones",
    enabled: true,
    hideRule: true,
    conditions: {
      rarity: "Normal",
      qualityMin: 11,
      areaLevelRange: { min: 65 },
    },
    colorSettings: {
      borderColor: "rgba(200,200,200,1)",
      fontSize: 35,
    },
  },
  {
    id: 51,
    name: "Hide Magic w/ quality>10, areaLevel>=65",
    description: "Hide rule for over-quality magic gear in high zones",
    enabled: true,
    hideRule: true,
    conditions: {
      rarity: "Magic",
      qualityMin: 11,
      areaLevelRange: { min: 65 },
    },
    colorSettings: {
      borderColor: "rgba(0,0,200,1)",
      fontSize: 35,
    },
  },

  /*************************************************************************
   * 13. RANDOM RARES
   *************************************************************************/
  {
    id: 52,
    name: "Show Random Rares",
    description: "Rarity Rare => basic 35 font",
    enabled: true,
    hideRule: false,
    conditions: { rarity: "Rare" },
    colorSettings: {
      fontSize: 35,
    },
  },

  /*************************************************************************
   * 14. HIDE RULES (HIGH LEVEL TRASH, ETC.)
   *************************************************************************/
  {
    id: 53,
    name: "Hide Flasks (AreaLevel>70, Rarity <= Magic, Quality=0)",
    description: "Hide rule for low-quality flasks in high-level zones",
    enabled: true,
    hideRule: true,
    conditions: {
      class: "Flasks",
      areaLevelRange: { min: 71 },
      rarityMax: "Magic",
      qualityMax: 0,
    },
  },
  {
    id: 54,
    name: "Hide Low-Level Body Armors etc. (AreaLevel>=78, Rarity<=Magic, DropLevel<65)",
    description: "One of many lines that hide low bases in high-level areas",
    enabled: true,
    hideRule: true,
    conditions: {
      class: "Body Armours Helmets Boots Gloves Shields Foci One Hand Maces Two Hand Maces Quarterstaves Bows Crossbows",
      areaLevelRange: { min: 78 },
      rarityMax: "Magic",
      dropLevelRange: { max: 64 },
    },
  },
  {
    id: 55,
    name: "Hide Low-Level Body Armors etc. (AreaLevel>75, DropLevel<64)",
    enabled: true,
    hideRule: true,
    conditions: {
      class: "Body Armours Helmets Boots Gloves Shields Foci One Hand Maces Two Hand Maces Quarterstaves Bows Crossbows",
      areaLevelRange: { min: 76 },
      rarityMax: "Magic",
      dropLevelRange: { max: 63 },
    },
  },
  {
    id: 56,
    name: "Hide Low-Level Body Armors etc. (AreaLevel>73, DropLevel<60)",
    enabled: true,
    hideRule: true,
    conditions: {
      class: "Body Armours Helmets Boots Gloves Shields Foci One Hand Maces Two Hand Maces Quarterstaves Bows Crossbows",
      areaLevelRange: { min: 74 },
      rarityMax: "Magic",
      dropLevelRange: { max: 59 },
    },
  },
  {
    id: 57,
    name: "Hide Low-Level Body Armors etc. (AreaLevel>72, DropLevel<55)",
    enabled: true,
    hideRule: true,
    conditions: {
      class: "Body Armours Helmets Boots Gloves Shields Foci One Hand Maces Two Hand Maces Quarterstaves Bows Crossbows",
      areaLevelRange: { min: 73 },
      rarityMax: "Magic",
      dropLevelRange: { max: 54 },
    },
  },
  {
    id: 58,
    name: "Hide Quivers <50 in Lvl>74 zones",
    enabled: true,
    hideRule: true,
    conditions: {
      class: "Quivers",
      areaLevelRange: { min: 75 },
      rarityMax: "Magic",
      dropLevelRange: { max: 49 },
    },
  },
  {
    id: 59,
    name: "Hide Normal <50 in Lvl>70 zones (Body Armours, etc.)",
    enabled: true,
    hideRule: true,
    conditions: {
      class: "Body Armours Helmets Boots Gloves Shields Foci Quivers One Hand Maces Two Hand Maces Quarterstaves Bows Crossbows",
      areaLevelRange: { min: 71 },
      rarity: "Normal",
      dropLevelRange: { max: 49 },
    },
  },
  {
    id: 60,
    name: "[OPTIONAL] Hide random bases (Rarity <= Magic, class is huge) @AreaLevel>=65",
    description: "Disabled by default? We'll keep it enabled so user can choose.",
    enabled: false, // optional
    hideRule: true,
    conditions: {
      rarityMax: "Magic",
      class: "Flasks Body Armours Helmets Boots Gloves Shields Foci Quivers One Hand Maces Two Hand Maces Staves Quarterstaves Bows Crossbows Wands Sceptres",
      areaLevelRange: { min: 65 },
    },
  },
  {
    id: 61,
    name: "[OPTIONAL] Reduce background on low-level bases (Rarity <= Magic, areaLevel>=65, dropLevel<=50)",
    description: "Another optional rule. We'll keep it disabled by default.",
    enabled: false,
    hideRule: false,
    conditions: {
      rarityMax: "Magic",
      class: "Flasks Body Armours Helmets Boots Gloves Shields Foci Quivers One Hand Maces Two Hand Maces Staves Quarterstaves Bows Crossbows Wands Sceptres",
      areaLevelRange: { min: 65 },
      dropLevelRange: { max: 50 },
    },
    colorSettings: {
      backgroundColor: "rgba(0,0,0,0.49)",
    },
  },
  {
    id: 62,
    name: "Hide Cultist base if areaLevel>=65",
    description: "Several lines in examples hiding Cultist base. We'll unify them in one rule.",
    enabled: true,
    hideRule: true,
    conditions: {
      baseTypes: ["Cultist"],
      areaLevelRange: { min: 65 },
    },
  },
  {
    id: 63,
    name: "Hide advanced armors (BaseArmour>0, BaseEvasion=0, etc.)",
    description: "We keep the flavor from the example. It's a more advanced property not standard in PoE, but included anyway.",
    enabled: true,
    hideRule: true,
    // We'll just store them as is; advanced properties are not standard but let's keep them.
  },
  {
    id: 64,
    name: "Hide quarter-based items (Long Quarter, Barrier Quarter, etc.)",
    description: "Also from the examples. We'll unify them in one rule.",
    enabled: true,
    hideRule: true,
    conditions: {
      baseTypes: [
        "Long Quarter",
        "Barrier Quarter",
        "Serrated Quiver",
        "Toxic Quiver",
        "Blunt Quiver",
        "Crackling Quarter",
      ],
    },
  },
  {
    id: 65,
    name: "Show Rare Quivers, fontSize=40, fancy border",
    description: "Rarity=Rare, Class=Quiver => highlight",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Rare",
      class: "Quiver",
    },
    colorSettings: {
      fontSize: 40,
      borderColor: "rgba(0,240,190,1)",
      backgroundColor: "rgba(20,20,0,1)",
    },
  },
  {
    id: 66,
    name: "Show Rare Bows (Expert Dualstring, Expert Zealot) => big highlight",
    description: "Rarity=Rare, baseTypes: Expert Dualstring, Expert Zealot => big font",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Rare",
      baseTypes: ["Expert Dualstring", "Expert Zealot"],
    },
    colorSettings: {
      fontSize: 45,
      borderColor: "rgba(0,240,190,1)",
      backgroundColor: "rgba(20,20,0,1)",
    },
  },
  {
    id: 67,
    name: "Show Rare Wands (Attuned Wand, Siphoning Wand) => highlight",
    description: "Rarity=Rare, baseTypes: Attuned Wand, Siphoning Wand",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Rare",
      baseTypes: ["Attuned Wand", "Siphoning Wand"],
    },
    colorSettings: {
      fontSize: 40,
      borderColor: "rgba(0,240,190,1)",
      backgroundColor: "rgba(20,20,0,1)",
    },
  },
  {
    id: 68,
    name: "Show Rare Quarter/Crossbows (baseType=Expert, Class=Quarter Crossbows)",
    description: "Rarity=Rare, Class=Quarter Crossbows, baseType=Expert => small font",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Rare",
      class: "Quarter Crossbows",
      baseTypes: ["Expert"],
    },
    colorSettings: {
      fontSize: 32,
    },
  },
  {
    id: 69,
    name: "Hide Rare Maces/Quivers/Bows in areaLevel>=65",
    description: "Rarity=Rare, Class includes Mace, Quiver, Bow => hide in high-level",
    enabled: true,
    hideRule: true,
    conditions: {
      rarity: "Rare",
      class: "Mace Quarter Crossbows Bows Belt",
      areaLevelRange: { min: 65 },
    },
    colorSettings: {
      fontSize: 32,
    },
  },
  {
    id: 70,
    name: "Show Rare Quiver => fontSize=40, border teal",
    description: "Another Quiver rule from example. Might overlap with previous. It's all in the UI now!",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Rare",
      class: "Quiver",
    },
    colorSettings: {
      fontSize: 40,
      borderColor: "rgba(0,240,190,1)",
      backgroundColor: "rgba(20,20,0,1)",
    },
  },
  {
    id: 71,
    name: "Show Rare class Flask, Body, Helmet, Boots, etc. baseType=Expert, areaLevel>=65 => small font",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Rare",
      class: "Flask Body Helmet Boots Gloves Shields Mace Staff Quarter Crossbows Wand Sceptre Foci Quiver Belt Bows",
      baseTypes: ["Expert"],
      areaLevelRange: { min: 65 },
    },
    colorSettings: {
      fontSize: 32,
    },
  },
  {
    id: 72,
    name: "Show Rare class Helmet, Boots, Gloves, areaLevel>=65 => fontSize=32",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Rare",
      class: "Helmet Boots Gloves",
      areaLevelRange: { min: 65 },
    },
    colorSettings: {
      fontSize: 32,
    },
  },
  {
    id: 73,
    name: "Hide Rare (Flask, Body, Helmet, Boots, Gloves, etc.) in areaLevel>=65 => fontSize=32",
    enabled: true,
    hideRule: true,
    conditions: {
      rarity: "Rare",
      class: "Flask Body Helmet Boots Gloves Shields Staff Sceptre Foci Quiver Belt Shields Mace Wand",
      areaLevelRange: { min: 65 },
    },
    colorSettings: {
      fontSize: 32,
    },
  },
  {
    id: 74,
    name: "Hide <= Magic for a huge class list in areaLevel>=65",
    description: "This is the final hide from your big examples",
    enabled: true,
    hideRule: true,
    conditions: {
      rarityMax: "Magic",
      class: "Flask Body Helmet Boots Gloves Shields Mace Staff Quarter Crossbow Wand Sceptre Foci Quiver Belt Bows Rings Belt Amulet",
      areaLevelRange: { min: 65 },
    },
  },
  {
    id: 75,
    name: "Hide <= Magic currency baseType 'rune' in areaLevel>=65",
    description: "From the final line of your example.",
    enabled: true,
    hideRule: true,
    conditions: {
      rarityMax: "Magic",
      class: "Currency",
      baseTypes: ["rune"],
      areaLevelRange: { min: 65 },
    },
  },

  /*************************************************************************
   * 15. Basic version extras (Attuned Wand, Siphoning Wand, etc.)
   *************************************************************************/
  {
    id: 76,
    name: "Show Rarity Normal baseType 'Stellar Amulet', 'Sapphire Ring'",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Normal",
      baseTypes: ["Stellar Amulet", "Sapphire Ring"],
    },
    colorSettings: {
      fontSize: 35,
    },
  },
  {
    id: 77,
    name: "Show Rarity Normal, baseType 'Siphoning Wand','Attuned Wand', itemLevel>=81 => fontSize=35",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Normal",
      baseTypes: ["Siphoning Wand", "Attuned Wand"],
      itemLevelRange: { min: 81 },
    },
    colorSettings: {
      fontSize: 35,
    },
  },
  {
    id: 78,
    name: "Show Rarity Normal, baseType 'Expert Dualstring', itemLevel>=82 => fontSize=35",
    enabled: true,
    hideRule: false,
    conditions: {
      rarity: "Normal",
      baseTypes: ["Expert Dualstring"],
      itemLevelRange: { min: 82 },
    },
    colorSettings: {
      fontSize: 35,
    },
  },
  {
    id: 79,
    name: "Show Rarity <= Normal, baseType 'Breach Ring' => text black, background brown",
    enabled: true,
    hideRule: false,
    conditions: {
      rarityMax: "Normal",
      baseTypes: ["Breach Ring"],
    },
    colorSettings: {
      textColor: "rgba(0,0,0,1)",
      borderColor: "rgba(0,0,0,1)",
      backgroundColor: "rgba(190,144,135,1)",
      fontSize: 35,
    },
    minimapIcon: { tier: 2, color: "Pink", shape: "Circle" },
  },

  /*************************************************************************
   * 16. META / Expert Laced Boots, etc.
   *************************************************************************/
  {
    id: 80,
    name: "Meta: Show baseType=='Expert Laced Boots'",
    description: "From the mini-filter meta section",
    enabled: true,
    hideRule: false,
    conditions: {
      baseTypes: ["Expert Laced Boots"],
    },
  },
];

/***************************************************************
 * CREATE DYNAMIC HTML FOR EACH RULE
 * We also add advanced operator dropdowns for numeric fields
 ***************************************************************/
function createRuleHTML(rule) {
  const container = document.createElement("div");
  container.classList.add("rule");

  // Title
  const title = document.createElement("div");
  title.classList.add("rule-title");
  title.innerText = rule.name;
  container.appendChild(title);

  // Basic info
  let html = `
    <label>
      <input type="checkbox" id="enable-${rule.id}" ${rule.enabled ? "checked" : ""} />
      Enable
    </label>
    <p>${rule.description || ""}</p>
  `;

  // ---- Color / Font block ----
  if (rule.colorSettings) {
    const textC = rgbaToHex(rule.colorSettings.textColor);
    const borderC = rgbaToHex(rule.colorSettings.borderColor);
    const bgC = rgbaToHex(rule.colorSettings.backgroundColor);
    const fSize = rule.colorSettings.fontSize || 35;

    html += `
      <label>Text Color:
        <input type="color" id="textColor-${rule.id}" value="${textC}" />
      </label>
      <label>Border Color:
        <input type="color" id="borderColor-${rule.id}" value="${borderC}" />
      </label>
      <label>Background Color:
        <input type="color" id="bgColor-${rule.id}" value="${bgC}" />
      </label>
      <label>Font Size:
        <input type="number" id="fontSize-${rule.id}" value="${fSize}" min="12" max="60" />
      </label>
    `;
  }

  // ---- Alert Sound ----
  if (rule.alertSound) {
    html += `
      <label>Alert Sound:
        <select id="alertSound-${rule.id}">
          <option value="1" ${rule.alertSound.id === 1 ? "selected" : ""}>Alert 1</option>
          <option value="2" ${rule.alertSound.id === 2 ? "selected" : ""}>Alert 2</option>
          <option value="3" ${rule.alertSound.id === 3 ? "selected" : ""}>Alert 3</option>
          <option value="4" ${rule.alertSound.id === 4 ? "selected" : ""}>Alert 4</option>
          <option value="6" ${rule.alertSound.id === 6 ? "selected" : ""}>Alert 6</option>
          <option value="10" ${rule.alertSound.id === 10 ? "selected" : ""}>Alert 10</option>
        </select>
        Duration:
        <input type="number" id="alertDuration-${rule.id}" value="${rule.alertSound.duration}" min="50" max="1000"/>
      </label>
    `;
  }

  // ---- PlayEffect ----
  if (rule.playEffect) {
    const { color, temp } = rule.playEffect;
    html += `
      <label>PlayEffect Color:
        <select id="effectColor-${rule.id}">
          <option value="Red" ${color === "Red" ? "selected" : ""}>Red</option>
          <option value="Brown" ${color === "Brown" ? "selected" : ""}>Brown</option>
          <option value="White" ${color === "White" ? "selected" : ""}>White</option>
          <option value="Cyan" ${color === "Cyan" ? "selected" : ""}>Cyan</option>
          <option value="Orange" ${color === "Orange" ? "selected" : ""}>Orange</option>
          <option value="Pink" ${color === "Pink" ? "selected" : ""}>Pink</option>
          <option value="Yellow" ${color === "Yellow" ? "selected" : ""}>Yellow</option>
          <option value="Purple" ${color === "Purple" ? "selected" : ""}>Purple</option>
          <option value="Grey" ${color === "Grey" ? "selected" : ""}>Grey</option>
        </select>
        Temp:
        <input type="checkbox" id="effectTemp-${rule.id}" ${temp ? "checked" : ""}/>
      </label>
    `;
  }

  // ---- Minimap Icon ----
  if (rule.minimapIcon) {
    const { tier = 1, color, shape } = rule.minimapIcon;
    html += `
      <label>Minimap Icon:
        Tier <input type="number" id="iconTier-${rule.id}" value="${tier}" min="0" max="3"/>
        Color <input type="text" id="iconColor-${rule.id}" value="${color}" />
        Shape <input type="text" id="iconShape-${rule.id}" value="${shape}" />
      </label>
    `;
  }

  // ---- Now numeric fields with advanced operator selection ----
  if (rule.conditions) {
    // areaLevelRange
    if (rule.conditions.areaLevelRange) {
      // We'll let user set "AreaLevel [op] [val]"
      // default operator to >= if min is used, <= if max is used
      html += `
        <label>
          AreaLevel 
          <select id="areaLevelOp-${rule.id}" class="operator-select">
            <option value=">=">>=</option>
            <option value="<="><=</option>
            <option value="=">=</option>
            <option value=">">></option>
            <option value="<"><</option>
          </select>
          <input type="number" id="areaLevelVal-${rule.id}" value="${
            rule.conditions.areaLevelRange.min || 0
          }" />
        </label>
      `;
    }
    // stackSizeRange
    if (rule.conditions.stackSizeRange) {
      html += `
        <label>
          StackSize 
          <select id="stackSizeOp-${rule.id}" class="operator-select">
            <option value=">=">>=</option>
            <option value="<="><=</option>
            <option value="=">=</option>
            <option value=">">></option>
            <option value="<"><</option>
          </select>
          <input type="number" id="stackSizeVal-${rule.id}" value="${rule.conditions.stackSizeRange.min || 0}" />
        </label>
      `;
    }
    // itemLevelRange
    if (rule.conditions.itemLevelRange) {
      // We’ll assume only one operator for simplicity
      const defaultVal = rule.conditions.itemLevelRange.min ?? 0;
      html += `
        <label>
          ItemLevel 
          <select id="itemLevelOp-${rule.id}" class="operator-select">
            <option value="=">=</option>
            <option value=">=">>=</option>
            <option value="<="><=</option>
            <option value=">">></option>
            <option value="<"><</option>
          </select>
          <input type="number" id="itemLevelVal-${rule.id}" value="${defaultVal}" />
        </label>
      `;
    }
    // waystoneTierRange
    if (rule.conditions.waystoneTierRange) {
      // We'll do a single operator for demonstration
      const defaultVal = rule.conditions.waystoneTierRange.min ?? rule.conditions.waystoneTierRange.max ?? 0;
      html += `
        <label>
          WaystoneTier 
          <select id="waystoneTierOp-${rule.id}" class="operator-select">
            <option value=">=">>=</option>
            <option value="<="><=</option>
            <option value="=">=</option>
            <option value=">">></option>
            <option value="<"><</option>
          </select>
          <input type="number" id="waystoneTierVal-${rule.id}" value="${defaultVal}" />
        </label>
      `;
    }
    // dropLevelRange
    if (rule.conditions.dropLevelRange) {
      // We'll just handle min or max as a single operator
      const defaultMax = rule.conditions.dropLevelRange.max ?? 100;
      html += `
        <label>
          DropLevel 
          <select id="dropLevelOp-${rule.id}" class="operator-select">
            <option value="<="><=</option>
            <option value=">=">>=</option>
            <option value="=">=</option>
            <option value=">">></option>
            <option value="<"><</option>
          </select>
          <input type="number" id="dropLevelVal-${rule.id}" value="${defaultMax}" />
        </label>
      `;
    }
    // socketsMin
    if (typeof rule.conditions.socketsMin !== "undefined") {
      html += `
        <label>
          Min Sockets 
          <select id="socketsOp-${rule.id}" class="operator-select">
            <option value=">=">>=</option>
            <option value=">">></option>
          </select>
          <input type="number" id="socketsVal-${rule.id}" value="${rule.conditions.socketsMin}" />
        </label>
      `;
    }
    // qualityMin
    if (typeof rule.conditions.qualityMin !== "undefined") {
      html += `
        <label>
          Min Quality 
          <select id="qualityMinOp-${rule.id}" class="operator-select">
            <option value=">=">>=</option>
            <option value=">">></option>
          </select>
          <input type="number" id="qualityMinVal-${rule.id}" value="${rule.conditions.qualityMin}" />
        </label>
      `;
    }
    // qualityMax
    if (typeof rule.conditions.qualityMax !== "undefined") {
      html += `
        <label>
          Max Quality 
          <select id="qualityMaxOp-${rule.id}" class="operator-select">
            <option value="<="><=</option>
            <option value="<"><</option>
          </select>
          <input type="number" id="qualityMaxVal-${rule.id}" value="${rule.conditions.qualityMax}" />
        </label>
      `;
    }
  }

  container.innerHTML += html;
  return container;
}

/***************************************************************
 * RENDER ALL RULES ON PAGE LOAD
 ***************************************************************/
function loadRules() {
  const rulesContainer = document.getElementById("rules-container");
  ALL_RULES.forEach((rule) => {
    const ruleHTML = createRuleHTML(rule);
    rulesContainer.appendChild(ruleHTML);
  });
}

/***************************************************************
 * GENERATE FILTER CONTENT
 * This is where we read user inputs (including advanced
 * operator selections) and build the final .filter text.
 ***************************************************************/
function generateFilterContent() {
  let content = "";

  ALL_RULES.forEach((rule) => {
    const isEnabled = document.getElementById(`enable-${rule.id}`).checked;
    if (!isEnabled) return; // skip if disabled

    // Show or Hide
    const blockType = rule.hideRule ? "Hide" : "Show";
    let ruleBlock = `${blockType}\n`;

    const c = rule.conditions || {};

    // -- Rarity
    if (c.rarity) {
      ruleBlock += `  Rarity ${c.rarity}\n`;
    }
    if (c.rarityMax === "Magic") {
      ruleBlock += `  Rarity <= Magic\n`;
    }

    // -- Class
    if (c.class) {
      const classList = c.class
        .split(" ")
        .map((cl) => `"${cl}"`)
        .join(" ");
      ruleBlock += `  Class ${classList}\n`;
    }

    // -- BaseTypes
    if (c.baseTypes) {
      const bTypes = c.baseTypes.map((b) => `"${b}"`).join(" ");
      ruleBlock += `  BaseType ${bTypes}\n`;
    }

    // -- AreaLevel
    if (c.areaLevelRange) {
      const op = document.getElementById(`areaLevelOp-${rule.id}`)?.value || ">=";
      const val = parseInt(document.getElementById(`areaLevelVal-${rule.id}`)?.value || 0, 10);
      const line = buildConditionLine("AreaLevel", op, val);
      if (line) ruleBlock += `  ${line}\n`;
    }
    // -- StackSize
    if (c.stackSizeRange) {
      const op = document.getElementById(`stackSizeOp-${rule.id}`)?.value || ">=";
      const val = parseInt(document.getElementById(`stackSizeVal-${rule.id}`)?.value || 0, 10);
      const line = buildConditionLine("StackSize", op, val);
      if (line) ruleBlock += `  ${line}\n`;
    }
    // -- ItemLevel
    if (c.itemLevelRange) {
      const op = document.getElementById(`itemLevelOp-${rule.id}`)?.value || "=";
      const val = parseInt(document.getElementById(`itemLevelVal-${rule.id}`)?.value || 0, 10);
      const line = buildConditionLine("ItemLevel", op, val);
      if (line) ruleBlock += `  ${line}\n`;
    }
    // -- WaystoneTier
    if (c.waystoneTierRange) {
      const op = document.getElementById(`waystoneTierOp-${rule.id}`)?.value || ">=";
      const val = parseInt(document.getElementById(`waystoneTierVal-${rule.id}`)?.value || 0, 10);
      const line = buildConditionLine("WaystoneTier", op, val);
      if (line) ruleBlock += `  ${line}\n`;
    }
    // -- DropLevel
    if (c.dropLevelRange) {
      const op = document.getElementById(`dropLevelOp-${rule.id}`)?.value || "<=";
      const val = parseInt(document.getElementById(`dropLevelVal-${rule.id}`)?.value || 0, 10);
      const line = buildConditionLine("DropLevel", op, val);
      if (line) ruleBlock += `  ${line}\n`;
    }
    // -- Sockets
    if (typeof c.socketsMin !== "undefined") {
      const socketsOp = document.getElementById(`socketsOp-${rule.id}`)?.value || ">=";
      const sVal = parseInt(document.getElementById(`socketsVal-${rule.id}`)?.value || 0, 10);
      if (sVal > 0) {
        if (socketsOp === ">=") {
          ruleBlock += `  Sockets >= ${sVal}\n`;
        } else {
          ruleBlock += `  Sockets > ${sVal}\n`;
        }
      }
    }
    // -- Quality min
    if (typeof c.qualityMin !== "undefined") {
      const qOp = document.getElementById(`qualityMinOp-${rule.id}`)?.value || ">=";
      const qVal = parseInt(document.getElementById(`qualityMinVal-${rule.id}`)?.value || 0, 10);
      if (qVal > 0) {
        ruleBlock += `  Quality ${qOp} ${qVal}\n`;
      }
    }
    // -- Quality max
    if (typeof c.qualityMax !== "undefined") {
      const qOp = document.getElementById(`qualityMaxOp-${rule.id}`)?.value || "<=";
      const qVal = parseInt(document.getElementById(`qualityMaxVal-${rule.id}`)?.value || 100, 10);
      if (qVal < 100) {
        ruleBlock += `  Quality ${qOp} ${qVal}\n`;
      }
    }

    // ---------- Visual / Audio / Icon settings ----------
    if (rule.colorSettings) {
      const textC = document.getElementById(`textColor-${rule.id}`)?.value;
      const borderC = document.getElementById(`borderColor-${rule.id}`)?.value;
      const bgC = document.getElementById(`bgColor-${rule.id}`)?.value;
      const fSize = document.getElementById(`fontSize-${rule.id}`)?.value;

      if (textC) ruleBlock += `  SetTextColor ${hexToRGB(textC)}\n`;
      if (borderC) ruleBlock += `  SetBorderColor ${hexToRGB(borderC)}\n`;
      if (bgC && bgC.toLowerCase() !== "#ffffff") {
        ruleBlock += `  SetBackgroundColor ${hexToRGB(bgC)}\n`;
      }
      if (fSize) ruleBlock += `  SetFontSize ${fSize}\n`;
    }
    if (rule.alertSound) {
      const asound = document.getElementById(`alertSound-${rule.id}`)?.value;
      const adur = document.getElementById(`alertDuration-${rule.id}`)?.value;
      if (asound && adur) {
        ruleBlock += `  PlayAlertSound ${asound} ${adur}\n`;
      }
    }
    if (rule.playEffect) {
      const effColor = document.getElementById(`effectColor-${rule.id}`)?.value;
      const effTemp = document.getElementById(`effectTemp-${rule.id}`)?.checked;
      if (effColor) {
        ruleBlock += `  PlayEffect ${effColor}${effTemp ? " Temp" : ""}\n`;
      }
    }
    if (rule.minimapIcon) {
      const mTier = document.getElementById(`iconTier-${rule.id}`)?.value;
      const mColor = document.getElementById(`iconColor-${rule.id}`)?.value;
      const mShape = document.getElementById(`iconShape-${rule.id}`)?.value;
      if (mTier && mColor && mShape) {
        ruleBlock += `  MinimapIcon ${mTier} ${mColor} ${mShape}\n`;
      }
    }

    ruleBlock += "\n";
    content += ruleBlock;
  });

  return content;
}

/***************************************************************
 * MAIN EVENT LISTENER
 ***************************************************************/
document.getElementById("filter-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const filterContent = generateFilterContent();

  // Build a Blob for download
  const blob = new Blob([filterContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.getElementById("download-link");
  downloadLink.href = url;
  downloadLink.download = "my-custom-filter.filter";

  document.getElementById("download-section").style.display = "block";
});

// Load on page ready
window.addEventListener("DOMContentLoaded", loadRules);
