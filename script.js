/***************************************************************
 * 1. HELPER FUNCTIONS
 ***************************************************************/
function rgbaToHex(rgba) {
  if (!rgba) return "#ffffff";
  const match = rgba.match(/\d+/g);
  if (!match) return "#ffffff";
  const [r, g, b] = match;
  return `#${[r, g, b]
    .map(x => parseInt(x).toString(16).padStart(2,"0"))
    .join("")}`;
}

function hexToRGB(hex) {
  const bigint = parseInt(hex.replace("#",""),16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b} 255`;
}

/***************************************************************
 * 2. COMPLETE CATEGORIES & ITEMS
 *  - 10 categories:
 *     1) Gems
 *     2) One-Handed Weapons
 *     3) Two-Handed Weapons
 *     4) Off-hand
 *     5) Armour
 *     6) Jewellery
 *     7) Flasks
 *     8) Currency
 *     9) Waystones
 *     10) Jewels
 *  - Includes items from your filter references (e.g. "Breach Ring",
 *    "Uncut Skill Gem", "Distilled Fear", "Rune", "Charm", "Gold", etc.)
 *  - Also retains logic for swords, flails, crossbows, etc.
 ***************************************************************/
const CATEGORIES = [
  /*************************************************************
   * 1) GEMS
   *************************************************************/
  {
    categoryId: "gems",
    categoryName: "Gems",
    description: "Skill Gems, Support Gems, Spirit Gems, plus unique references like Soul Core, Timeless, Relic, etc.",
    itemTypes: [
      // From your filter: Uncut spirit/support/skill gems
      { id: 1,  name: "Uncut Spirit Gem",  showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 2,  name: "Uncut Support Gem", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 3,  name: "Uncut Skill Gem",   showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },

      // Soul Core, Timeless
      { id: 4,  name: "Soul Core",         showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: false },
      { id: 5,  name: "Timeless",          showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: false },

      // "Relic" => Class "Relic"
      { id: 6,  name: "Relic",            showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: false }
    ]
  },

  /*************************************************************
   * 2) ONE-HANDED WEAPONS
   *************************************************************/
  {
    categoryId: "weapons-onehand",
    categoryName: "One-Handed Weapons",
    description: "Claws, Daggers, Wands, One Hand Swords, Axes, Maces, Sceptres, Spears, Flails.",
    itemTypes: [
      { id:10, name: "Claws",           showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:11, name: "Daggers",         showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:12, name: "Wands",           showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:13, name: "One Hand Swords", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:14, name: "One Hand Axes",   showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:15, name: "One Hand Maces",  showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:16, name: "Sceptres",        showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:17, name: "Spears",          showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:18, name: "Flails",          showOrHide: "Hide", enabled: false, isStackable: false, usesItemLevel: true }
    ]
  },

  /*************************************************************
   * 3) TWO-HANDED WEAPONS
   *************************************************************/
  {
    categoryId: "weapons-twohand",
    categoryName: "Two-Handed Weapons",
    description: "Bows, Staves, Quarterstaves, Crossbows, Traps, Fishing Rods, etc.",
    itemTypes: [
      { id:20, name: "Bows",          showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:21, name: "Staves",        showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:22, name: "Quarterstaves", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:23, name: "Crossbows",     showOrHide: "Hide", enabled: false, isStackable: false, usesItemLevel: true },
      // You mentioned "Traps" or "Fishing Rods" in previous code, keep them:
      { id:24, name: "Traps",         showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:25, name: "Fishing Rods",  showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true }
    ]
  },

  /*************************************************************
   * 4) OFF-HAND
   *************************************************************/
  {
    categoryId: "weapons-offhand",
    categoryName: "Off-hand Items",
    description: "Quivers, Shields, Foci.",
    itemTypes: [
      { id:30, name: "Quivers", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:31, name: "Shields", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:32, name: "Foci",    showOrHide: "Hide", enabled: false, isStackable: false, usesItemLevel: true }
    ]
  },

  /*************************************************************
   * 5) ARMOUR
   *************************************************************/
  {
    categoryId: "armour",
    categoryName: "Armour",
    description: "Gloves, Boots, Body Armours, Helmets.",
    itemTypes: [
      { id:40, name: "Gloves",       showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:41, name: "Boots",        showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:42, name: "Body Armours", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:43, name: "Helmets",      showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },

      // The filter references "Expert Laced Boots" via BaseType. 
      // If you want that specifically matched, add "Expert Laced Boots" as stackable? 
      // Actually "boots" are gear, so Class. Let's keep "Boots" as the class. 
      // It's a special base, so the parser won't auto-match unless we do exact name "Expert Laced Boots".
    ]
  },

  /*************************************************************
   * 6) JEWELLERY
   *************************************************************/
  {
    categoryId: "jewellery",
    categoryName: "Jewellery",
    description: "Amulets, Rings, Belts (Rare, Normal, Magic).",
    itemTypes: [
      { id:50, name: "Rings",   showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:51, name: "Amulets", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:52, name: "Belts",   showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true }
    ]
  },

  /*************************************************************
   * 7) FLASKS
   *************************************************************/
  {
    categoryId: "flasks",
    categoryName: "Flasks",
    description: "Flasks, Life Flasks, Mana Flasks, Charms.",
    itemTypes: [
      { id:60, name: "Flasks",      showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:61, name: "Life Flasks", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:62, name: "Mana Flasks", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:63, name: "Charms",      showOrHide: "Hide", enabled: false, isStackable: false, usesItemLevel: false }
    ]
  },

  /*************************************************************
   * 8) CURRENCY (Huge category)
   *************************************************************/
  {
    categoryId: "currency",
    categoryName: "Currency",
    description: "Mirror, Divine, Distilled orbs, Splinters, Shards, etc.",
    itemTypes: [
      // Mirror, Divine, Perfect Jeweller's Orb
      { id:70, name: "Mirror",                   showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:71, name: "Divine",                   showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:72, name: "Perfect Jeweller's Orb",   showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      // Distilled Isolation, Distilled Suffering, Distilled Fear, Distilled Despair
      { id:73, name: "Distilled Isolation",      showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:74, name: "Distilled Suffering",      showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:75, name: "Distilled Fear",           showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:76, name: "Distilled Despair",        showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      // Gold
      { id:77, name: "Gold",                     showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },

      // e.g. "Orb of Annulment", "Orb of Chance", "Greater Jeweller's Orb"
      { id:78, name: "Orb of Annulment",         showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:79, name: "Orb of Chance",            showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:80, name: "Greater Jeweller's Orb",   showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:81, name: "Exotic Coinage",           showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:82, name: "Exalted Orb",              showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:83, name: "Gold Key",                 showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:84, name: "Silver Key",               showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:85, name: "Bronze Key",               showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      // Gemcutter's Prism, Vaal Orb, Chaos Orb, Lesser Jeweller's Orb, Regal Orb, etc.
      { id:86, name: "Gemcutter's Prism",        showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:87, name: "Vaal Orb",                 showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:88, name: "Chaos Orb",                showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:89, name: "Lesser Jeweller's Orb",    showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:90, name: "Regal Orb",                showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:91, name: "Artificer's Orb",          showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:92, name: "Glassblower's Bauble",     showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:93, name: "Orb of Alchemy",           showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },

      // Splinters, etc.
      { id:94, name: "Simulacrum Splinter",      showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:95, name: "Breach Splinter",          showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:96, name: " Artifact",                showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:97, name: "Omen of",                  showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: false },
      { id:98, name: "Distilled",                showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:99, name: "Catalyst",                 showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:100,name: "Essence of",               showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:101,name: "Arcanist's Etcher",        showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:102,name: "Armourer's Scrap",         showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:103,name: "Blacksmith's Whetstone",   showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:104,name: "Orb of Augmentation",      showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:105,name: "Orb of Transmutation",     showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:106,name: "Regal Shard",              showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:107,name: "Chance Shard",             showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:108,name: "Scroll of Wisdom",         showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:109,name: "Shard",                    showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },

      // Barya, Ultimatum
      { id:110,name: "Barya",                    showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:111,name: "Ultimatum",                showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },

      // Simulacrum, Tablet, Breachstone, Cowardly Fate, Deadly Fate, Victorious Fate, Expedition Logbook, "Test of"
      { id:112,name: "Simulacrum",               showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:113,name: " Tablet",                  showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:114,name: "Breachstone",              showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:115,name: "Cowardly Fate",            showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:116,name: "Deadly Fate",              showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:117,name: "Victorious Fate",          showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:118,name: "Expedition Logbook",       showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:119,name: "Test of",                  showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false }
    ]
  },

  /*************************************************************
   * 9) WAYSTONES
   *************************************************************/
  {
    categoryId: "waystones",
    categoryName: "Waystones",
    description: "BaseType Waystone references in your filter.",
    itemTypes: [
      {
        id:130,
        name: "Waystone",
        showOrHide: "Show",
        enabled: false,
        isStackable: false,
        usesItemLevel: true
      }
    ]
  },

  /*************************************************************
   * 10) JEWELS
   *************************************************************/
  {
    categoryId: "jewels",
    categoryName: "Jewels",
    description: "Generic Jewels (Abyss, Timeless, Rare Jewels, etc.).",
    itemTypes: [
      // The filter uses Class "Jewel" Rarity <= Rare, also mentions e.g. "Breach Rings"? We put those in other categories.
      {
        id:140,
        name: "Jewel", // matched by Class "Jewel"
        showOrHide: "Show",
        enabled: false,
        isStackable: false,
        usesItemLevel: true
      }
    ]
  }
];

/***************************************************************
 * 3. CREATE TABS & SECTIONS
 ***************************************************************/
function createTabs() {
  const tabContainer = document.getElementById("category-tabs");
  CATEGORIES.forEach((cat, index) => {
    const btn = document.createElement("button");
    btn.classList.add("tab-button");
    btn.innerText = cat.categoryName;
    btn.addEventListener("click", () => activateCategory(index));
    tabContainer.appendChild(btn);
  });
}

function createCategorySections() {
  const form = document.getElementById("filter-form");
  CATEGORIES.forEach((cat, idx) => {
    const section = document.createElement("div");
    section.classList.add("category-section");
    if (idx === 0) section.classList.add("active");

    const heading = document.createElement("h2");
    heading.innerText = cat.categoryName;
    section.appendChild(heading);

    const desc = document.createElement("p");
    desc.innerText = cat.description;
    section.appendChild(desc);

    cat.itemTypes.forEach((item) => {
      const itemDiv = createItemTypeHTML(cat.categoryId, item);
      section.appendChild(itemDiv);
    });

    form.insertBefore(section, document.getElementById("generate-button"));
  });
}

function activateCategory(index) {
  const allSections = document.querySelectorAll(".category-section");
  const allButtons = document.querySelectorAll(".tab-button");
  allSections.forEach(sec => sec.classList.remove("active"));
  allButtons.forEach(btn => btn.classList.remove("active"));

  allSections[index].classList.add("active");
  allButtons[index].classList.add("active");
}

/***************************************************************
 * 4. BUILD HTML FOR EACH ITEM TYPE
 ***************************************************************/
function createItemTypeHTML(categoryId, item) {
  const container = document.createElement("div");
  container.classList.add("item-type");

  const titleDiv = document.createElement("div");
  titleDiv.classList.add("item-type-title");
  titleDiv.innerText = item.name;
  container.appendChild(titleDiv);

  let html = `
    <label>
      <input type="checkbox" id="enable-${categoryId}-${item.id}" ${item.enabled ? "checked" : ""}/>
      Enable
    </label>

    <label>
      Action:
      <select id="showOrHide-${categoryId}-${item.id}">
        <option value="Show"  ${item.showOrHide==="Show" ? "selected" : ""}>Show</option>
        <option value="Hide"  ${item.showOrHide==="Hide" ? "selected" : ""}>Hide</option>
      </select>
    </label>

    <label>Rarity:</label>
    <div style="margin-left:20px;">
      <label><input type="checkbox" id="rarity-normal-${categoryId}-${item.id}"/> Normal</label>
      <label><input type="checkbox" id="rarity-magic-${categoryId}-${item.id}"/> Magic</label>
      <label><input type="checkbox" id="rarity-rare-${categoryId}-${item.id}"/> Rare</label>
      <label><input type="checkbox" id="rarity-unique-${categoryId}-${item.id}"/> Unique</label>
    </div>

    <label>Sockets >:
      <input type="number" id="sockets-${categoryId}-${item.id}" value="" min="0"/>
    </label>

    <label>Quality >:
      <input type="number" id="quality-${categoryId}-${item.id}" value="" min="0"/>
    </label>
  `;

  // If usesItemLevel => "ItemLevel = x"
  if (item.usesItemLevel) {
    html += `
      <label>ItemLevel =:
        <input type="number" id="itemLevel-${categoryId}-${item.id}" value="" min="0"/>
      </label>
    `;
  }

  // If isStackable => "StackSize >= x"
  if (item.isStackable) {
    html += `
      <label>StackSize >=:
        <input type="number" id="stackSize-${categoryId}-${item.id}" value="" min="0"/>
      </label>
    `;
  }

  // Single operator area-level
  html += `
    <label>AreaLevel:
      <select id="areaLevelOp-${categoryId}-${item.id}">
        <option value="">None</option>
        <option value=">=">>=</option>
        <option value="<="><=</option>
        <option value="=">=</option>
      </select>
      <input type="number" id="areaLevelVal-${categoryId}-${item.id}" value="" min="0"/>
    </label>

    <label>Text Color:
      <input type="color" id="textColor-${categoryId}-${item.id}" value="#ffffff"/>
    </label>
    <label>Border Color:
      <input type="color" id="borderColor-${categoryId}-${item.id}" value="#ffffff"/>
    </label>
    <label>Background Color:
      <input type="color" id="bgColor-${categoryId}-${item.id}" value="#000000"/>
    </label>
    <label>Font Size:
      <input type="number" id="fontSize-${categoryId}-${item.id}" value="35" min="12" max="60"/>
    </label>

    <label>Alert Sound:
      <select id="alertSound-${categoryId}-${item.id}">
        <option value="">None</option>
        <option value="1">Alert 1</option>
        <option value="2">Alert 2</option>
        <option value="3">Alert 3</option>
        <option value="4">Alert 4</option>
        <option value="6">Alert 6</option>
        <option value="10">Alert 10</option>
      </select>
      <input type="number" id="alertDuration-${categoryId}-${item.id}" value="300" min="50" max="1000"/>
    </label>
  `;

  container.innerHTML += html;
  return container;
}

/***************************************************************
 * 5. GENERATE FILTER CONTENT
 ***************************************************************/
function generateFilterContent() {
  let content = "";
  CATEGORIES.forEach(cat => {
    cat.itemTypes.forEach(item => {
      const enableBox = document.getElementById(`enable-${cat.categoryId}-${item.id}`);
      if (!enableBox || !enableBox.checked) return;

      const showOrHide = document.getElementById(`showOrHide-${cat.categoryId}-${item.id}`).value;
      let ruleBlock = `${showOrHide}\n`;

      // Rarity
      const normalCk = document.getElementById(`rarity-normal-${cat.categoryId}-${item.id}`).checked;
      const magicCk  = document.getElementById(`rarity-magic-${cat.categoryId}-${item.id}`).checked;
      const rareCk   = document.getElementById(`rarity-rare-${cat.categoryId}-${item.id}`).checked;
      const uniqCk   = document.getElementById(`rarity-unique-${cat.categoryId}-${item.id}`).checked;
      let rarities = [];
      if (normalCk) rarities.push("Normal");
      if (magicCk)  rarities.push("Magic");
      if (rareCk)   rarities.push("Rare");
      if (uniqCk)   rarities.push("Unique");
      if (rarities.length>0) {
        ruleBlock += `  Rarity ${rarities.join(" ")}\n`;
      }

      // Sockets > x
      const sockVal = parseInt(document.getElementById(`sockets-${cat.categoryId}-${item.id}`).value||"0",10);
      if (sockVal>0) {
        ruleBlock += `  Sockets > ${sockVal}\n`;
      }

      // Quality > x
      const qualVal = parseInt(document.getElementById(`quality-${cat.categoryId}-${item.id}`).value||"0",10);
      if (qualVal>0) {
        ruleBlock += `  Quality > ${qualVal}\n`;
      }

      // ItemLevel = x
      if (item.usesItemLevel) {
        const iLvl = parseInt(document.getElementById(`itemLevel-${cat.categoryId}-${item.id}`).value||"0",10);
        if (iLvl>0) {
          ruleBlock += `  ItemLevel = ${iLvl}\n`;
        }
      }

      // StackSize >= x
      if (item.isStackable) {
        const stVal = parseInt(document.getElementById(`stackSize-${cat.categoryId}-${item.id}`).value||"0",10);
        if (stVal>0) {
          ruleBlock += `  StackSize >= ${stVal}\n`;
        }
      }

      // AreaLevel
      const areaOp  = document.getElementById(`areaLevelOp-${cat.categoryId}-${item.id}`).value;
      const areaVal = parseInt(document.getElementById(`areaLevelVal-${cat.categoryId}-${item.id}`).value||"0",10);
      if (areaOp && areaVal>0) {
        ruleBlock += `  AreaLevel ${areaOp} ${areaVal}\n`;
      }

      // Class or BaseType
      if (item.isStackable) {
        ruleBlock += `  BaseType "${item.name}"\n`;
      } else {
        ruleBlock += `  Class "${item.name}"\n`;
      }

      // Colors
      const textC = document.getElementById(`textColor-${cat.categoryId}-${item.id}`).value;
      const borderC=document.getElementById(`borderColor-${cat.categoryId}-${item.id}`).value;
      const bgC    =document.getElementById(`bgColor-${cat.categoryId}-${item.id}`).value;
      const fontC  =document.getElementById(`fontSize-${cat.categoryId}-${item.id}`).value;
      if (textC)  ruleBlock += `  SetTextColor ${hexToRGB(textC)}\n`;
      if (borderC)ruleBlock += `  SetBorderColor ${hexToRGB(borderC)}\n`;
      if (bgC && bgC.toLowerCase()!=="#ffffff") {
        ruleBlock += `  SetBackgroundColor ${hexToRGB(bgC)}\n`;
      }
      if (fontC) {
        ruleBlock += `  SetFontSize ${fontC}\n`;
      }

      // Alert Sound
      const aSound= document.getElementById(`alertSound-${cat.categoryId}-${item.id}`).value;
      const aDur  = document.getElementById(`alertDuration-${cat.categoryId}-${item.id}`).value;
      if (aSound) {
        ruleBlock += `  PlayAlertSound ${aSound} ${aDur}\n`;
      }

      ruleBlock += "\n";
      content += ruleBlock;
    });
  });
  return content;
}

/***************************************************************
 * 6. ADVANCED PARSING (BLOCK -> UI)
 * Splits the filter text into Show/Hide blocks, 
 * tries to match each block's Class/BaseType with 
 * an item in the categories array, then auto-populates.
 ***************************************************************/
function parseFilterText(rawText) {
  const text = rawText.trim();
  if (!text) {
    alert("No filter text found. Please paste your filter!");
    return;
  }

  // Split lines
  const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(l=>l!=="");
  let blocks = [];
  let current = [];

  function pushBlock() {
    if (current.length>0) {
      blocks.push([...current]);
      current=[];
    }
  }

  // gather blocks
  lines.forEach(ln => {
    if (ln.startsWith("Show") || ln.startsWith("Hide")) {
      pushBlock();
      current.push(ln);
    } else {
      current.push(ln);
    }
  });
  pushBlock();

  if (blocks.length===0) {
    alert("No 'Show' or 'Hide' lines found. This filter may not match the expected format.");
    return;
  }

  let matchedCount=0;

  // parse each block
  for (let block of blocks) {
    const showOrHide= block[0].startsWith("Show") ? "Show" : "Hide";
    let linesDict = {
      showOrHide,
      rarities:[],
      sockets:0,
      quality:0,
      itemLevel:0,
      stackSize:0,
      areaOp:"",
      areaVal:0,
      className:"",
      baseName:"",
      textColor:"",
      borderColor:"",
      bgColor:"",
      fontSize:"",
      alertSound:"",
      alertDur:"300"
    };

    // read lines
    for (let line of block.slice(1)) {
      if (line.startsWith("Rarity ")) {
        linesDict.rarities=line.replace("Rarity ","").split(" ");
      } else if (line.startsWith("Sockets > ")) {
        linesDict.sockets=parseInt(line.replace("Sockets > ",""),10);
      } else if (line.startsWith("Quality > ")) {
        linesDict.quality=parseInt(line.replace("Quality > ",""),10);
      } else if (line.startsWith("ItemLevel = ")) {
        linesDict.itemLevel=parseInt(line.replace("ItemLevel = ",""),10);
      } else if (line.startsWith("StackSize >=")) {
        linesDict.stackSize=parseInt(line.replace("StackSize >=",""),10);
      } else if (line.startsWith("AreaLevel ")) {
        const tokens=line.split(" ");
        if (tokens.length===3) {
          linesDict.areaOp = tokens[1];
          linesDict.areaVal= parseInt(tokens[2],10);
        }
      } else if (line.startsWith("Class ")) {
        let n=line.replace("Class ","").trim();
        linesDict.className=n.replace(/"/g,"");
      } else if (line.startsWith("BaseType ")) {
        let n=line.replace("BaseType ","").trim();
        linesDict.baseName=n.replace(/"/g,"");
      } else if (line.startsWith("SetTextColor ")) {
        linesDict.textColor=line.replace("SetTextColor ","").trim();
      } else if (line.startsWith("SetBorderColor ")) {
        linesDict.borderColor=line.replace("SetBorderColor ","").trim();
      } else if (line.startsWith("SetBackgroundColor ")) {
        linesDict.bgColor=line.replace("SetBackgroundColor ","").trim();
      } else if (line.startsWith("SetFontSize ")) {
        linesDict.fontSize=line.replace("SetFontSize ","").trim();
      } else if (line.startsWith("PlayAlertSound ")) {
        const parts=line.replace("PlayAlertSound ","").split(" ");
        linesDict.alertSound= parts[0];
        if (parts[1]) linesDict.alertDur= parts[1];
      }
    }

    // find item
    let foundItem=null;
    let foundCat=null;

    if (linesDict.baseName) {
      // stackable item
      for (let cat of CATEGORIES) {
        for (let it of cat.itemTypes) {
          if (it.isStackable && it.name===linesDict.baseName) {
            foundCat=cat; foundItem=it; break;
          }
        }
        if (foundItem) break;
      }
    } else if (linesDict.className) {
      // non-stackable
      for (let cat of CATEGORIES) {
        for (let it of cat.itemTypes) {
          if (!it.isStackable && it.name===linesDict.className) {
            foundCat=cat; foundItem=it; break;
          }
        }
        if (foundItem) break;
      }
    }

    if (foundCat && foundItem) {
      matchedCount++;
      // enable
      document.getElementById(`enable-${foundCat.categoryId}-${foundItem.id}`).checked=true;
      // show/hide
      document.getElementById(`showOrHide-${foundCat.categoryId}-${foundItem.id}`).value= linesDict.showOrHide;

      // rarities
      if (linesDict.rarities.includes("Normal")) {
        document.getElementById(`rarity-normal-${foundCat.categoryId}-${foundItem.id}`).checked=true;
      }
      if (linesDict.rarities.includes("Magic")) {
        document.getElementById(`rarity-magic-${foundCat.categoryId}-${foundItem.id}`).checked=true;
      }
      if (linesDict.rarities.includes("Rare")) {
        document.getElementById(`rarity-rare-${foundCat.categoryId}-${foundItem.id}`).checked=true;
      }
      if (linesDict.rarities.includes("Unique")) {
        document.getElementById(`rarity-unique-${foundCat.categoryId}-${foundItem.id}`).checked=true;
      }

      if (linesDict.sockets>0) {
        document.getElementById(`sockets-${foundCat.categoryId}-${foundItem.id}`).value=linesDict.sockets;
      }
      if (linesDict.quality>0) {
        document.getElementById(`quality-${foundCat.categoryId}-${foundItem.id}`).value=linesDict.quality;
      }
      if (foundItem.usesItemLevel && linesDict.itemLevel>0) {
        document.getElementById(`itemLevel-${foundCat.categoryId}-${foundItem.id}`).value=linesDict.itemLevel;
      }
      if (foundItem.isStackable && linesDict.stackSize>0) {
        document.getElementById(`stackSize-${foundCat.categoryId}-${foundItem.id}`).value=linesDict.stackSize;
      }
      if (linesDict.areaOp && linesDict.areaVal>0) {
        document.getElementById(`areaLevelOp-${foundCat.categoryId}-${foundItem.id}`).value=linesDict.areaOp;
        document.getElementById(`areaLevelVal-${foundCat.categoryId}-${foundItem.id}`).value=linesDict.areaVal;
      }

      // parse color lines -> hex
      if (linesDict.textColor) {
        const rgb= linesDict.textColor.split(" ").map(x=>parseInt(x,10));
        if (rgb.length>=3) {
          const cHex="#"+rgb.slice(0,3).map(x=> x.toString(16).padStart(2,"0")).join("");
          document.getElementById(`textColor-${foundCat.categoryId}-${foundItem.id}`).value=cHex;
        }
      }
      if (linesDict.borderColor) {
        const rgb= linesDict.borderColor.split(" ").map(x=>parseInt(x,10));
        if (rgb.length>=3) {
          const cHex="#"+rgb.slice(0,3).map(x=> x.toString(16).padStart(2,"0")).join("");
          document.getElementById(`borderColor-${foundCat.categoryId}-${foundItem.id}`).value=cHex;
        }
      }
      if (linesDict.bgColor) {
        const rgb= linesDict.bgColor.split(" ").map(x=>parseInt(x,10));
        if (rgb.length>=3) {
          const cHex="#"+rgb.slice(0,3).map(x=> x.toString(16).padStart(2,"0")).join("");
          document.getElementById(`bgColor-${foundCat.categoryId}-${foundItem.id}`).value=cHex;
        }
      }
      if (linesDict.fontSize) {
        document.getElementById(`fontSize-${foundCat.categoryId}-${foundItem.id}`).value=linesDict.fontSize;
      }
      if (linesDict.alertSound) {
        document.getElementById(`alertSound-${foundCat.categoryId}-${foundItem.id}`).value=linesDict.alertSound;
        document.getElementById(`alertDuration-${foundCat.categoryId}-${foundItem.id}`).value=linesDict.alertDur;
      }
    }
  }

  alert(`Loaded filter with ${blocks.length} blocks total. Matched & set ${matchedCount} item(s) in the UI!`);
}

/***************************************************************
 * 7. INIT & EVENT LISTENERS
 ***************************************************************/
function init() {
  createTabs();
  createCategorySections();
  activateCategory(0);

  // "Load Filter from Text" button
  const loadBtn = document.getElementById("load-filter-button");
  if (loadBtn) {
    loadBtn.addEventListener("click", () => {
      const raw = document.getElementById("filter-load-text")?.value || "";
      parseFilterText(raw);
    });
  }
}

// Generate & download
document.getElementById("filter-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const filterText = generateFilterContent();
  const blob = new Blob([filterText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.getElementById("download-link");
  downloadLink.href = url;
  downloadLink.download = "my-custom-filter.filter";

  document.getElementById("download-section").style.display = "block";
});

window.addEventListener("DOMContentLoaded", init);
