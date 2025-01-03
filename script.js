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

function buildConditionLine(field, operator, value) {
  if (operator === "none") return "";
  if (value === "" || value === null || value === undefined) return "";
  return `${field} ${operator} ${value}`;
}

/***************************************************************
 * 2. CATEGORIES & RULES
 * We break rules into logical categories. 
 * Each "category" has:
 *   - A unique "categoryId"
 *   - A "categoryName"
 *   - A "description"
 *   - A "rules" array (the actual Show/Hide blocks)
 ***************************************************************/
const CATEGORIES = [
  {
    categoryId: "uniques",
    categoryName: "Unique Items",
    description: "All Unique-related rules. For example, toggling crossbows in unique can be different from crossbows in normal.",
    rules: [
      // Example unique rule: Crossbows
      {
        id: 1,
        name: "Unique Crossbows",
        hideRule: false,
        enabled: true,
        conditions: {
          rarity: "Unique",
          class: "Crossbows", 
        },
        colorSettings: {
          textColor: "rgba(255,0,0,1)",
          borderColor: "rgba(255,0,0,1)",
          backgroundColor: "rgba(255,255,255,1)",
          fontSize: 45,
        },
        alertSound: { id: 6, duration: 300 },
      },
      // ... More unique items for belts, helmets, etc.
    ],
  },
  {
    categoryId: "normal-items",
    categoryName: "Normal Items",
    description: "Options for regular (white) items. Decide if you want to hide or show certain subtypes like Crossbows.",
    rules: [
      {
        id: 10,
        name: "Normal Crossbows",
        hideRule: false,
        enabled: true,
        conditions: {
          rarity: "Normal",
          class: "Crossbows",
        },
        colorSettings: {
          textColor: "rgba(180,180,180,1)",
          borderColor: "rgba(0,0,0,1)",
          backgroundColor: "rgba(0,0,0,0.7)",
          fontSize: 35,
        },
      },
      // Additional normal items...
    ],
  },
  {
    categoryId: "rare-items",
    categoryName: "Rare Items",
    description: "Yellow (rare) items. You can choose to highlight or hide crossbows, belts, boots, etc., at certain AreaLevels or drop levels.",
    rules: [
      {
        id: 20,
        name: "Rare Crossbows",
        hideRule: false,
        enabled: true,
        conditions: {
          rarity: "Rare",
          class: "Crossbows",
        },
        colorSettings: {
          textColor: "rgba(0,240,190,1)",
          borderColor: "rgba(0,240,190,1)",
          fontSize: 40,
        },
      },
      // Additional rare items...
    ],
  },
  {
    categoryId: "currency",
    categoryName: "Currency",
    description: "Controls for currency items (e.g. Divine Orbs, Splinters, Catalyst, Gold, etc.). Adjust stack size thresholds, highlight colors, etc.",
    rules: [
      {
        id: 30,
        name: "Gold - Large Stacks (StackSize >= 500)",
        hideRule: false, // or true if you want to hide them
        enabled: true,
        conditions: {
          baseTypes: ["Gold"],
          stackSizeRange: { min: 500 },
        },
        colorSettings: {
          textColor: "rgba(255,255,255,1)",
          borderColor: "rgba(255,255,255,1)",
          backgroundColor: "rgba(0,0,0,0)",
          fontSize: 35,
        },
      },
      // More currency rules...
    ],
  },
  {
    categoryId: "gems",
    categoryName: "Gems",
    description: "Handles uncut gems, skill gems, itemLevel settings, etc.",
    rules: [
      {
        id: 40,
        name: "Uncut Skill Gems (ItemLevel <= 19)",
        hideRule: false,
        enabled: true,
        conditions: {
          baseTypes: ["Uncut Skill Gem"],
          itemLevelRange: { max: 19 },
        },
        colorSettings: {
          textColor: "rgba(20,240,240,1)",
          borderColor: "rgba(20,240,240,1)",
          fontSize: 35,
        },
        alertSound: { id: 2, duration: 300 },
      },
      // Additional gem rules...
    ],
  },
  {
    categoryId: "advanced",
    categoryName: "Advanced / Hide Rules",
    description: "More advanced conditions, often used to hide low-level trash or flasks above certain AreaLevels.",
    rules: [
      {
        id: 50,
        name: "Hide Flasks Above AreaLevel 70 (Rarity <= Magic)",
        hideRule: true,
        enabled: true,
        conditions: {
          class: "Flasks",
          areaLevelRange: { min: 71 },
          rarityMax: "Magic",
        },
      },
      // Additional hide rules...
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

  // If it's a Hide rule or Show rule
  html += `<p style="margin-top:5px;color:${rule.hideRule ? 'red':'lime'};">${rule.hideRule ? 'HIDE Rule' : 'SHOW Rule'}</p>`;

  // Potential advanced conditions
  html += `
    <p style="font-style: italic; margin:6px 0;">
      <strong>Advanced fields:</strong> 
      <br/>- <em>ItemLevel</em>: an item's internal level requirement
      <br/>- <em>AreaLevel</em>: the zone level you're currently in
      <br/>- <em>StackSize</em>: for stackable currency
      <br/>- <em>BaseType</em>: exact item names (e.g. "Gold", "Chaos Orb")
      <br/>- <em>Class</em>: item category (e.g. "Crossbows", "Flasks")
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
        <input type="number" id="alertDuration-${categoryId}-${rule.id}" value="${rule.alertSound.duration}" min="50" max="1000" />
      </label>
    `;
  }

  // We won't show sub-type pickers here, because each rule is already specific 
  // to a class or baseType. If you want sub-lists, you can expand on it.

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
        // multiple classes can be space-split or single
        const classes = c.class.split(" ").map(cl => `"${cl}"`).join(" ");
        ruleBlock += `  Class ${classes}\n`;
      }
      // BaseTypes
      if (c.baseTypes) {
        const baseStr = c.baseTypes.map(b => `"${b}"`).join(" ");
        ruleBlock += `  BaseType ${baseStr}\n`;
      }
      // AreaLevel
      if (c.areaLevelRange) {
        const { min, max } = c.areaLevelRange;
        // We'll just interpret "min" with ">=" and "max" with "<="
        if (min !== undefined) ruleBlock += `  AreaLevel >= ${min}\n`;
        if (max !== undefined) ruleBlock += `  AreaLevel <= ${max}\n`;
      }
      // StackSize
      if (c.stackSizeRange) {
        const { min, max } = c.stackSizeRange;
        if (min !== undefined) ruleBlock += `  StackSize >= ${min}\n`;
        if (max !== undefined) ruleBlock += `  StackSize <= ${max}\n`;
      }
      // ItemLevel
      if (c.itemLevelRange) {
        const { min, max } = c.itemLevelRange;
        if (min !== undefined) ruleBlock += `  ItemLevel >= ${min}\n`;
        if (max !== undefined) ruleBlock += `  ItemLevel <= ${max}\n`;
      }
      // Quality, Sockets, DropLevel, etc. can be added similarly

      // Colors, fonts, sounds
      if (rule.colorSettings) {
        const textVal = document.getElementById(`textColor-${cat.categoryId}-${rule.id}`)?.value;
        const borderVal = document.getElementById(`borderColor-${cat.categoryId}-${rule.id}`)?.value;
        const bgVal = document.getElementById(`bgColor-${cat.categoryId}-${rule.id}`)?.value;
        const fontVal = document.getElementById(`fontSize-${cat.categoryId}-${rule.id}`)?.value;

        if (textVal) ruleBlock += `  SetTextColor ${hexToRGB(textVal)}\n`;
        if (borderVal) ruleBlock += `  SetBorderColor ${hexToRGB(borderVal)}\n`;
        if (bgVal && bgVal.toLowerCase()!=='#ffffff') {
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
