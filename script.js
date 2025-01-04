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
 * 2. BASE CATEGORIES & ITEMS (10 + unrecognized)
 *    Adding "Breach Ring" specifically in Jewellery as sub-item.
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
    description: "Rings, Amulets, Belts, including a sub-section for Breach Rings.",
    itemTypes: [
      { id:60, name: "Rings",       showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:61, name: "Amulets",     showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },
      { id:62, name: "Belts",       showOrHide: "Show", enabled: false, isStackable: false, usesItemLevel: true },

      // Additional from new scripts
      { id:63, name: "Heavy Belt",    showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:64, name: "Ornate Belt",   showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:65, name: "Utility Belt",  showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },
      { id:66, name: "Grand Regalia", showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false },

      // new sub-item specifically for "Breach Ring"
      { id:67, name: "Breach Ring",   showOrHide: "Show", enabled: false, isStackable: true, usesItemLevel: false }
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

// A final "unrecognized" category for leftover lines
let UNRECOGNIZED_CATEGORY = {
  categoryId: "unrecognized",
  categoryName: "Unrecognized Lines",
  description: "Lines from the filter that we couldn’t parse. Enable them to include them raw in the final filter.",
  itemTypes: []
};
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

    // heading
    const heading = document.createElement("h2");
    heading.innerText = cat.categoryName;
    section.appendChild(heading);

    // desc
    const desc = document.createElement("p");
    desc.innerText = cat.description;
    section.appendChild(desc);

    // items
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
 *    We'll add a "Preview" box that updates as user changes 
 *    text color, border color, bg color, and font size.
 ***************************************************************/
function createItemTypeHTML(categoryId, item) {
  const container = document.createElement("div");
  container.classList.add("item-type");

  // Title
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("item-type-title");
  titleDiv.innerText = item.name;
  container.appendChild(titleDiv);

  // We'll add a "preview" div
  const previewDiv = document.createElement("div");
  previewDiv.classList.add("preview-box");
  previewDiv.innerText = "Preview";
  // default style
  previewDiv.style.color = "#ffffff";
  previewDiv.style.border = "1px solid #ffffff";
  previewDiv.style.backgroundColor = "#000000";
  previewDiv.style.fontSize = "35px";
  previewDiv.style.padding = "4px";
  previewDiv.style.marginBottom = "8px";
  container.appendChild(previewDiv);

  // We'll make an event handler that updates preview on each input
  function updatePreview() {
    const textC   = document.getElementById(`textColor-${categoryId}-${item.id}`).value;
    const borderC = document.getElementById(`borderColor-${categoryId}-${item.id}`).value;
    const bgC     = document.getElementById(`bgColor-${categoryId}-${item.id}`).value;
    const fontC   = document.getElementById(`fontSize-${categoryId}-${item.id}`).value;

    previewDiv.style.color = textC;
    previewDiv.style.border = `1px solid ${borderC}`;
    previewDiv.style.backgroundColor = bgC;
    previewDiv.style.fontSize = `${fontC}px`;
  }

  // We'll attach the event handler after we build the inputs
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

  // area-level
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

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  container.appendChild(wrapper);

  // We'll attach 'change' events to relevant inputs to update the preview
  const textColorEl = wrapper.querySelector(`#textColor-${categoryId}-${item.id}`);
  const borderColorEl = wrapper.querySelector(`#borderColor-${categoryId}-${item.id}`);
  const bgColorEl = wrapper.querySelector(`#bgColor-${categoryId}-${item.id}`);
  const fontSizeEl = wrapper.querySelector(`#fontSize-${categoryId}-${item.id}`);

  [textColorEl, borderColorEl, bgColorEl, fontSizeEl].forEach(el => {
    el.addEventListener("change", updatePreview);
  });

  return container;
}

/***************************************************************
 * 5. GENERATE THE FINAL .FILTER
 ***************************************************************/
function generateFilterContent() {
  let content = "";
  CATEGORIES.forEach(cat => {
    cat.itemTypes.forEach(item => {
      const enableEl = document.getElementById(`enable-${cat.categoryId}-${item.id}`);
      if (!enableEl?.checked) return;

      // If unrecognized
      if (cat.categoryId==="unrecognized" && item.rawLines) {
        content += item.rawLines.join("\n") + "\n\n";
        return;
      }

      // Otherwise standard
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
      // Alert sound
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
 *    + # Comments ignored 
 ***************************************************************/
function parseFilterText(rawText) {
  const text = rawText.trim();
  if (!text) {
    alert("No filter text found. Please paste your filter!");
    return;
  }

  // Reset unrecognized category
  const unrecognizedCat = CATEGORIES.find(c => c.categoryId==="unrecognized");
  unrecognizedCat.itemTypes = [];

  // Split lines ignoring # comments
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l!=="" && !l.startsWith("#"));

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
    alert("No 'Show' or 'Hide' lines found. Possibly all lines were # comments or blank.");
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

    let leftover = [];
    for (let line of block.slice(1)) {
      let recognized = false;
      if (line.startsWith("Rarity ")) {
        linesDict.rarities=line.replace("Rarity ","").split(" ");
        recognized=true;
      } else if (line.startsWith("Sockets > ")) {
        linesDict.sockets=parseInt(line.replace("Sockets > ",""),10);
        recognized=true;
      } else if (line.startsWith("Quality > ")) {
        linesDict.quality=parseInt(line.replace("Quality > ",""),10);
        recognized=true;
      } else if (line.startsWith("ItemLevel = ")) {
        linesDict.itemLevel=parseInt(line.replace("ItemLevel = ",""),10);
        recognized=true;
      } else if (line.startsWith("StackSize >=")) {
        linesDict.stackSize=parseInt(line.replace("StackSize >=",""),10);
        recognized=true;
      } else if (line.startsWith("AreaLevel ")) {
        const tokens=line.split(" ");
        if (tokens.length===3) {
          linesDict.areaOp=tokens[1];
          linesDict.areaVal=parseInt(tokens[2],10);
          recognized=true;
        }
      } else if (line.startsWith("Class ")) {
        let n=line.replace("Class ","").trim();
        linesDict.className=n.replace(/"/g,"");
        recognized=true;
      } else if (line.startsWith("BaseType ")) {
        let n=line.replace("BaseType ","").trim();
        linesDict.baseName=n.replace(/"/g,"");
        recognized=true;
      } else if (line.startsWith("SetTextColor ")) {
        linesDict.textColor=line.replace("SetTextColor ","").trim();
        recognized=true;
      } else if (line.startsWith("SetBorderColor ")) {
        linesDict.borderColor=line.replace("SetBorderColor ","").trim();
        recognized=true;
      } else if (line.startsWith("SetBackgroundColor ")) {
        linesDict.bgColor=line.replace("SetBackgroundColor ","").trim();
        recognized=true;
      } else if (line.startsWith("SetFontSize ")) {
        linesDict.fontSize=line.replace("SetFontSize ","").trim();
        recognized=true;
      } else if (line.startsWith("PlayAlertSound ")) {
        const parts=line.replace("PlayAlertSound ","").split(" ");
        linesDict.alertSound= parts[0];
        if (parts[1]) linesDict.alertDur= parts[1];
        recognized=true;
      }

      if (!recognized) leftover.push(line);
    }

    // Attempt match
    let foundCat=null;
    let foundItem=null;

    if (linesDict.baseName) {
      for (let cat of CATEGORIES) {
        if (cat.categoryId==="unrecognized") continue;
        for (let it of cat.itemTypes) {
          if (it.isStackable && it.name===linesDict.baseName) {
            foundCat=cat; foundItem=it; break;
          }
        }
        if (foundItem) break;
      }
    } else if (linesDict.className) {
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
      matchedCount++;
      // enable
      document.getElementById(`enable-${foundCat.categoryId}-${foundItem.id}`).checked=true;
      document.getElementById(`showOrHide-${foundCat.categoryId}-${foundItem.id}`).value= linesDict.showOrHide;

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

      // leftover lines => add them to unrecognized as separate items
      leftover.forEach(l => addUnrecognizedLine(l, linesDict.showOrHide));
    } else {
      // entire block unmatched
      unmatchedCount++;
      addUnrecognizedBlock(block);
    }
  }

  // update UI for unrecognized lines
  rebuildUnrecognizedUI();

  const msg = `Loaded filter with ${blocks.length} blocks.
Matched ${matchedCount} blocks/items. Unmatched: ${unmatchedCount} blocks => see "Unrecognized Lines" category.`;
  alert(msg);
}

/***************************************************************
 * 6B. UTILS for "Unrecognized Lines"
 ***************************************************************/
function addUnrecognizedLine(line, showOrHide="Show") {
  const unrecognizedCat = CATEGORIES.find(c=> c.categoryId==="unrecognized");
  const newId = Date.now()+Math.floor(Math.random()*10000);
  unrecognizedCat.itemTypes.push({
    id: newId,
    name: line,
    showOrHide,
    enabled: false,
    isStackable: false,
    usesItemLevel: false,
    rawLines: [ showOrHide, line ] // minimal block
  });
}
function addUnrecognizedBlock(rawLines) {
  const unrecognizedCat = CATEGORIES.find(c=> c.categoryId==="unrecognized");
  const newId = Date.now()+Math.floor(Math.random()*10000);
  const showOrHide = rawLines[0].startsWith("Show")? "Show":"Hide";

  unrecognizedCat.itemTypes.push({
    id: newId,
    name: rawLines.join("\\n"), 
    showOrHide,
    enabled: false,
    isStackable: false,
    usesItemLevel: false,
    rawLines
  });
}
function rebuildUnrecognizedUI() {
  const catIndex = CATEGORIES.findIndex(c=> c.categoryId==="unrecognized");
  if (catIndex<0) return;
  const section = document.querySelectorAll(".category-section")[catIndex];
  if (!section) return;
  while (section.children.length>2) {
    section.removeChild(section.lastChild);
  }

  const unrecognizedCat = CATEGORIES[catIndex];
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
