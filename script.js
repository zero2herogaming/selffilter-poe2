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
 * 2. CATEGORIES & ITEMTYPES (Streamlined)
 *  (Example truncated version—fill in all sub-items as needed)
 ***************************************************************/
const CATEGORIES = [
  {
    categoryId: "gems",
    categoryName: "Gems",
    description: "Skill Gems, Support Gems, Spirit Gems.",
    itemTypes: [
      { id: 1, name: "Skill Gems", showOrHide: "Show", enabled: true, isStackable: false, usesItemLevel: true },
      { id: 2, name: "Support Gems", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 3, name: "Spirit Gems", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
    ],
  },
  // ... e.g. weapons-onehand, weapons-twohand, etc. ...
  // ... fill in the rest of your categories here ...
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
 * 4. BUILD UI FOR EACH ITEM TYPE
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
    <label>
      <input type="checkbox" id="enable-${categoryId}-${item.id}" ${item.enabled?"checked":""}/>
      Enable
    </label>
    <label>
      Action:
      <select id="showOrHide-${categoryId}-${item.id}">
        <option value="Show" ${item.showOrHide==="Show"?"selected":""}>Show</option>
        <option value="Hide" ${item.showOrHide==="Hide"?"selected":""}>Hide</option>
      </select>
    </label>

    <!-- Rarity checkboxes -->
    <label>Rarity:</label>
    <div style="margin-left: 20px;">
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

  // If item.usesItemLevel => user can put "ItemLevel = X"
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

  // A single operator/number for AreaLevel (like >= 65)
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
  `;

  // Colors & Sound
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
 * 5. GENERATE THE FINAL FILTER
 ***************************************************************/
function generateFilterContent() {
  let content = "";
  CATEGORIES.forEach((cat) => {
    cat.itemTypes.forEach((item) => {
      // If not enabled, skip
      const enableBox = document.getElementById(`enable-${cat.categoryId}-${item.id}`);
      if (!enableBox.checked) return;

      const showOrHideSel = document.getElementById(`showOrHide-${cat.categoryId}-${item.id}`).value;
      let ruleBlock = `${showOrHideSel}\n`;

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

      // Sockets > x
      const sockVal = parseInt(document.getElementById(`sockets-${cat.categoryId}-${item.id}`).value || 0, 10);
      if (sockVal > 0) {
        ruleBlock += `  Sockets > ${sockVal}\n`;
      }

      // Quality > x
      const qualVal = parseInt(document.getElementById(`quality-${cat.categoryId}-${item.id}`).value || 0, 10);
      if (qualVal > 0) {
        ruleBlock += `  Quality > ${qualVal}\n`;
      }

      // ItemLevel = x if usesItemLevel
      if (item.usesItemLevel) {
        const ilvlVal = parseInt(document.getElementById(`itemLevel-${cat.categoryId}-${item.id}`).value || 0, 10);
        if (ilvlVal > 0) {
          ruleBlock += `  ItemLevel = ${ilvlVal}\n`;
        }
      }

      // StackSize >= x if stackable
      if (item.isStackable) {
        const stackVal = parseInt(document.getElementById(`stackSize-${cat.categoryId}-${item.id}`).value || 0, 10);
        if (stackVal > 0) {
          ruleBlock += `  StackSize >= ${stackVal}\n`;
        }
      }

      // AreaLevel
      const areaOp = document.getElementById(`areaLevelOp-${cat.categoryId}-${item.id}`).value;
      const areaVal = parseInt(document.getElementById(`areaLevelVal-${cat.categoryId}-${item.id}`).value || 0, 10);
      if (areaOp && areaVal > 0) {
        ruleBlock += `  AreaLevel ${areaOp} ${areaVal}\n`;
      }

      // Class or BaseType
      if (item.isStackable) {
        ruleBlock += `  BaseType "${item.name}"\n`;
      } else {
        ruleBlock += `  Class "${item.name}"\n`;
      }

      // Colors
      const textC = document.getElementById(`textColor-${cat.categoryId}-${item.id}`)?.value;
      const borderC = document.getElementById(`borderColor-${cat.categoryId}-${item.id}`)?.value;
      const bgC = document.getElementById(`bgColor-${cat.categoryId}-${item.id}`)?.value;
      const fontC = document.getElementById(`fontSize-${cat.categoryId}-${item.id}`)?.value;

      if (textC) ruleBlock += `  SetTextColor ${hexToRGB(textC)}\n`;
      if (borderC) ruleBlock += `  SetBorderColor ${hexToRGB(borderC)}\n`;
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
 * 6. NEW: PARSE A FILTER FROM TEXTAREA
 * We'll read the lines from the user-pasted filter, identify each
 * "Show" or "Hide" block, then set the UI accordingly if we find
 * a matching item type.
 ***************************************************************/
function parseFilterText(rawText) {
  // Split lines, trim
  const lines = rawText.split(/\r?\n/).map(l => l.trim());
  let currentBlock = [];
  let blocks = [];

  function saveBlock() {
    if (currentBlock.length > 0) {
      blocks.push([...currentBlock]);
      currentBlock = [];
    }
  }

  // Gather blocks by "Show" or "Hide" lines
  for (let line of lines) {
    if (line.startsWith("Show") || line.startsWith("Hide")) {
      // new block
      saveBlock();
      currentBlock.push(line);
    } else {
      currentBlock.push(line);
    }
  }
  saveBlock(); // save last

  // Now parse each block
  for (let block of blocks) {
    let showOrHide = block[0].startsWith("Show") ? "Show" : "Hide";

    // We'll store the lines in a dictionary
    let linesDict = {
      showOrHide,
      rarities: [],
      sockets: 0,
      quality: 0,
      itemLevel: 0,
      stackSize: 0,
      areaOp: "",
      areaVal: 0,
      className: "",
      baseName: "",
      textColor: "",
      borderColor: "",
      bgColor: "",
      fontSize: "",
      alertSound: "",
      alertDur: "300",
    };

    // parse lines
    for (let line of block.slice(1)) {
      if (line.startsWith("Rarity ")) {
        // e.g. "Rarity Normal Magic Rare"
        const parts = line.replace("Rarity ", "").split(" ");
        linesDict.rarities = parts;
      } else if (line.startsWith("Sockets > ")) {
        // e.g. "Sockets > 0"
        linesDict.sockets = parseInt(line.replace("Sockets > ", ""), 10);
      } else if (line.startsWith("Quality > ")) {
        linesDict.quality = parseInt(line.replace("Quality > ", ""), 10);
      } else if (line.startsWith("ItemLevel = ")) {
        linesDict.itemLevel = parseInt(line.replace("ItemLevel = ", ""), 10);
      } else if (line.startsWith("StackSize >=")) {
        // e.g. "StackSize >= 500"
        linesDict.stackSize = parseInt(line.replace("StackSize >=", ""), 10);
      } else if (line.startsWith("AreaLevel ")) {
        // e.g. "AreaLevel >= 65"
        // let's split: "AreaLevel >= 65"
        const tokens = line.split(" ");
        if (tokens.length === 3) {
          linesDict.areaOp = tokens[1];
          linesDict.areaVal = parseInt(tokens[2], 10);
        }
      } else if (line.startsWith("Class ")) {
        // e.g. Class "Bows"
        let name = line.replace('Class ', '').trim();
        name = name.replace(/"/g, ''); // remove quotes
        linesDict.className = name;
      } else if (line.startsWith("BaseType ")) {
        let name = line.replace('BaseType ', '').trim();
        name = name.replace(/"/g, '');
        linesDict.baseName = name;
      } else if (line.startsWith("SetTextColor ")) {
        // e.g. "SetTextColor 255 255 255 255"
        linesDict.textColor = line.replace("SetTextColor ", "").trim();
      } else if (line.startsWith("SetBorderColor ")) {
        linesDict.borderColor = line.replace("SetBorderColor ", "").trim();
      } else if (line.startsWith("SetBackgroundColor ")) {
        linesDict.bgColor = line.replace("SetBackgroundColor ", "").trim();
      } else if (line.startsWith("SetFontSize ")) {
        linesDict.fontSize = line.replace("SetFontSize ", "").trim();
      } else if (line.startsWith("PlayAlertSound ")) {
        // e.g. "PlayAlertSound 2 300"
        const tokens = line.replace("PlayAlertSound ", "").split(" ");
        linesDict.alertSound = tokens[0];
        if (tokens[1]) {
          linesDict.alertDur = tokens[1];
        }
      }
    }

    // Now find the matching item in CATEGORIES
    // If we have baseName => item isStackable
    // If we have className => item is not stackable
    let found = null;
    if (linesDict.baseName) {
      // searching among items where isStackable=true and name == baseName
      for (let cat of CATEGORIES) {
        for (let it of cat.itemTypes) {
          if (it.isStackable && it.name === linesDict.baseName) {
            found = { catId: cat.categoryId, itemId: it.id };
            break;
          }
        }
        if (found) break;
      }
    } else if (linesDict.className) {
      // searching among items where isStackable=false and name == className
      for (let cat of CATEGORIES) {
        for (let it of cat.itemTypes) {
          if (!it.isStackable && it.name === linesDict.className) {
            found = { catId: cat.categoryId, itemId: it.id };
            break;
          }
        }
        if (found) break;
      }
    }

    // If found, set UI
    if (found) {
      // enable
      document.getElementById(`enable-${found.catId}-${found.itemId}`).checked = true;
      document.getElementById(`showOrHide-${found.catId}-${found.itemId}`).value = linesDict.showOrHide;

      // rarities
      if (linesDict.rarities.includes("Normal")) {
        document.getElementById(`rarity-normal-${found.catId}-${found.itemId}`).checked = true;
      }
      if (linesDict.rarities.includes("Magic")) {
        document.getElementById(`rarity-magic-${found.catId}-${found.itemId}`).checked = true;
      }
      if (linesDict.rarities.includes("Rare")) {
        document.getElementById(`rarity-rare-${found.catId}-${found.itemId}`).checked = true;
      }
      if (linesDict.rarities.includes("Unique")) {
        document.getElementById(`rarity-unique-${found.catId}-${found.itemId}`).checked = true;
      }

      if (linesDict.sockets>0) {
        document.getElementById(`sockets-${found.catId}-${found.itemId}`).value = linesDict.sockets;
      }
      if (linesDict.quality>0) {
        document.getElementById(`quality-${found.catId}-${found.itemId}`).value = linesDict.quality;
      }
      if (linesDict.itemLevel>0) {
        // itemLevel
        let el = document.getElementById(`itemLevel-${found.catId}-${found.itemId}`);
        if (el) el.value = linesDict.itemLevel;
      }
      if (linesDict.stackSize>0) {
        let stEl = document.getElementById(`stackSize-${found.catId}-${found.itemId}`);
        if (stEl) stEl.value = linesDict.stackSize;
      }
      if (linesDict.areaOp && linesDict.areaVal>0) {
        document.getElementById(`areaLevelOp-${found.catId}-${found.itemId}`).value = linesDict.areaOp;
        document.getElementById(`areaLevelVal-${found.catId}-${found.itemId}`).value = linesDict.areaVal;
      }

      // parse colors to hex
      if (linesDict.textColor) {
        let rgb = linesDict.textColor.split(" ").map(x=> parseInt(x,10));
        // expecting e.g. [255,255,255,255]
        if (rgb.length>=3) {
          const colorHex = "#"+rgb.slice(0,3).map(x=> x.toString(16).padStart(2,"0")).join("");
          document.getElementById(`textColor-${found.catId}-${found.itemId}`).value = colorHex;
        }
      }
      if (linesDict.borderColor) {
        let rgb = linesDict.borderColor.split(" ").map(x=> parseInt(x,10));
        if (rgb.length>=3) {
          const colorHex = "#"+rgb.slice(0,3).map(x=> x.toString(16).padStart(2,"0")).join("");
          document.getElementById(`borderColor-${found.catId}-${found.itemId}`).value = colorHex;
        }
      }
      if (linesDict.bgColor) {
        let rgb = linesDict.bgColor.split(" ").map(x=> parseInt(x,10));
        if (rgb.length>=3) {
          const colorHex = "#"+rgb.slice(0,3).map(x=> x.toString(16).padStart(2,"0")).join("");
          document.getElementById(`bgColor-${found.catId}-${found.itemId}`).value = colorHex;
        }
      }
      if (linesDict.fontSize) {
        document.getElementById(`fontSize-${found.catId}-${found.itemId}`).value = linesDict.fontSize;
      }
      if (linesDict.alertSound) {
        document.getElementById(`alertSound-${found.catId}-${found.itemId}`).value = linesDict.alertSound;
        document.getElementById(`alertDuration-${found.catId}-${found.itemId}`).value = linesDict.alertDur;
      }
    }
  }
}

/***************************************************************
 * 7. INIT & EVENT LISTENERS
 ***************************************************************/
function init() {
  createTabs();
  createCategorySections();
  activateCategory(0);

  // "Load Filter" button
  const loadBtn = document.getElementById("load-filter-button");
  loadBtn.addEventListener("click", () => {
    const text = document.getElementById("filter-load-text").value;
    parseFilterText(text);
    alert("Filter loaded. Check the tabs and tweak as desired!");
  });
}

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
