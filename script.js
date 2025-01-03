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
 * 2. BASE CATEGORIES & ITEMS
 *    We'll create a new final category for "Unrecognized Lines"
 *    so we can place leftover lines into the UI as well.
 ***************************************************************/
let CATEGORIES = [
  {
    categoryId: "gems",
    categoryName: "Gems",
    description: "Skill Gems, Support Gems, Spirit Gems, Timeless, Relics, etc.",
    itemTypes: [
      { id:1,  name: "Uncut Spirit Gem",   showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:2,  name: "Uncut Support Gem",  showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:3,  name: "Uncut Skill Gem",    showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:4,  name: "Soul Core",          showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: false },
      { id:5,  name: "Timeless",           showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: false },
      { id:6,  name: "Relic",              showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: false }
    ]
  },
  {
    categoryId: "weapons-onehand",
    categoryName: "One-Handed Weapons",
    description: "Claws, Daggers, Wands, Swords, Axes, Maces, Sceptres, Flails, Spears, etc.",
    itemTypes: [
      { id:10, name: "Claws",           showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:11, name: "Daggers",         showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:12, name: "Wands",           showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:13, name: "One Hand Swords", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:14, name: "One Hand Axes",   showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:15, name: "One Hand Maces",  showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:16, name: "Sceptres",        showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:17, name: "Spears",          showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:18, name: "Flails",          showOrHide: "Hide", enabled: false, isStackable: false, usesItemLevel: true },
      // Additional references:
      { id:19, name: "Attuned Wand",    showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:20, name: "Siphoning Wand",  showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:21, name: "Spiked Club",     showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true }
    ]
  },
  {
    categoryId: "weapons-twohand",
    categoryName: "Two-Handed Weapons",
    description: "Bows, Staves, Quarterstaves, Crossbows, Quarter, Staff, etc.",
    itemTypes: [
      { id:30, name: "Bows",              showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:31, name: "Staves",            showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:32, name: "Quarterstaves",     showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:33, name: "Crossbows",         showOrHide: "Hide", enabled: false, isStackable: false, usesItemLevel: true },
      { id:34, name: "Crude Bow",         showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:35, name: "Long Quarterstaff", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true }
    ]
  },
  {
    categoryId: "weapons-offhand",
    categoryName: "Off-hand Items",
    description: "Shields, Quivers, Foci, etc.",
    itemTypes: [
      { id:40, name: "Quivers", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:41, name: "Shields", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:42, name: "Foci",    showOrHide: "Hide", enabled: false, isStackable: false, usesItemLevel: true }
    ]
  },
  {
    categoryId: "armour",
    categoryName: "Armour",
    description: "Body Armours, Helmets, Boots, Gloves, etc.",
    itemTypes: [
      { id:50, name: "Gloves",       showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:51, name: "Boots",        showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:52, name: "Body Armours", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:53, name: "Helmets",      showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      // Additional references from new scripts:
      { id:54, name: "Armoured Cap",     showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:55, name: "Furtive Wraps",    showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:56, name: "Smuggler Coat",    showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:57, name: "Wrapped Greathelm",showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false }
    ]
  },
  {
    categoryId: "jewellery",
    categoryName: "Jewellery",
    description: "Rings, Amulets, Belts, etc.",
    itemTypes: [
      { id:60, name: "Rings",   showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:61, name: "Amulets", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:62, name: "Belts",   showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      // Additional from new scripts
      { id:63, name: "Heavy Belt",    showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:64, name: "Ornate Belt",   showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:65, name: "Utility Belt",  showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:66, name: "Grand Regalia", showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false }
    ]
  },
  {
    categoryId: "flasks",
    categoryName: "Flasks",
    description: "Flasks, Life, Mana, etc.",
    itemTypes: [
      { id:70, name: "Flasks",      showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:71, name: "Life Flasks", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:72, name: "Mana Flasks", showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:73, name: "Charms",      showOrHide: "Hide", enabled: false, isStackable: false, usesItemLevel: false },
      // Additional references
      { id:74, name: "Flask",       showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false }
    ]
  },
  {
    categoryId: "currency",
    categoryName: "Currency",
    description: "Mirror, Divine, Distilled, Splinters, Catalyst, etc.",
    itemTypes: [
      { id:80,  name: "Mirror",                showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:81,  name: "Divine",                showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:82,  name: "Perfect Jeweller's Orb",showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:83,  name: "Greater Jeweller's Orb",showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },

      { id:84,  name: "Distilled Isolation",   showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:85,  name: "Distilled Suffering",   showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:86,  name: "Distilled Fear",        showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:87,  name: "Distilled Despair",     showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:88,  name: "Distilled Disgust",     showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },

      { id:89,  name: "Catalyst",              showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:90,  name: "Essence of",            showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:91,  name: "Chaos Orb",             showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:92,  name: "Exotic",                showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:93,  name: "Exalted Orb",           showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:94,  name: "Vaal Orb",              showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:95,  name: "Gemcutter's Prism",     showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:96,  name: "Gold",                  showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },

      { id:97,  name: "Neural Catalyst",       showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:98,  name: "Adaptive Catalyst",     showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false }
    ]
  },
  {
    categoryId: "waystones",
    categoryName: "Waystones",
    description: "BaseType 'Waystone', controlling WaystoneTier logic.",
    itemTypes: [
      { id:110, name: "Waystone", showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false }
    ]
  },
  {
    categoryId: "jewels",
    categoryName: "Jewels",
    description: "Class 'Jewel', Timeless Jewel, runes, charms, etc.",
    itemTypes: [
      { id:120, name: "Jewel",            showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:121, name: " Rune",            showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: false },
      { id:122, name: " Charm",           showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: false },
      { id:123, name: "Timeless Jewel",   showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: false },
      { id:124, name: "Time-Lost Diamond",showOrHide: "Show", enabled: false, isStackable: true,  usesItemLevel: false }
    ]
  }
];

/***************************************************************
 * 2B. "UNRECOGNIZED LINES" CATEGORY
 *    We'll add this category at the end, which we'll dynamically
 *    populate with leftover lines as separate items.
 ***************************************************************/
let UNRECOGNIZED_CATEGORY = {
  categoryId: "unrecognized",
  categoryName: "Unrecognized Lines",
  description: "Lines from the filter that we couldn't parse or match. Enable them to include them raw in the final filter.",
  itemTypes: []
};

// We'll push it at the end of the array:
CATEGORIES.push(UNRECOGNIZED_CATEGORY);

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
      const itemEl = createItemTypeHTML(cat.categoryId, item);
      section.appendChild(itemEl);
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
 * 4. BUILD THE HTML FOR EACH ITEM TYPE
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
      <input type="checkbox" id="enable-${categoryId}-${item.id}" ${item.enabled?"checked":""}/>
      Enable
    </label>

    <label>
      Action:
      <select id="showOrHide-${categoryId}-${item.id}">
        <option value="Show" ${item.showOrHide==="Show" ? "selected":""}>Show</option>
        <option value="Hide" ${item.showOrHide==="Hide" ? "selected":""}>Hide</option>
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

    <!-- Sockets, Quality -->
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

    <!-- Colors & Font -->
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

    <!-- Alert Sound -->
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
 * 5. GENERATE THE FINAL .FILTER
 *    This now includes leftover lines from "Unrecognized Lines"
 ***************************************************************/
function generateFilterContent() {
  let content = "";
  
  CATEGORIES.forEach(cat => {
    cat.itemTypes.forEach(item => {
      const enableEl = document.getElementById(`enable-${cat.categoryId}-${item.id}`);
      if (!enableEl?.checked) return;

      // If this is an unrecognized leftover line => just dump the raw lines
      // We'll store them in item.rawLines if we created them that way.
      if (cat.categoryId === "unrecognized" && item.rawLines) {
        // We assume each leftover line belongs to a "Show" or "Hide" block
        content += item.rawLines.join("\n") + "\n\n";
        return;
      }

      // Otherwise, standard item logic
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

      // Sockets
      const sockVal = parseInt(document.getElementById(`sockets-${cat.categoryId}-${item.id}`).value||"0",10);
      if (sockVal>0) {
        ruleBlock += `  Sockets > ${sockVal}\n`;
      }

      // Quality
      const qualVal = parseInt(document.getElementById(`quality-${cat.categoryId}-${item.id}`).value||"0",10);
      if (qualVal>0) {
        ruleBlock += `  Quality > ${qualVal}\n`;
      }

      // ItemLevel
      if (item.usesItemLevel) {
        const iLvl = parseInt(document.getElementById(`itemLevel-${cat.categoryId}-${item.id}`).value||"0",10);
        if (iLvl>0) {
          ruleBlock += `  ItemLevel = ${iLvl}\n`;
        }
      }

      // StackSize
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
 * 6. PARSE FILTER TEXT (WITH UNRECOGNIZED LINES -> UI)
 ***************************************************************/
function parseFilterText(rawText) {
  const text = rawText.trim();
  if (!text) {
    alert("No filter text found. Please paste your filter!");
    return;
  }

  // We'll keep track of leftover lines as "unrecognized items"
  // We dynamically create them in the "unrecognized" category.
  // Reset that category's itemTypes each time we load a new filter.
  const unrecognizedCat = CATEGORIES.find(c => c.categoryId==="unrecognized");
  unrecognizedCat.itemTypes = [];

  // standard parse
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l=>l!=="");
  let blocks = [];
  let current = [];

  function pushBlock() {
    if (current.length>0) {
      blocks.push([...current]);
      current=[];
    }
  }

  lines.forEach(ln=>{
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
  let unmatchedCount=0;

  for (let block of blocks) {
    const showOrHide = block[0].startsWith("Show") ? "Show":"Hide";
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
      alertDur: "300"
    };

    // We'll parse recognized lines, store leftover lines if unrecognized
    let leftover = [];

    for (let line of block.slice(1)) {
      let recognized = false;
      if (line.startsWith("Rarity ")) {
        linesDict.rarities=line.replace("Rarity ","").split(" ");
        recognized = true;
      } else if (line.startsWith("Sockets > ")) {
        linesDict.sockets=parseInt(line.replace("Sockets > ",""),10);
        recognized = true;
      } else if (line.startsWith("Quality > ")) {
        linesDict.quality=parseInt(line.replace("Quality > ",""),10);
        recognized = true;
      } else if (line.startsWith("ItemLevel = ")) {
        linesDict.itemLevel=parseInt(line.replace("ItemLevel = ",""),10);
        recognized = true;
      } else if (line.startsWith("StackSize >=")) {
        linesDict.stackSize=parseInt(line.replace("StackSize >=",""),10);
        recognized = true;
      } else if (line.startsWith("AreaLevel ")) {
        const tokens=line.split(" ");
        if (tokens.length===3) {
          linesDict.areaOp=tokens[1];
          linesDict.areaVal=parseInt(tokens[2],10);
          recognized = true;
        }
      } else if (line.startsWith("Class ")) {
        let n=line.replace("Class ","").trim();
        linesDict.className=n.replace(/"/g,"");
        recognized = true;
      } else if (line.startsWith("BaseType ")) {
        let n=line.replace("BaseType ","").trim();
        linesDict.baseName=n.replace(/"/g,"");
        recognized = true;
      } else if (line.startsWith("SetTextColor ")) {
        linesDict.textColor=line.replace("SetTextColor ","").trim();
        recognized = true;
      } else if (line.startsWith("SetBorderColor ")) {
        linesDict.borderColor=line.replace("SetBorderColor ","").trim();
        recognized = true;
      } else if (line.startsWith("SetBackgroundColor ")) {
        linesDict.bgColor=line.replace("SetBackgroundColor ","").trim();
        recognized = true;
      } else if (line.startsWith("SetFontSize ")) {
        linesDict.fontSize=line.replace("SetFontSize ","").trim();
        recognized = true;
      } else if (line.startsWith("PlayAlertSound ")) {
        const parts=line.replace("PlayAlertSound ","").split(" ");
        linesDict.alertSound= parts[0];
        if (parts[1]) linesDict.alertDur= parts[1];
        recognized = true;
      } 
      // If not recognized, store it as leftover
      if (!recognized) leftover.push(line);
    }

    // Attempt match
    let foundCat = null;
    let foundItem = null;

    if (linesDict.baseName) {
      // isStackable
      for (let cat of CATEGORIES) {
        // skip unrecognized category
        if (cat.categoryId==="unrecognized") continue;

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
        if (cat.categoryId==="unrecognized") continue;

        for (let it of cat.itemTypes) {
          if (!it.isStackable && it.name===linesDict.className) {
            foundCat=cat; foundItem=it; break;
          }
        }
        if (foundItem) break;
      }
    }

    if (foundItem) {
      // we matched
      matchedCount++;
      document.getElementById(`enable-${foundCat.categoryId}-${foundItem.id}`).checked=true;
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

      // sockets, quality, iLvl, stackSize
      if (linesDict.sockets>0) {
        document.getElementById(`sockets-${foundCat.categoryId}-${foundItem.id}`).value= linesDict.sockets;
      }
      if (linesDict.quality>0) {
        document.getElementById(`quality-${foundCat.categoryId}-${foundItem.id}`).value= linesDict.quality;
      }
      if (foundItem.usesItemLevel && linesDict.itemLevel>0) {
        document.getElementById(`itemLevel-${foundCat.categoryId}-${foundItem.id}`).value= linesDict.itemLevel;
      }
      if (foundItem.isStackable && linesDict.stackSize>0) {
        document.getElementById(`stackSize-${foundCat.categoryId}-${foundItem.id}`).value= linesDict.stackSize;
      }
      if (linesDict.areaOp && linesDict.areaVal>0) {
        document.getElementById(`areaLevelOp-${foundCat.categoryId}-${foundItem.id}`).value= linesDict.areaOp;
        document.getElementById(`areaLevelVal-${foundCat.categoryId}-${foundItem.id}`).value= linesDict.areaVal;
      }

      // colors
      if (linesDict.textColor) {
        const rgb= linesDict.textColor.split(" ").map(x=> parseInt(x,10));
        if (rgb.length>=3) {
          const cHex="#"+rgb.slice(0,3).map(x=> x.toString(16).padStart(2,"0")).join("");
          document.getElementById(`textColor-${foundCat.categoryId}-${foundItem.id}`).value=cHex;
        }
      }
      if (linesDict.borderColor) {
        const rgb= linesDict.borderColor.split(" ").map(x=> parseInt(x,10));
        if (rgb.length>=3) {
          const cHex="#"+rgb.slice(0,3).map(x=> x.toString(16).padStart(2,"0")).join("");
          document.getElementById(`borderColor-${foundCat.categoryId}-${foundItem.id}`).value=cHex;
        }
      }
      if (linesDict.bgColor) {
        const rgb= linesDict.bgColor.split(" ").map(x=> parseInt(x,10));
        if (rgb.length>=3) {
          const cHex="#"+rgb.slice(0,3).map(x=> x.toString(16).padStart(2,"0")).join("");
          document.getElementById(`bgColor-${foundCat.categoryId}-${foundItem.id}`).value=cHex;
        }
      }
      if (linesDict.fontSize) {
        document.getElementById(`fontSize-${foundCat.categoryId}-${foundItem.id}`).value= linesDict.fontSize;
      }
      if (linesDict.alertSound) {
        document.getElementById(`alertSound-${foundCat.categoryId}-${foundItem.id}`).value= linesDict.alertSound;
        document.getElementById(`alertDuration-${foundCat.categoryId}-${foundItem.id}`).value= linesDict.alertDur;
      }

      // leftover lines => we move them to unrecognized category
      if (leftover.length>0) {
        leftover.forEach(line => {
          addUnrecognizedLine(line, showOrHide);
        });
      }

    } else {
      // entire block or partial block is unmatched
      unmatchedCount++;
      // We'll store the entire block in unrecognized category
      const rawLines = [block[0], ...leftover];
      addUnrecognizedBlock(rawLines);
    }
  }

  let msg = `Loaded filter with ${blocks.length} blocks total.\nMatched: ${matchedCount} blocks/items.`;
  if (unmatchedCount>0) {
    msg += `\nUnmatched blocks: ${unmatchedCount}. See 'Unrecognized Lines' category.`;
  }
  alert(msg);
  
  // Rebuild UI for unrecognized lines, so they appear now:
  rebuildUnrecognizedUI();
}

/***************************************************************
 * 6B. UTILS for "Unrecognized Lines"
 ***************************************************************/
/**
 * Adds a single leftover line to unrecognized category.
 * We'll store it as an item with an ID and rawLines=[the leftover].
 */
function addUnrecognizedLine(line, showOrHide="Show") {
  const cat = CATEGORIES.find(c=> c.categoryId==="unrecognized");
  const newId = Date.now() + Math.floor(Math.random()*10000);
  cat.itemTypes.push({
    id: newId,
    name: line,             // we'll display the leftover line
    showOrHide,            // from block
    enabled: false,        
    isStackable: false,    
    usesItemLevel: false,  
    rawLines: [ showOrHide, line ] // store them as a block
  });
}

/**
 * Adds an entire unmatched block (including the first line Show/Hide 
 * plus leftover lines) to unrecognized category as raw lines.
 */
function addUnrecognizedBlock(rawLines) {
  const cat = CATEGORIES.find(c=> c.categoryId==="unrecognized");
  const newId = Date.now() + Math.floor(Math.random()*10000);

  // The block has first line Show/Hide, then the rest
  const showOrHide = rawLines[0].startsWith("Show") ? "Show":"Hide";

  cat.itemTypes.push({
    id: newId,
    name: rawLines.join("\\n"), // for UI label, we can show them concatenated
    showOrHide,
    enabled: false,
    isStackable: false,
    usesItemLevel: false,
    rawLines
  });
}

/**
 * After we've added unrecognized lines, we must reconstruct
 * the "Unrecognized Lines" category UI.
 */
function rebuildUnrecognizedUI() {
  // Find the unrecognized category
  const catIndex = CATEGORIES.findIndex(c=> c.categoryId==="unrecognized");
  if (catIndex<0) return;

  const unrecognizedCat = CATEGORIES[catIndex];
  // find the existing category-section in the DOM
  const sections = document.querySelectorAll(".category-section");
  if (!sections[catIndex]) return;

  const section = sections[catIndex];
  // clear everything below the heading & desc
  while (section.children.length>2) {
    section.removeChild(section.lastChild);
  }

  // Rebuild
  unrecognizedCat.itemTypes.forEach(item => {
    const itemEl = createItemTypeHTML(unrecognizedCat.categoryId, item);
    section.appendChild(itemEl);
  });
}

/***************************************************************
 * 7. INIT
 ***************************************************************/
function init() {
  createTabs();
  createCategorySections();
  activateCategory(0);

  const loadBtn = document.getElementById("load-filter-button");
  if (loadBtn) {
    loadBtn.addEventListener("click", () => {
      const raw = document.getElementById("filter-load-text")?.value || "";
      parseFilterText(raw);
    });
  }
}

// Generate & download final filter
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
