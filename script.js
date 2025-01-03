/***************************************************************
 * 1. HELPER FUNCTIONS
 ***************************************************************/
function rgbaToHex(rgba) {
  if (!rgba) return "#ffffff";
  const match = rgba.match(/\d+/g);
  if (!match) return "#ffffff";
  const [r, g, b] = match;
  return `#${[r, g, b].map((x) => parseInt(x).toString(16).padStart(2, "0")).join("")}`;
}

function hexToRGB(hex) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b} 255`;
}

/***************************************************************
 * 2. DEFINE CATEGORIES & ITEM TYPES
 * Example: "Two-Handed Weapons" -> Bows, Crossbows, Quarterstaves, etc.
 * For each itemType, specify if it's stackable (stackSize relevant) 
 * and if itemLevel is relevant (gear vs. currency).
 ***************************************************************/
const CATEGORIES = [
  {
    categoryId: "twohand",
    categoryName: "Two-Handed Weapons",
    description: "Bows, Staves, Quarterstaves, Crossbows, etc. Typically item-level relevant gear.",
    itemTypes: [
      {
        id: 1,
        name: "Bows",
        enabled: true,
        showOrHide: "Show",
        isStackable: false,
        usesItemLevel: true,
        colorSettings: {
          textColor: "rgba(255,255,255,1)",
          borderColor: "rgba(80,80,80,1)",
          backgroundColor: "rgba(0,0,0,0)",
          fontSize: 35,
        },
      },
      {
        id: 2,
        name: "Crossbows",
        enabled: false,
        showOrHide: "Hide",
        isStackable: false,
        usesItemLevel: true,
      },
      {
        id: 3,
        name: "Quarterstaves",
        enabled: true,
        showOrHide: "Show",
        isStackable: false,
        usesItemLevel: true,
      },
      // ... add staves, axes, etc. as needed ...
    ],
  },
  {
    categoryId: "currency",
    categoryName: "Currency",
    description: "Stackable or consumable items (like Orbs, Gold). StackSize is relevant.",
    itemTypes: [
      {
        id: 10,
        name: "Gold",
        enabled: true,
        showOrHide: "Show",
        isStackable: true,   // we show StackSize fields
        usesItemLevel: false, // typically currency doesn't use itemLevel
      },
      {
        id: 11,
        name: "Essences",
        enabled: false,
        showOrHide: "Show",
        isStackable: true,
        usesItemLevel: false,
      },
    ],
  },
  {
    categoryId: "gems",
    categoryName: "Gems",
    description: "Skill Gems, Support Gems, Spirit Gems. ItemLevel can matter sometimes.",
    itemTypes: [
      {
        id: 20,
        name: "Skill Gems",
        enabled: true,
        showOrHide: "Show",
        isStackable: false,
        usesItemLevel: true, // gem quality/level can matter
      },
      {
        id: 21,
        name: "Support Gems",
        enabled: false,
        showOrHide: "Show",
        isStackable: false,
        usesItemLevel: true,
      },
    ],
  },
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
  CATEGORIES.forEach((cat, catIndex) => {
    const section = document.createElement("div");
    section.classList.add("category-section");
    if (catIndex === 0) section.classList.add("active");

    const heading = document.createElement("h2");
    heading.innerText = cat.categoryName;
    section.appendChild(heading);

    const desc = document.createElement("p");
    desc.innerText = cat.description;
    section.appendChild(desc);

    // Now create a panel for each itemType
    cat.itemTypes.forEach((type) => {
      const typeDiv = createItemTypeHTML(cat.categoryId, type);
      section.appendChild(typeDiv);
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
 * 4. BUILD HTML FOR EACH ITEM TYPE
 *   - Enable/Disable
 *   - Show/Hide
 *   - Rarity Checkboxes (Normal, Magic, Rare, Unique)
 *   - Min/Max AreaLevel
 *   - If usesItemLevel, show Min/Max ItemLevel
 *   - If isStackable, show Min/Max StackSize
 *   - Optional color, sound
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
      <input type="checkbox" id="enable-${categoryId}-${item.id}" ${item.enabled ? "checked" : ""}/>
      Enable
    </label>

    <!-- Show/Hide dropdown -->
    <label>
      Action:
      <select id="showOrHide-${categoryId}-${item.id}">
        <option value="Show" ${item.showOrHide==="Show" ? "selected":""}>Show</option>
        <option value="Hide" ${item.showOrHide==="Hide" ? "selected":""}>Hide</option>
      </select>
    </label>

    <!-- Rarity Checkboxes (multiple selection) -->
    <label>Rarity:</label>
    <div style="margin-left: 20px;">
      <label><input type="checkbox" id="rarity-normal-${categoryId}-${item.id}" /> Normal</label>
      <label><input type="checkbox" id="rarity-magic-${categoryId}-${item.id}" /> Magic</label>
      <label><input type="checkbox" id="rarity-rare-${categoryId}-${item.id}" /> Rare</label>
      <label><input type="checkbox" id="rarity-unique-${categoryId}-${item.id}" /> Unique</label>
    </div>

    <!-- Min/Max AreaLevel always relevant for dropping items -->
    <label>Min AreaLevel:
      <input type="number" id="minAreaLevel-${categoryId}-${item.id}" value="" min="0"/>
    </label>
    <label>Max AreaLevel:
      <input type="number" id="maxAreaLevel-${categoryId}-${item.id}" value="" min="0"/>
    </label>
  `;

  // If item.usesItemLevel is true, show itemLevel inputs
  if (item.usesItemLevel) {
    html += `
      <label>Min ItemLevel:
        <input type="number" id="minItemLevel-${categoryId}-${item.id}" value="" min="0"/>
      </label>
      <label>Max ItemLevel:
        <input type="number" id="maxItemLevel-${categoryId}-${item.id}" value="" min="0"/>
      </label>
    `;
  }

  // If item.isStackable, show stackSize inputs
  if (item.isStackable) {
    html += `
      <label>Min StackSize:
        <input type="number" id="minStackSize-${categoryId}-${item.id}" value="" min="0"/>
      </label>
      <label>Max StackSize:
        <input type="number" id="maxStackSize-${categoryId}-${item.id}" value="" min="0"/>
      </label>
    `;
  }

  // Colors
  if (item.colorSettings) {
    const textC = rgbaToHex(item.colorSettings.textColor);
    const borderC = rgbaToHex(item.colorSettings.borderColor);
    const bgC = rgbaToHex(item.colorSettings.backgroundColor);
    const fs = item.colorSettings.fontSize || 35;

    html += `
      <label>Text Color:
        <input type="color" id="textColor-${categoryId}-${item.id}" value="${textC}"/>
      </label>
      <label>Border Color:
        <input type="color" id="borderColor-${categoryId}-${item.id}" value="${borderC}"/>
      </label>
      <label>Background Color:
        <input type="color" id="bgColor-${categoryId}-${item.id}" value="${bgC}"/>
      </label>
      <label>Font Size:
        <input type="number" id="fontSize-${categoryId}-${item.id}" value="${fs}" min="12" max="60"/>
      </label>
    `;
  } else {
    // optionally let user pick color anyway
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
  }

  // Alert Sound
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
 * 5. GENERATE FILTER LOGIC
 ***************************************************************/
function generateFilterContent() {
  let content = "";

  CATEGORIES.forEach((cat) => {
    cat.itemTypes.forEach((type) => {
      // Check if enabled
      const enableBox = document.getElementById(`enable-${cat.categoryId}-${type.id}`);
      if (!enableBox || !enableBox.checked) return;

      // Show or Hide
      const showOrHide = document.getElementById(`showOrHide-${cat.categoryId}-${type.id}`).value;
      let ruleBlock = `${showOrHide}\n`;

      // Rarity Checkboxes
      const normalCk = document.getElementById(`rarity-normal-${cat.categoryId}-${type.id}`).checked;
      const magicCk  = document.getElementById(`rarity-magic-${cat.categoryId}-${type.id}`).checked;
      const rareCk   = document.getElementById(`rarity-rare-${cat.categoryId}-${type.id}`).checked;
      const uniqCk   = document.getElementById(`rarity-unique-${cat.categoryId}-${type.id}`).checked;

      // We might compile them into something like "Rarity = Normal Rare Unique"
      let rarities = [];
      if (normalCk) rarities.push("Normal");
      if (magicCk)  rarities.push("Magic");
      if (rareCk)   rarities.push("Rare");
      if (uniqCk)   rarities.push("Unique");

      if (rarities.length > 0) {
        // If we want an OR condition, it's typically "Rarity = X Y Z" in PoE filters
        // But PoE syntax is "Rarity Rare" vs "Rarity = Rare"? Officially it's "Rarity Rare" 
        // for a single type. For multiple you do separate lines. 
        // For demonstration, we do "Rarity = Normal Rare Unique" 
        // or multiple "Rarity Normal" lines. Let's do a single line approach:
        ruleBlock += `  Rarity ${rarities.join(" ")}\n`;
      }

      // AreaLevel
      const minAL = parseInt(document.getElementById(`minAreaLevel-${cat.categoryId}-${type.id}`).value || 0, 10);
      const maxAL = parseInt(document.getElementById(`maxAreaLevel-${cat.categoryId}-${type.id}`).value || 0, 10);
      if (minAL > 0) ruleBlock += `  AreaLevel >= ${minAL}\n`;
      if (maxAL > 0 && maxAL >= minAL) ruleBlock += `  AreaLevel <= ${maxAL}\n`;

      // ItemLevel if usesItemLevel
      if (type.usesItemLevel) {
        const minIL = parseInt(document.getElementById(`minItemLevel-${cat.categoryId}-${type.id}`).value || 0, 10);
        const maxIL = parseInt(document.getElementById(`maxItemLevel-${cat.categoryId}-${type.id}`).value || 0, 10);
        if (minIL > 0) ruleBlock += `  ItemLevel >= ${minIL}\n`;
        if (maxIL > 0 && maxIL >= minIL) ruleBlock += `  ItemLevel <= ${maxIL}\n`;
      }

      // StackSize if isStackable
      if (type.isStackable) {
        const minStack = parseInt(document.getElementById(`minStackSize-${cat.categoryId}-${type.id}`).value || 0, 10);
        const maxStack = parseInt(document.getElementById(`maxStackSize-${cat.categoryId}-${type.id}`).value || 0, 10);
        if (minStack > 0) ruleBlock += `  StackSize >= ${minStack}\n`;
        if (maxStack > 0 && maxStack >= minStack) ruleBlock += `  StackSize <= ${maxStack}\n`;
      }

      // Class or BaseType
      // Typically if "Bows" we do Class "Bow". 
      // For demonstration we might do:
      if (!type.isStackable) {
        // gear-based items might use "Class"
        ruleBlock += `  Class "${type.name}"\n`;
      } else {
        // stackable might be BaseType "Gold" or "Essence"
        ruleBlock += `  BaseType "${type.name}"\n`;
      }

      // Colors
      const textVal = document.getElementById(`textColor-${cat.categoryId}-${type.id}`)?.value;
      const borderVal = document.getElementById(`borderColor-${cat.categoryId}-${type.id}`)?.value;
      const bgVal = document.getElementById(`bgColor-${cat.categoryId}-${type.id}`)?.value;
      const fontVal = document.getElementById(`fontSize-${cat.categoryId}-${type.id}`)?.value;

      if (textVal) ruleBlock += `  SetTextColor ${hexToRGB(textVal)}\n`;
      if (borderVal) ruleBlock += `  SetBorderColor ${hexToRGB(borderVal)}\n`;
      if (bgVal && bgVal.toLowerCase() !== "#ffffff") {
        ruleBlock += `  SetBackgroundColor ${hexToRGB(bgVal)}\n`;
      }
      if (fontVal) ruleBlock += `  SetFontSize ${fontVal}\n`;

      // Alert Sound
      const aSound = document.getElementById(`alertSound-${cat.categoryId}-${type.id}`)?.value || "";
      const aDur   = document.getElementById(`alertDuration-${cat.categoryId}-${type.id}`)?.value || "";
      if (aSound !== "") {
        ruleBlock += `  PlayAlertSound ${aSound} ${aDur}\n`;
      }

      ruleBlock += "\n";
      content += ruleBlock;
    });
  });

  return content;
}

/***************************************************************
 * 6. INIT
 ***************************************************************/
function init() {
  createTabs();
  createCategorySections();
  activateCategory(0); // Show first category by default
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
