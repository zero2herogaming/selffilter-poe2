/***************************************************************
 * 1. HELPER FUNCTIONS
 ***************************************************************/
function rgbaToHex(rgba) {
  if (!rgba) return "#ffffff";
  const match = rgba.match(/\d+/g);
  if (!match) return "#ffffff";
  const [r, g, b] = match;
  return `#${[r, g, b].map(x => parseInt(x).toString(16).padStart(2, "0")).join("")}`;
}

function hexToRGB(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b} 255`;
}

/***************************************************************
 * 2. CATEGORIES WITH RULES
 * Example demonstration. You can add more sub-rules as needed.
 * Each rule has "showOrHide" that user can choose at runtime 
 * (Show or Hide).
 ***************************************************************/
const CATEGORIES = [
  {
    categoryId: "weapons-onehand",
    categoryName: "Weapons: One-Handed",
    description: "Claws, Daggers, Wands, One Hand Swords, One Hand Axes, One Hand Maces, Sceptres, Spears, Flails.",
    rules: [
      {
        id: 1,
        name: "One Hand Swords",
        enabled: true,
        showOrHide: "Show", // default
        // advanced conditions, user can override in UI
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
        name: "Daggers",
        enabled: false,
        showOrHide: "Show",
        conditions: {
          class: "Daggers",
        },
      },
      // Add more for Claws, Wands, Axes, Maces, etc.
    ],
  },
  {
    categoryId: "weapons-twohand",
    categoryName: "Weapons: Two-Handed",
    description: "Bows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces, Quarterstaves, Crossbows, etc.",
    rules: [
      {
        id: 10,
        name: "Two Hand Swords",
        enabled: true,
        showOrHide: "Show",
        conditions: {
          class: "Two Hand Swords",
        },
      },
      {
        id: 11,
        name: "Crossbows",
        enabled: true,
        showOrHide: "Hide",
        conditions: {
          class: "Crossbows",
        },
      },
      // etc.
    ],
  },
  {
    categoryId: "gems",
    categoryName: "Gems",
    description: "Skill Gems, Support Gems, Spirit Gems, etc.",
    rules: [
      {
        id: 20,
        name: "Skill Gems",
        enabled: true,
        showOrHide: "Show",
        conditions: {
          baseTypes: ["Skill Gem"],
        },
      },
      {
        id: 21,
        name: "Support Gems",
        enabled: false,
        showOrHide: "Show",
        conditions: {
          baseTypes: ["Support Gem"],
        },
      },
      {
        id: 22,
        name: "Spirit Gems",
        enabled: true,
        showOrHide: "Show",
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
        id: 30,
        name: "Helmets",
        enabled: true,
        showOrHide: "Show",
        conditions: {
          class: "Helmets",
        },
      },
      {
        id: 31,
        name: "Body Armours",
        enabled: true,
        showOrHide: "Show",
        conditions: {
          class: "Body Armours",
        },
      },
    ],
  },
  {
    categoryId: "currency",
    categoryName: "Currency",
    description: "Stackable Currency, Distilled Emotions, Essences, Splinters, Catalysts, etc.",
    rules: [
      {
        id: 40,
        name: "Gold & Chaos (Stackable)",
        enabled: true,
        showOrHide: "Show",
        conditions: {
          class: "Stackable Currency",
        },
      },
      {
        id: 41,
        name: "Catalysts",
        enabled: false,
        showOrHide: "Show",
        conditions: {
          baseTypes: ["Catalyst"],
        },
      },
    ],
  },
];

/***************************************************************
 * 3. CREATE TABS + CREATE CATEGORY SECTIONS
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

  CATEGORIES.forEach((cat, index) => {
    const section = document.createElement("div");
    section.classList.add("category-section");
    if (index === 0) section.classList.add("active");

    const heading = document.createElement("h2");
    heading.innerText = cat.categoryName;
    section.appendChild(heading);

    const desc = document.createElement("p");
    desc.innerText = cat.description;
    section.appendChild(desc);

    cat.rules.forEach(rule => {
      const ruleEl = createRuleHTML(cat.categoryId, rule);
      section.appendChild(ruleEl);
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
 * 4. BUILD THE RULE UI
 * Here we add:
 *  - "Enable" checkbox
 *  - "Show/Hide" dropdown
 *  - Rarity dropdown
 *  - min/max for AreaLevel, ItemLevel, StackSize
 *  - optional color & sound picks
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
    <!-- Enable checkbox -->
    <label>
      <input type="checkbox" id="enable-${categoryId}-${rule.id}" ${rule.enabled ? "checked" : ""} />
      Enable
    </label>

    <!-- Show/Hide dropdown -->
    <label>
      Action:
      <select id="showOrHide-${categoryId}-${rule.id}">
        <option value="Show" ${rule.showOrHide==="Show" ? "selected" : ""}>Show</option>
        <option value="Hide" ${rule.showOrHide==="Hide" ? "selected" : ""}>Hide</option>
      </select>
    </label>

    <!-- Rarity dropdown -->
    <label>
      Rarity:
      <select id="rarity-${categoryId}-${rule.id}">
        <option value="">Any</option>
        <option value="Normal">Normal</option>
        <option value="Magic">Magic</option>
        <option value="Rare">Rare</option>
        <option value="Unique">Unique</option>
      </select>
    </label>

    <!-- AreaLevel -->
    <label>Min AreaLevel:
      <input type="number" id="minAreaLevel-${categoryId}-${rule.id}" value="" min="0" />
    </label>
    <label>Max AreaLevel:
      <input type="number" id="maxAreaLevel-${categoryId}-${rule.id}" value="" min="0" />
    </label>

    <!-- ItemLevel -->
    <label>Min ItemLevel:
      <input type="number" id="minItemLevel-${categoryId}-${rule.id}" value="" min="0" />
    </label>
    <label>Max ItemLevel:
      <input type="number" id="maxItemLevel-${categoryId}-${rule.id}" value="" min="0" />
    </label>

    <!-- StackSize -->
    <label>Min StackSize:
      <input type="number" id="minStackSize-${categoryId}-${rule.id}" value="" min="0" />
    </label>
    <label>Max StackSize:
      <input type="number" id="maxStackSize-${categoryId}-${rule.id}" value="" min="0" />
    </label>
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

  // Alert Sound (optional)
  html += `
    <label>Alert Sound:
      <select id="alertSound-${categoryId}-${rule.id}">
        <option value="">None</option>
        <option value="1">Alert 1</option>
        <option value="2">Alert 2</option>
        <option value="3">Alert 3</option>
        <option value="4">Alert 4</option>
        <option value="6">Alert 6</option>
        <option value="10">Alert 10</option>
      </select>
      Duration:
      <input type="number" id="alertDuration-${categoryId}-${rule.id}" value="300" min="50" max="1000"/>
    </label>
  `;

  container.innerHTML += html;
  return container;
}

/***************************************************************
 * 5. GENERATE THE FILTER CONTENT
 ***************************************************************/
function generateFilterContent() {
  let content = "";

  CATEGORIES.forEach(cat => {
    cat.rules.forEach(rule => {
      // If "enable" is not found or not checked, skip
      const enableBox = document.getElementById(`enable-${cat.categoryId}-${rule.id}`);
      if (!enableBox || !enableBox.checked) return;

      // "ShowOrHide" from the dropdown
      const showOrHideSel = document.getElementById(`showOrHide-${cat.categoryId}-${rule.id}`);
      const blockType = showOrHideSel.value;

      // Build the block
      let ruleBlock = `${blockType}\n`;

      // Rarity dropdown
      const rarityVal = document.getElementById(`rarity-${cat.categoryId}-${rule.id}`).value;
      if (rarityVal) {
        ruleBlock += `  Rarity ${rarityVal}\n`;
      }

      // AreaLevel
      const minAL = parseInt(document.getElementById(`minAreaLevel-${cat.categoryId}-${rule.id}`).value || 0, 10);
      const maxAL = parseInt(document.getElementById(`maxAreaLevel-${cat.categoryId}-${rule.id}`).value || 0, 10);
      if (minAL > 0) {
        ruleBlock += `  AreaLevel >= ${minAL}\n`;
      }
      if (maxAL > 0 && maxAL >= minAL) {
        ruleBlock += `  AreaLevel <= ${maxAL}\n`;
      }

      // ItemLevel
      const minIL = parseInt(document.getElementById(`minItemLevel-${cat.categoryId}-${rule.id}`).value || 0, 10);
      const maxIL = parseInt(document.getElementById(`maxItemLevel-${cat.categoryId}-${rule.id}`).value || 0, 10);
      if (minIL > 0) {
        ruleBlock += `  ItemLevel >= ${minIL}\n`;
      }
      if (maxIL > 0 && maxIL >= minIL) {
        ruleBlock += `  ItemLevel <= ${maxIL}\n`;
      }

      // StackSize
      const minStack = parseInt(document.getElementById(`minStackSize-${cat.categoryId}-${rule.id}`).value || 0, 10);
      const maxStack = parseInt(document.getElementById(`maxStackSize-${cat.categoryId}-${rule.id}`).value || 0, 10);
      if (minStack > 0) {
        ruleBlock += `  StackSize >= ${minStack}\n`;
      }
      if (maxStack > 0 && maxStack >= minStack) {
        ruleBlock += `  StackSize <= ${maxStack}\n`;
      }

      // "class" from the rule (conditions.class)
      if (rule.conditions?.class) {
        // Could be multiple classes (space separated)
        const classes = rule.conditions.class.split(" ").map(cl => `"${cl}"`).join(" ");
        ruleBlock += `  Class ${classes}\n`;
      }
      // "baseTypes" from the rule
      if (rule.conditions?.baseTypes) {
        const btStr = rule.conditions.baseTypes.map(bt => `"${bt}"`).join(" ");
        ruleBlock += `  BaseType ${btStr}\n`;
      }

      // Colors
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

      // Alert Sound
      const aSound = document.getElementById(`alertSound-${cat.categoryId}-${rule.id}`).value;
      const aDur = document.getElementById(`alertDuration-${cat.categoryId}-${rule.id}`).value;
      if (aSound && aDur && aSound !== "") {
        ruleBlock += `  PlayAlertSound ${aSound} ${aDur}\n`;
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
  activateCategory(0); // first tab active
}

document.getElementById("filter-form").addEventListener("submit", function (e) {
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
