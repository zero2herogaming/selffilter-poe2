/***************************************************************
 * 1. HELPER FUNCTIONS
 ***************************************************************/
function rgbaToHex(rgba) {
  if (!rgba) return "#ffffff";
  const match = rgba.match(/\d+/g);
  if (!match) return "#ffffff";
  const [r, g, b] = match;
  return `#${[r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`;
}

function hexToRGB(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b} 255`; // alpha=255 by default
}

/***************************************************************
 * 2. MASTER CATEGORY LIST
 * Each category has sub-rules for each sub-type you want to show/hide.
 * This is just an EXAMPLE: adjust as needed for your actual filter rules.
 ***************************************************************/
const CATEGORIES = [
  {
    categoryId: "weapons-onehand",
    categoryName: "Weapons: One-Handed",
    description: "Claws, Daggers, Wands, One Hand Swords, One Hand Axes, One Hand Maces, Sceptres, Spears, Flails.",
    rules: [
      {
        id: 1,
        name: "Enable One-Handed Swords",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "One Hand Swords",
        },
        colorSettings: {
          textColor: "rgba(255,180,0,1)",
          borderColor: "rgba(255,180,0,1)",
          backgroundColor: "rgba(0,0,0,0.5)",
          fontSize: 40,
        },
      },
      {
        id: 2,
        name: "Enable Daggers",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Daggers",
        },
      },
      // ...Add more for Claws, Wands, Axes, Maces, Sceptres, Spears, Flails...
    ],
  },
  {
    categoryId: "weapons-twohand",
    categoryName: "Weapons: Two-Handed",
    description: "Bows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces, Quarterstaves, Crossbows, Traps, Fishing Rods.",
    rules: [
      {
        id: 10,
        name: "Show Two Hand Swords",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Two Hand Swords",
        },
        colorSettings: {
          textColor: "rgba(200,200,200,1)",
          borderColor: "rgba(0,0,0,1)",
          backgroundColor: "rgba(60,60,60,0.5)",
          fontSize: 40,
        },
      },
      {
        id: 11,
        name: "Show Crossbows",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Crossbows",
        },
      },
      // ...Add more for Bows, Staves, Quarterstaves, etc....
    ],
  },
  {
    categoryId: "weapons-offhand",
    categoryName: "Off-hand Weapons",
    description: "Quivers, Shields, Foci.",
    rules: [
      {
        id: 20,
        name: "Enable Quivers",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Quivers",
        },
      },
      {
        id: 21,
        name: "Enable Shields",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Shields",
        },
      },
      {
        id: 22,
        name: "Enable Foci",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Foci",
        },
      },
    ],
  },
  {
    categoryId: "gems",
    categoryName: "Gems",
    description: "Skill Gems, Support Gems, Spirit Gems, etc.",
    rules: [
      {
        id: 30,
        name: "Show Skill Gems",
        hideRule: false,
        enabled: true,
        conditions: {
          baseTypes: ["Skill Gem"],
        },
      },
      {
        id: 31,
        name: "Show Support Gems",
        hideRule: false,
        enabled: true,
        conditions: {
          baseTypes: ["Support Gem"],
        },
      },
      {
        id: 32,
        name: "Show Spirit Gems",
        hideRule: false,
        enabled: true,
        conditions: {
          baseTypes: ["Spirit Gem"],
        },
      },
    ],
  },
  {
    categoryId: "armour",
    categoryName: "Armour",
    description: "Gloves, Boots, Body Armours, Helmets.",
    rules: [
      {
        id: 40,
        name: "Show Gloves",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Gloves",
        },
      },
      {
        id: 41,
        name: "Show Boots",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Boots",
        },
      },
      {
        id: 42,
        name: "Show Body Armours",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Body Armours",
        },
      },
      {
        id: 43,
        name: "Show Helmets",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Helmets",
        },
      },
    ],
  },
  {
    categoryId: "jewellery",
    categoryName: "Jewellery",
    description: "Amulets, Rings, Belts.",
    rules: [
      {
        id: 50,
        name: "Show Amulets",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Amulets",
        },
      },
      {
        id: 51,
        name: "Show Rings",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Rings",
        },
      },
      {
        id: 52,
        name: "Show Belts",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Belts",
        },
      },
    ],
  },
  {
    categoryId: "flasks",
    categoryName: "Flasks",
    description: "Flasks, Life Flasks, Mana Flasks, Charms.",
    rules: [
      {
        id: 60,
        name: "Show All Flasks",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Flasks",
        },
      },
      {
        id: 61,
        name: "Show Life Flasks",
        hideRule: false,
        enabled: true,
        conditions: {
          baseTypes: ["Life Flask"],
        },
      },
      {
        id: 62,
        name: "Show Mana Flasks",
        hideRule: false,
        enabled: true,
        conditions: {
          baseTypes: ["Mana Flask"],
        },
      },
      {
        id: 63,
        name: "Show Charms",
        hideRule: false,
        enabled: true,
        conditions: {
          baseTypes: ["Charm"],
        },
      },
    ],
  },
  {
    categoryId: "currency",
    categoryName: "Currency",
    description: "Stackable Currency, Distilled Emotions, Essences, Splinters, Catalysts.",
    rules: [
      {
        id: 70,
        name: "Stackable Currency (e.g. Gold, Chaos Orbs)",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Stackable Currency",
        },
      },
      {
        id: 71,
        name: "Distilled Emotions",
        hideRule: false,
        enabled: true,
        conditions: {
          baseTypes: ["Distilled Emotion"],
        },
      },
      {
        id: 72,
        name: "Essences",
        hideRule: false,
        enabled: true,
        conditions: {
          baseTypes: ["Essence of"],
        },
      },
      {
        id: 73,
        name: "Splinters",
        hideRule: false,
        enabled: true,
        conditions: {
          baseTypes: ["Splinter"],
        },
      },
      {
        id: 74,
        name: "Catalysts",
        hideRule: false,
        enabled: true,
        conditions: {
          baseTypes: ["Catalyst"],
        },
      },
    ],
  },
  {
    categoryId: "waystones",
    categoryName: "Waystones & Maps",
    description: "Waystones, Map Fragments, Misc Map Items.",
    rules: [
      {
        id: 80,
        name: "Show Waystones",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Waystones",
        },
      },
      {
        id: 81,
        name: "Map Fragments",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Map Fragments",
        },
      },
      {
        id: 82,
        name: "Misc Map Items",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Misc Map Items",
        },
      },
    ],
  },
  {
    categoryId: "jewels",
    categoryName: "Jewels",
    description: "Generic Jewels (ex: Abyss Jewels, Timeless Jewels, etc.)",
    rules: [
      {
        id: 90,
        name: "Show All Jewels",
        hideRule: false,
        enabled: true,
        conditions: {
          class: "Jewels",
        },
      },
    ],
  },
];

/***************************************************************
 * 3. DOM CREATION - TABS, CATEGORY SECTIONS
 ***************************************************************/
function createTabs() {
  const tabContainer = document.getElementById("category-tabs");

  CATEGORIES.forEach((cat, index) => {
    const button = document.createElement("button");
    button.classList.add("tab-button");
    button.innerText = cat.categoryName;
    button.addEventListener("click", () => {
      activateCategory(index);
    });
    tabContainer.appendChild(button);
  });
}

function createCategorySections() {
  const form = document.getElementById("filter-form");

  CATEGORIES.forEach((cat, index) => {
    const section = document.createElement("div");
    section.classList.add("category-section");
    if (index === 0) section.classList.add("active"); // default first active

    // Category title / description
    const heading = document.createElement("h2");
    heading.innerText = cat.categoryName;
    section.appendChild(heading);

    const desc = document.createElement("p");
    desc.innerText = cat.description;
    section.appendChild(desc);

    // Now create each rule inside this category
    cat.rules.forEach(rule => {
      const ruleDiv = createRuleHTML(cat.categoryId, rule);
      section.appendChild(ruleDiv);
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
 * 4. BUILDING EACH RULE'S HTML
 ***************************************************************/
function createRuleHTML(categoryId, rule) {
  const container = document.createElement("div");
  container.classList.add("rule");

  // Title
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("rule-title");
  titleDiv.innerText = rule.name;
  container.appendChild(titleDiv);

  // Basic info
  let html = `
    <label>
      <input type="checkbox" id="enable-${categoryId}-${rule.id}" ${rule.enabled ? "checked" : ""} />
      Enable
    </label>
  `;

  // Show or Hide
  html += `<p style="margin-top:5px;color:${rule.hideRule ? 'red':'lime'};">${rule.hideRule ? 'HIDE Rule' : 'SHOW Rule'}</p>`;

  // Explanation text (optional)
  html += `
    <p style="font-style: italic; margin:6px 0;">
      <strong>Advanced fields:</strong> 
      <br/>- <em>ItemLevel</em>: an item's internal level requirement
      <br/>- <em>AreaLevel</em>: the zone level you're in
      <br/>- <em>StackSize</em>: for stackable currency
      <br/>- <em>BaseType</em>: exact item name
      <br/>- <em>Class</em>: high-level category (e.g. "Swords", "Claws")
    </p>
  `;

  // Colors / Font
  if (rule.colorSettings) {
    const textC = rgbaToHex(rule.colorSettings.textColor);
    const borderC = rgbaToHex(rule.colorSettings.borderColor);
    const bgC = rgbaToHex(rule.colorSettings.backgroundColor);
    const fSize = rule.colorSettings.fontSize || 35;

    html += `
      <label>Text Color:
        <input type="color" id="textColor-${categoryId}-${rule.id}" value="${textC}"/>
      </label>
      <label>Border Color:
        <input type="color" id="borderColor-${categoryId}-${rule.id}" value="${borderC}"/>
      </label>
      <label>Background Color:
        <input type="color" id="bgColor-${categoryId}-${rule.id}" value="${bgC}"/>
      </label>
      <label>Font Size:
        <input type="number" id="fontSize-${categoryId}-${rule.id}" value="${fSize}" min="12" max="60"/>
      </label>
    `;
  }

  // Sounds
  if (rule.alertSound) {
    html += `
      <label>Alert Sound:
        <select id="alertSound-${categoryId}-${rule.id}">
          <option value="1" ${rule.alertSound.id===1?'selected':''}>Alert 1</option>
          <option value="2" ${rule.alertSound.id===2?'selected':''}>Alert 2</option>
          <option value="3" ${rule.alertSound.id===3?'selected':''}>Alert 3</option>
          <option value="4" ${rule.alertSound.id===4?'selected':''}>Alert 4</option>
          <option value="6" ${rule.alertSound.id===6?'selected':''}>Alert 6</option>
          <option value="10" ${rule.alertSound.id===10?'selected':''}>Alert 10</option>
        </select>
        Duration:
        <input type="number" id="alertDuration-${categoryId}-${rule.id}" value="${rule.alertSound.duration || 300}" min="50" max="1000" />
      </label>
    `;
  }

  container.innerHTML += html;
  return container;
}

/***************************************************************
 * 5. GENERATING THE FILTER
 ***************************************************************/
function generateFilterContent() {
  let content = "";

  CATEGORIES.forEach(cat => {
    cat.rules.forEach(rule => {
      const enableEl = document.getElementById(`enable-${cat.categoryId}-${rule.id}`);
      if (!enableEl) return; // safety
      const enabled = enableEl.checked;
      if (!enabled) return; // skip if disabled

      // Show or Hide
      const blockType = rule.hideRule ? "Hide" : "Show";
      let ruleBlock = `${blockType}\n`;

      // Conditions
      const c = rule.conditions || {};

      // Rarity
      if (c.rarity) {
        ruleBlock += `  Rarity ${c.rarity}\n`;
      }
      if (c.rarityMax === "Magic") {
        ruleBlock += `  Rarity <= Magic\n`;
      }

      // Class
      if (c.class) {
        // possibly multiple classes space-separated
        const classes = c.class.split(" ").map(cl => `"${cl}"`).join(" ");
        ruleBlock += `  Class ${classes}\n`;
      }

      // BaseTypes
      if (c.baseTypes) {
        const baseStr = c.baseTypes.map(b => `"${b}"`).join(" ");
        ruleBlock += `  BaseType ${baseStr}\n`;
      }

      // areaLevelRange, stackSizeRange, itemLevelRange, etc. can be similarly done
      // For brevity, let's skip the advanced numeric logic and do your basic approach.

      // Colors, fonts, sounds
      if (rule.colorSettings) {
        const textVal = document.getElementById(`textColor-${cat.categoryId}-${rule.id}`)?.value;
        const borderVal = document.getElementById(`borderColor-${cat.categoryId}-${rule.id}`)?.value;
        const bgVal = document.getElementById(`bgColor-${cat.categoryId}-${rule.id}`)?.value;
        const fontVal = document.getElementById(`fontSize-${cat.categoryId}-${rule.id}`)?.value;

        if (textVal) ruleBlock += `  SetTextColor ${hexToRGB(textVal)}\n`;
        if (borderVal) ruleBlock += `  SetBorderColor ${hexToRGB(borderVal)}\n`;
        if (bgVal && bgVal.toLowerCase() !== "#ffffff") {
          ruleBlock += `  SetBackgroundColor ${hexToRGB(bgVal)}\n`;
        }
        if (fontVal) ruleBlock += `  SetFontSize ${fontVal}\n`;
      }

      if (rule.alertSound) {
        const aSound = document.getElementById(`alertSound-${cat.categoryId}-${rule.id}`)?.value;
        const aDur = document.getElementById(`alertDuration-${cat.categoryId}-${rule.id}`)?.value;
        if (aSound && aDur) ruleBlock += `  PlayAlertSound ${aSound} ${aDur}\n`;
      }

      ruleBlock += "\n";
      content += ruleBlock;
    });
  });

  return content;
}

/***************************************************************
 * 6. INIT & EVENT LISTENERS
 ***************************************************************/
function init() {
  createTabs();
  createCategorySections();
  activateCategory(0); // default to first category
}

document.getElementById("filter-form").addEventListener("submit", function(e){
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
