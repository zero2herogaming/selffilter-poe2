/***************************************************************
 * 1. HELPER FUNCTIONS
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
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b} 255`;
}

/***************************************************************
 * 2. FULL CATEGORIES & SUB-ITEMS
 * These are the 10 categories you requested, each with sub-items.
 ***************************************************************/
const CATEGORIES = [
  {
    categoryId: "gems",
    categoryName: "Gems",
    description: "Skill Gems, Support Gems, Spirit Gems.",
    itemTypes: [
      {
        id: 1,
        name: "Skill Gems",
        enabled: true,
        showOrHide: "Show",
        isStackable: false,
        usesItemLevel: true,
      },
      {
        id: 2,
        name: "Support Gems",
        enabled: false,
        showOrHide: "Show",
        isStackable: false,
        usesItemLevel: true,
      },
      {
        id: 3,
        name: "Spirit Gems",
        enabled: false,
        showOrHide: "Show",
        isStackable: false,
        usesItemLevel: true,
      },
    ],
  },
  {
    categoryId: "weapons-onehand",
    categoryName: "One-Handed Weapons",
    description: "Claws, Daggers, Wands, One Hand Swords, One Hand Axes, One Hand Maces, Sceptres, Spears, Flails",
    itemTypes: [
      { id: 10, name: "Claws", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 11, name: "Daggers", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 12, name: "Wands", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 13, name: "One Hand Swords", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 14, name: "One Hand Axes", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 15, name: "One Hand Maces", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 16, name: "Sceptres", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 17, name: "Spears", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 18, name: "Flails", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
    ],
  },
  {
    categoryId: "weapons-twohand",
    categoryName: "Two-Handed Weapons",
    description: "Bows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces, Quarterstaves, Crossbows, Traps, Fishing Rods",
    itemTypes: [
      { id: 20, name: "Bows", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 21, name: "Staves", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 22, name: "Two Hand Swords", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 23, name: "Two Hand Axes", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 24, name: "Two Hand Maces", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 25, name: "Quarterstaves", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 26, name: "Crossbows", enabled: false, showOrHide: "Hide", isStackable: false, usesItemLevel: true },
      { id: 27, name: "Traps", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 28, name: "Fishing Rods", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
    ],
  },
  {
    categoryId: "weapons-offhand",
    categoryName: "Off-hand Items",
    description: "Quivers, Shields, Foci",
    itemTypes: [
      { id: 30, name: "Quivers", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 31, name: "Shields", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 32, name: "Foci", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
    ],
  },
  {
    categoryId: "armour",
    categoryName: "Armour",
    description: "Gloves, Boots, Body Armours, Helmets",
    itemTypes: [
      { id: 40, name: "Gloves", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 41, name: "Boots", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 42, name: "Body Armours", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 43, name: "Helmets", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
    ],
  },
  {
    categoryId: "jewellery",
    categoryName: "Jewellery",
    description: "Amulets, Rings, Belts",
    itemTypes: [
      { id: 50, name: "Amulets", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 51, name: "Rings", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 52, name: "Belts", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
    ],
  },
  {
    categoryId: "flasks",
    categoryName: "Flasks",
    description: "Flasks, Life Flasks, Mana Flasks, Charms",
    itemTypes: [
      { id: 60, name: "Flasks", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 61, name: "Life Flasks", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 62, name: "Mana Flasks", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
      { id: 63, name: "Charms", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: false },
    ],
  },
  {
    categoryId: "currency",
    categoryName: "Currency",
    description: "Stackable Currency, Distilled Emotions, Essence, Splinter, Catalysts",
    itemTypes: [
      { id: 70, name: "Stackable Currency", enabled: true, showOrHide: "Show", isStackable: true, usesItemLevel: false },
      { id: 71, name: "Distilled Emotions", enabled: false, showOrHide: "Show", isStackable: true, usesItemLevel: false },
      { id: 72, name: "Essence", enabled: false, showOrHide: "Show", isStackable: true, usesItemLevel: false },
      { id: 73, name: "Splinter", enabled: false, showOrHide: "Show", isStackable: true, usesItemLevel: false },
      { id: 74, name: "Catalysts", enabled: false, showOrHide: "Show", isStackable: true, usesItemLevel: false },
    ],
  },
  {
    categoryId: "waystones",
    categoryName: "Waystones",
    description: "Waystones, Map Fragments, Misc Map Items",
    itemTypes: [
      { id: 80, name: "Waystones", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: false },
      { id: 81, name: "Map Fragments", enabled: false, showOrHide: "Show", isStackable: true, usesItemLevel: false },
      { id: 82, name: "Misc Map Items", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: false },
    ],
  },
  {
    categoryId: "jewels",
    categoryName: "Jewels",
    description: "Generic Jewels (Abyss, Timeless, etc.)",
    itemTypes: [
      { id: 90, name: "Jewels", enabled: false, showOrHide: "Show", isStackable: false, usesItemLevel: true },
    ],
  },
];

/***************************************************************
 * 3. CREATE TABS AND CATEGORY SECTIONS
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
  allSections.forEach((sec) => sec.classList.remove("active"));
  allButtons.forEach((btn) => btn.classList.remove("active"));
  allSections[index].classList.add("active");
  allButtons[index].classList.add("active");
}

/***************************************************************
 * 4. BUILD THE HTML FOR EACH ITEM TYPE
 ***************************************************************/
function createItemTypeHTML(categoryId, item) {
  const container = document.createElement("div");
  container.classList.add("item-type");

  // Title
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("item-type-title");
  titleDiv.innerText = item.name;
  container.appendChild(titleDiv);

  let html = `
    <!-- Enable checkbox -->
    <label>
      <input type="checkbox" id="enable-${categoryId}-${item.id}" ${item.enabled?"checked":""}/>
      Enable
    </label>

    <!-- Show/Hide -->
    <label>
      Action:
      <select id="showOrHide-${categoryId}-${item.id}">
        <option value="Show" ${item.showOrHide==="Show"?"selected":""}>Show</option>
        <option value="Hide" ${item.showOrHide==="Hide"?"selected":""}>Hide</option>
      </select>
    </label>

    <!-- Rarity Checkboxes -->
    <label>Rarity:</label>
    <div style="margin-left: 20px;">
      <label><input type="checkbox" id="rarity-normal-${categoryId}-${item.id}"/> Normal</label>
      <label><input type="checkbox" id="rarity-magic-${categoryId}-${item.id}"/> Magic</label>
      <label><input type="checkbox" id="rarity-rare-${categoryId}-${item.id}"/> Rare</label>
      <label><input type="checkbox" id="rarity-unique-${categoryId}-${item.id}"/> Unique</label>
    </div>

    <!-- AreaLevel -->
    <label>Min AreaLevel:
      <input type="number" id="minAreaLevel-${categoryId}-${item.id}" min="0" value=""/>
    </label>
    <label>Max AreaLevel:
      <input type="number" id="maxAreaLevel-${categoryId}-${item.id}" min="0" value=""/>
    </label>
  `;

  // If usesItemLevel
  if (item.usesItemLevel) {
    html += `
      <label>Min ItemLevel:
        <input type="number" id="minItemLevel-${categoryId}-${item.id}" min="0" value=""/>
      </label>
      <label>Max ItemLevel:
        <input type="number" id="maxItemLevel-${categoryId}-${item.id}" min="0" value=""/>
      </label>
    `;
  }

  // If isStackable
  if (item.isStackable) {
    html += `
      <label>Min StackSize:
        <input type="number" id="minStackSize-${categoryId}-${item.id}" min="0" value=""/>
      </label>
      <label>Max StackSize:
        <input type="number" id="maxStackSize-${categoryId}-${item.id}" min="0" value=""/>
      </label>
    `;
  }

  // Colors
  // If you want default color settings, you can do so here
  html += `
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
  `;

  // Sound
  html += `
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
      Duration:
      <input type="number" id="alertDuration-${categoryId}-${item.id}" value="300" min="50" max="1000"/>
    </label>
  `;

  container.innerHTML += html;
  return container;
}

/***************************************************************
 * 5. GENERATE THE FINAL FILTER
 ***************************************************************/
function generateFilterContent() {
  let content = "";

  CATEGORIES.forEach((cat) => {
    cat.itemTypes.forEach((item) => {
      // Check if enabled
      const enableEl = document.getElementById(`enable-${cat.categoryId}-${item.id}`);
      if (!enableEl || !enableEl.checked) return;

      // Show or Hide
      const showOrHide = document.getElementById(`showOrHide-${cat.categoryId}-${item.id}`).value;
      let ruleBlock = `${showOrHide}\n`;

      // Rarity checkboxes
      const normalCk = document.getElementById(`rarity-normal-${cat.categoryId}-${item.id}`).checked;
      const magicCk  = document.getElementById(`rarity-magic-${cat.categoryId}-${item.id}`).checked;
      const rareCk   = document.getElementById(`rarity-rare-${cat.categoryId}-${item.id}`).checked;
      const uniqCk   = document.getElementById(`rarity-unique-${cat.categoryId}-${item.id}`).checked;

      let rarities = [];
      if (normalCk) rarities.push("Normal");
      if (magicCk)  rarities.push("Magic");
      if (rareCk)   rarities.push("Rare");
      if (uniqCk)   rarities.push("Unique");
      if (rarities.length > 0) {
        ruleBlock += `  Rarity ${rarities.join(" ")}\n`;
      }

      // AreaLevel
      const minAL = parseInt(document.getElementById(`minAreaLevel-${cat.categoryId}-${item.id}`).value || 0, 10);
      const maxAL = parseInt(document.getElementById(`maxAreaLevel-${cat.categoryId}-${item.id}`).value || 0, 10);
      if (minAL > 0) ruleBlock += `  AreaLevel >= ${minAL}\n`;
      if (maxAL > 0 && maxAL >= minAL) ruleBlock += `  AreaLevel <= ${maxAL}\n`;

      // ItemLevel if usesItemLevel
      if (item.usesItemLevel) {
        const minIL = parseInt(document.getElementById(`minItemLevel-${cat.categoryId}-${item.id}`).value || 0, 10);
        const maxIL = parseInt(document.getElementById(`maxItemLevel-${cat.categoryId}-${item.id}`).value || 0, 10);
        if (minIL > 0) ruleBlock += `  ItemLevel >= ${minIL}\n`;
        if (maxIL > 0 && maxIL >= minIL) ruleBlock += `  ItemLevel <= ${maxIL}\n`;
      }

      // StackSize if isStackable
      if (item.isStackable) {
        const minStack = parseInt(document.getElementById(`minStackSize-${cat.categoryId}-${item.id}`).value || 0, 10);
        const maxStack = parseInt(document.getElementById(`maxStackSize-${cat.categoryId}-${item.id}`).value || 0, 10);
        if (minStack > 0) ruleBlock += `  StackSize >= ${minStack}\n`;
        if (maxStack > 0 && maxStack >= minStack) ruleBlock += `  StackSize <= ${maxStack}\n`;
      }

      // Class or BaseType
      if (item.isStackable) {
        // For currency, do BaseType
        ruleBlock += `  BaseType "${item.name}"\n`;
      } else {
        // For gear-like items, do Class
        ruleBlock += `  Class "${item.name}"\n`;
      }

      // Colors
      const textVal   = document.getElementById(`textColor-${cat.categoryId}-${item.id}`)?.value;
      const borderVal = document.getElementById(`borderColor-${cat.categoryId}-${item.id}`)?.value;
      const bgVal     = document.getElementById(`bgColor-${cat.categoryId}-${item.id}`)?.value;
      const fontVal   = document.getElementById(`fontSize-${cat.categoryId}-${item.id}`)?.value;

      if (textVal) ruleBlock += `  SetTextColor ${hexToRGB(textVal)}\n`;
      if (borderVal) ruleBlock += `  SetBorderColor ${hexToRGB(borderVal)}\n`;
      if (bgVal && bgVal.toLowerCase() !== "#ffffff") {
        ruleBlock += `  SetBackgroundColor ${hexToRGB(bgVal)}\n`;
      }
      if (fontVal) ruleBlock += `  SetFontSize ${fontVal}\n`;

      // Alert Sound
      const aSound = document.getElementById(`alertSound-${cat.categoryId}-${item.id}`)?.value;
      const aDur   = document.getElementById(`alertDuration-${cat.categoryId}-${item.id}`)?.value;
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
 * 6. INIT & EVENT LISTENERS
 ***************************************************************/
function init() {
  createTabs();
  createCategorySections();
  activateCategory(0); // Show the first category by default
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
