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
 * 2. CATEGORIES & ITEM TYPES
 * Example with 2 or 3 categories for brevity, but you should
 * add all 10 categories (Gems, 1H Weapons, 2H Weapons, Off-hand,
 * Armour, Jewellery, Flasks, Currency, Waystones, Jewels).
 * Fill in the rest as needed, or copy from your final script.
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
        showOrHide: "Show",
        enabled: true,
        isStackable: false,
        usesItemLevel: true
      },
      {
        id: 2,
        name: "Support Gems",
        showOrHide: "Show",
        enabled: false,
        isStackable: false,
        usesItemLevel: true
      },
      {
        id: 3,
        name: "Spirit Gems",
        showOrHide: "Show",
        enabled: false,
        isStackable: false,
        usesItemLevel: true
      }
    ]
  },
  {
    categoryId: "currency",
    categoryName: "Currency",
    description: "Stackable items: Orbs, Splinters, etc.",
    itemTypes: [
      {
        id: 70,
        name: "Stackable Currency",
        showOrHide: "Show",
        enabled: true,
        isStackable: true,
        usesItemLevel: false
      },
      {
        id: 71,
        name: "Essence",
        showOrHide: "Show",
        enabled: false,
        isStackable: true,
        usesItemLevel: false
      }
    ]
  }
  // ... Add the rest of your categories here ...
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
  allSections.forEach((sec) => sec.classList.remove("active"));
  allButtons.forEach((btn) => btn.classList.remove("active"));
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
    <!-- Enable -->
    <label>
      <input type="checkbox" id="enable-${categoryId}-${item.id}" ${item.enabled ? "checked" : ""}/>
      Enable
    </label>

    <!-- Show/Hide -->
    <label>
      Action:
      <select id="showOrHide-${categoryId}-${item.id}">
        <option value="Show" ${item.showOrHide === "Show" ? "selected" : ""}>Show</option>
        <option value="Hide" ${item.showOrHide === "Hide" ? "selected" : ""}>Hide</option>
      </select>
    </label>

    <!-- Rarity -->
    <label>Rarity:</label>
    <div style="margin-left:20px;">
      <label><input type="checkbox" id="rarity-normal-${categoryId}-${item.id}"/> Normal</label>
      <label><input type="checkbox" id="rarity-magic-${categoryId}-${item.id}"/> Magic</label>
      <label><input type="checkbox" id="rarity-rare-${categoryId}-${item.id}"/> Rare</label>
      <label><input type="checkbox" id="rarity-unique-${categoryId}-${item.id}"/> Unique</label>
    </div>

    <!-- Sockets > X -->
    <label>Sockets >:
      <input type="number" id="sockets-${categoryId}-${item.id}" value="" min="0"/>
    </label>
    <!-- Quality > X -->
    <label>Quality >:
      <input type="number" id="quality-${categoryId}-${item.id}" value="" min="0"/>
    </label>
  `;

  // If item.usesItemLevel => "ItemLevel = X"
  if (item.usesItemLevel) {
    html += `
      <label>ItemLevel =:
        <input type="number" id="itemLevel-${categoryId}-${item.id}" value="" min="0"/>
      </label>
    `;
  }

  // If item.isStackable => "StackSize >= X"
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
      <input type="number" id="areaLevelVal-${categoryId}-${item.id}" min="0" value=""/>
    </label>

    <!-- Colors & alert -->
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

  CATEGORIES.forEach((cat) => {
    cat.itemTypes.forEach((item) => {
      // check if enabled
      const enableEl = document.getElementById(`enable-${cat.categoryId}-${item.id}`);
      if (!enableEl.checked) return;

      const showOrHideSel = document.getElementById(`showOrHide-${cat.categoryId}-${item.id}`).value;
      let ruleBlock = `${showOrHideSel}\n`;

      // Rarities
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

      // Sockets > X
      const sockVal = parseInt(document.getElementById(`sockets-${cat.categoryId}-${item.id}`).value||0,10);
      if (sockVal>0) {
        ruleBlock += `  Sockets > ${sockVal}\n`;
      }

      // Quality > X
      const qualVal = parseInt(document.getElementById(`quality-${cat.categoryId}-${item.id}`).value||0,10);
      if (qualVal>0) {
        ruleBlock += `  Quality > ${qualVal}\n`;
      }

      // ItemLevel = X
      if (item.usesItemLevel) {
        const iLvl = parseInt(document.getElementById(`itemLevel-${cat.categoryId}-${item.id}`).value||0,10);
        if (iLvl>0) {
          ruleBlock += `  ItemLevel = ${iLvl}\n`;
        }
      }

      // StackSize >= X
      if (item.isStackable) {
        const stVal = parseInt(document.getElementById(`stackSize-${cat.categoryId}-${item.id}`).value||0,10);
        if (stVal>0) {
          ruleBlock += `  StackSize >= ${stVal}\n`;
        }
      }

      // AreaLevel
      const areaOp  = document.getElementById(`areaLevelOp-${cat.categoryId}-${item.id}`).value;
      const areaVal = parseInt(document.getElementById(`areaLevelVal-${cat.categoryId}-${item.id}`).value||0,10);
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
      const borderC = document.getElementById(`borderColor-${cat.categoryId}-${item.id}`).value;
      const bgC = document.getElementById(`bgColor-${cat.categoryId}-${item.id}`).value;
      const fontC = document.getElementById(`fontSize-${cat.categoryId}-${item.id}`).value;

      if (textC) {
        ruleBlock += `  SetTextColor ${hexToRGB(textC)}\n`;
      }
      if (borderC) {
        ruleBlock += `  SetBorderColor ${hexToRGB(borderC)}\n`;
      }
      if (bgC && bgC.toLowerCase() !== "#ffffff") {
        ruleBlock += `  SetBackgroundColor ${hexToRGB(bgC)}\n`;
      }
      if (fontC) {
        ruleBlock += `  SetFontSize ${fontC}\n`;
      }

      // Alert Sound
      const aSound = document.getElementById(`alertSound-${cat.categoryId}-${item.id}`).value;
      const aDur   = document.getElementById(`alertDuration-${cat.categoryId}-${item.id}`).value;
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
 * 6. PARSE A FILTER FROM TEXTAREA (optional load feature)
 * If you have a "Load Filter from Text" button, you can define
 * a parse function here. We'll at least log or alert if no matches.
 ***************************************************************/
function parseFilterText(rawText) {
  if (!rawText.trim()) {
    alert("No filter text found. Please paste a filter and try again.");
    return;
  }

  // Example, just confirm there's at least one Show/Hide block
  const lines = rawText.split(/\r?\n/).map(l => l.trim());
  const showHideCount = lines.filter(line => line.startsWith("Show") || line.startsWith("Hide")).length;

  if (showHideCount === 0) {
    alert("No 'Show' or 'Hide' lines found. This filter may not match the expected format.");
    return;
  }

  // If you want a real parser, you'd do it here.
  // For now, just show success:
  alert(`Filter loaded with ${showHideCount} blocks found! (No advanced parsing here, just a demo.)`);
}

/***************************************************************
 * 7. INIT
 ***************************************************************/
function init() {
  createTabs();
  createCategorySections();
  activateCategory(0);

  // If you have a "Load Filter from Text" button, do:
  const loadBtn = document.getElementById("load-filter-button");
  if (loadBtn) {
    loadBtn.addEventListener("click", () => {
      const rawText = document.getElementById("filter-load-text")?.value || "";
      parseFilterText(rawText);
    });
  }
}

document.getElementById("filter-form").addEventListener("submit", function(e){
  e.preventDefault();
  const filterContent = generateFilterContent();
  const blob = new Blob([filterContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.getElementById("download-link");
  downloadLink.href = url;
  downloadLink.download = "my-custom-filter.filter";

  document.getElementById("download-section").style.display = "block";
});

window.addEventListener("DOMContentLoaded", init);
