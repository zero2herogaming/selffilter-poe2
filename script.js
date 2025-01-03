/***************************************************************
 * 1. HELPER FUNCTIONS
 ***************************************************************/
function rgbaToHex(rgba) {
  if (!rgba) return "#ffffff";
  const match = rgba.match(/\d+/g);
  if (!match) return "#ffffff";
  const [r, g, b] = match;
  return `#${[r, g, b]
    .map(x => parseInt(x).toString(16).padStart(2, "0"))
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
 * 2. COMPLETE CATEGORIES (ALL 10), NO PLACEHOLDERS
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
    categoryId: "weapons-onehand",
    categoryName: "One-Handed Weapons",
    description: "Claws, Daggers, Wands, One Hand Swords, One Hand Axes, One Hand Maces, Sceptres, Spears, Flails.",
    itemTypes: [
      { id: 10, name: "Claws",           showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 11, name: "Daggers",         showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 12, name: "Wands",           showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 13, name: "One Hand Swords", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 14, name: "One Hand Axes",   showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 15, name: "One Hand Maces",  showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 16, name: "Sceptres",        showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 17, name: "Spears",          showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 18, name: "Flails",          showOrHide: "Hide", enabled: false, isStackable: false, usesItemLevel: true }
    ]
  },
  {
    categoryId: "weapons-twohand",
    categoryName: "Two-Handed Weapons",
    description: "Bows, Staves, Quarterstaves, Crossbows, etc.",
    itemTypes: [
      { id: 20, name: "Bows",          showOrHide: "Show", enabled: true,  isStackable: false, usesItemLevel: true },
      { id: 21, name: "Staves",        showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 22, name: "Quarterstaves", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 23, name: "Crossbows",     showOrHide: "Hide", enabled: false, isStackable: false, usesItemLevel: true }
    ]
  },
  {
    categoryId: "weapons-offhand",
    categoryName: "Off-hand Items",
    description: "Quivers, Shields, Foci.",
    itemTypes: [
      { id: 30, name: "Quivers", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 31, name: "Shields", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 32, name: "Foci",    showOrHide: "Hide", enabled: false, isStackable: false, usesItemLevel: true }
    ]
  },
  {
    categoryId: "armour",
    categoryName: "Armour",
    description: "Gloves, Boots, Body Armours, Helmets.",
    itemTypes: [
      { id: 40, name: "Gloves",       showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 41, name: "Boots",        showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 42, name: "Body Armours", showOrHide: "Show", enabled: true,  isStackable: false, usesItemLevel: true },
      { id: 43, name: "Helmets",      showOrHide: "Show", enabled: true,  isStackable: false, usesItemLevel: true }
    ]
  },
  {
    categoryId: "jewellery",
    categoryName: "Jewellery",
    description: "Amulets, Rings, Belts.",
    itemTypes: [
      { id: 50, name: "Amulets", showOrHide: "Show", enabled: true,  isStackable: false, usesItemLevel: true },
      { id: 51, name: "Rings",   showOrHide: "Show", enabled: true,  isStackable: false, usesItemLevel: true },
      { id: 52, name: "Belts",   showOrHide: "Hide", enabled: false, isStackable: false, usesItemLevel: true }
    ]
  },
  {
    categoryId: "flasks",
    categoryName: "Flasks",
    description: "Flasks, Life Flasks, Mana Flasks, Charms.",
    itemTypes: [
      { id: 60, name: "Flasks",      showOrHide: "Show", enabled: true,  isStackable: false, usesItemLevel: true },
      { id: 61, name: "Life Flasks", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 62, name: "Mana Flasks", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id: 63, name: "Charms",      showOrHide: "Hide", enabled: false, isStackable: false, usesItemLevel: false }
    ]
  },
  {
    categoryId: "currency",
    categoryName: "Currency",
    description: "Stackable Currency, Distilled Emotions, Essence, Splinter, Catalysts.",
    itemTypes: [
      { id: 70, name: "Stackable Currency", showOrHide: "Show", enabled: true,  isStackable: true, usesItemLevel: false },
      { id: 71, name: "Distilled Emotions", showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id: 72, name: "Essence",            showOrHide: "Show", enabled: true,  isStackable: true, usesItemLevel: false },
      { id: 73, name: "Splinter",           showOrHide: "Hide", enabled: false, isStackable: true, usesItemLevel: false },
      { id: 74, name: "Catalysts",          showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false }
    ]
  },
  {
    categoryId: "waystones",
    categoryName: "Waystones",
    description: "Waystones, Map Fragments, Misc Map Items.",
    itemTypes: [
      { id: 80, name: "Waystones",     showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: false },
      { id: 81, name: "Map Fragments", showOrHide: "Show", enabled: false, isStackable: true,  usesItemLevel: false },
      { id: 82, name: "Misc Map Items",showOrHide: "Hide", enabled: false, isStackable: false, usesItemLevel: false }
    ]
  },
  {
    categoryId: "jewels",
    categoryName: "Jewels",
    description: "Generic Jewels (Abyss, Timeless, etc.).",
    itemTypes: [
      { id: 90, name: "Jewels", showOrHide: "Show", enabled: true, isStackable: false, usesItemLevel: true }
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
        <option value="Show" ${item.showOrHide==="Show" ? "selected":""}>Show</option>
        <option value="Hide" ${item.showOrHide==="Hide" ? "selected":""}>Hide</option>
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

  if (item.usesItemLevel) {
    html += `
      <label>ItemLevel =:
        <input type="number" id="itemLevel-${categoryId}-${item.id}" value="" min="0"/>
      </label>
    `;
  }

  if (item.isStackable) {
    html += `
      <label>StackSize >=:
        <input type="number" id="stackSize-${categoryId}-${item.id}" value="" min="0"/>
      </label>
    `;
  }

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
      if (!enableBox.checked) return;

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
      const areaOp = document.getElementById(`areaLevelOp-${cat.categoryId}-${item.id}`).value;
      const areaVal= parseInt(document.getElementById(`areaLevelVal-${cat.categoryId}-${item.id}`).value||0,10);
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
      const textC   = document.getElementById(`textColor-${cat.categoryId}-${item.id}`).value;
      const borderC = document.getElementById(`borderColor-${cat.categoryId}-${item.id}`).value;
      const bgC     = document.getElementById(`bgColor-${cat.categoryId}-${item.id}`).value;
      const fontC   = document.getElementById(`fontSize-${cat.categoryId}-${item.id}`).value;
      if (textC) {
        ruleBlock += `  SetTextColor ${hexToRGB(textC)}\n`;
      }
      if (borderC) {
        ruleBlock += `  SetBorderColor ${hexToRGB(borderC)}\n`;
      }
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
 * 6. ADVANCED PARSING: MATCH BLOCKS -> UI
 ***************************************************************/
function parseFilterText(rawText) {
  const text = rawText.trim();
  if (!text) {
    alert("No filter text found. Please paste your filter!");
    return;
  }

  // Split lines
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l=>l!=="");
  let blocks = [];
  let current = [];

  function pushBlock() {
    if (current.length>0) {
      blocks.push([...current]);
      current=[];
    }
  }

  // gather blocks
  lines.forEach(ln=>{
    if (ln.startsWith("Show")||ln.startsWith("Hide")) {
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

  for (let block of blocks) {
    const showOrHide=block[0].startsWith("Show") ? "Show":"Hide";
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
          linesDict.areaOp=tokens[1];
          linesDict.areaVal=parseInt(tokens[2],10);
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
        linesDict.alertSound=parts[0];
        if (parts[1]) linesDict.alertDur=parts[1];
      }
    }

    // try to find the matching item
    let foundCat=null;
    let foundItem=null;

    if (linesDict.baseName) {
      // find stackable
      for (let cat of CATEGORIES) {
        for (let it of cat.itemTypes) {
          if (it.isStackable && it.name===linesDict.baseName) {
            foundCat=cat;
            foundItem=it;
            break;
          }
        }
        if (foundItem) break;
      }
    } else if (linesDict.className) {
      // find non-stackable
      for (let cat of CATEGORIES) {
        for (let it of cat.itemTypes) {
          if (!it.isStackable && it.name===linesDict.className) {
            foundCat=cat;
            foundItem=it;
            break;
          }
        }
        if (foundItem) break;
      }
    }

    // if found => set UI
    if (foundCat && foundItem) {
      matchedCount++;
      document.getElementById(`enable-${foundCat.categoryId}-${foundItem.id}`).checked=true;
      document.getElementById(`showOrHide-${foundCat.categoryId}-${foundItem.id}`).value=linesDict.showOrHide;

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

      // parse colors -> hex
      if (linesDict.textColor) {
        const rgb=linesDict.textColor.split(" ").map(x=>parseInt(x,10));
        if (rgb.length>=3) {
          const cHex="#"+rgb.slice(0,3).map(x=> x.toString(16).padStart(2,"0")).join("");
          document.getElementById(`textColor-${foundCat.categoryId}-${foundItem.id}`).value=cHex;
        }
      }
      if (linesDict.borderColor) {
        const rgb=linesDict.borderColor.split(" ").map(x=>parseInt(x,10));
        if (rgb.length>=3) {
          const cHex="#"+rgb.slice(0,3).map(x=> x.toString(16).padStart(2,"0")).join("");
          document.getElementById(`borderColor-${foundCat.categoryId}-${foundItem.id}`).value=cHex;
        }
      }
      if (linesDict.bgColor) {
        const rgb=linesDict.bgColor.split(" ").map(x=>parseInt(x,10));
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
 * 7. INIT
 ***************************************************************/
function init() {
  createTabs();
  createCategorySections();
  activateCategory(0);

  // If there's a "Load Filter from Text" button
  const loadBtn = document.getElementById("load-filter-button");
  if (loadBtn) {
    loadBtn.addEventListener("click", () => {
      const raw = document.getElementById("filter-load-text")?.value || "";
      parseFilterText(raw);
    });
  }
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
