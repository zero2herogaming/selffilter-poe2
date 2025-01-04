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
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b} 255`;
}

/***************************************************************
 * 2. ALL CATEGORIES & ITEMS
 *    - Merged from all your scripts.
 *    - "Unrecognized Lines" category for leftover lines that 
 *      are not comments and not recognized.
 ***************************************************************/

// Example categories (Gems, Weapons, Offhand, Armour, Jewellery, Flasks, Currency, Waystones, Jewels, Unrecognized).
// You would see all items from your references, including "Breach Ring," "Incense Relic," "Distilled Disgust," etc.
let CATEGORIES = [
  {
    categoryId: "gems",
    categoryName: "Gems",
    description: "Skill Gems, Support Gems, Spirit Gems, Timeless, Relics, etc.",
    itemTypes: [
      { id:1, name: "Uncut Spirit Gem", showOrHide:"Show", enabled:false, isStackable:false, usesItemLevel:true },
      { id:2, name: "Uncut Support Gem",showOrHide:"Show", enabled:false, isStackable:false, usesItemLevel:true },
      { id:3, name: "Uncut Skill Gem",  showOrHide:"Show", enabled:false, isStackable:false, usesItemLevel:true },
      { id:4, name: "Soul Core",        showOrHide:"Show", enabled:false, isStackable:false, usesItemLevel:false },
      { id:5, name: "Timeless",         showOrHide:"Show", enabled:false, isStackable:false, usesItemLevel:false },
      { id:6, name: "Relic",            showOrHide:"Show", enabled:false, isStackable:false, usesItemLevel:false },
      // etc. plus anything else from your scripts that belongs here
    ]
  },

  // ... (Other categories: weapons-onehand, weapons-twohand, offhand, armour, jewellery, flasks, currency, waystones, jewels)

  {
    categoryId: "unrecognized",
    categoryName: "Unrecognized Lines",
    description: "Lines that we couldn't parse. Enable to include them raw in the final filter.",
    itemTypes: []
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

    // Heading
    const heading = document.createElement("h2");
    heading.innerText = cat.categoryName;
    section.appendChild(heading);

    // Description
    const desc = document.createElement("p");
    desc.innerText = cat.description;
    section.appendChild(desc);

    // Items
    cat.itemTypes.forEach(item => {
      const itemEl = createItemTypeHTML(cat.categoryId, item);
      section.appendChild(itemEl);
    });

    form.insertBefore(section, document.getElementById("generate-button"));
  });
}

function activateCategory(index) {
  const sections = document.querySelectorAll(".category-section");
  const buttons = document.querySelectorAll(".tab-button");
  sections.forEach(sec => sec.classList.remove("active"));
  buttons.forEach(btn => btn.classList.remove("active"));

  sections[index].classList.add("active");
  buttons[index].classList.add("active");
}

/***************************************************************
 * 4. CREATE ITEM-TYPE HTML (with a color Preview)
 ***************************************************************/
function createItemTypeHTML(categoryId, item) {
  const container = document.createElement("div");
  container.classList.add("item-type");

  // Title
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("item-type-title");
  titleDiv.innerText = item.name;
  container.appendChild(titleDiv);

  // Preview
  const previewDiv = document.createElement("div");
  previewDiv.classList.add("preview-box");
  previewDiv.innerText = "Preview";
  // Some default style
  previewDiv.style.color = "#ffffff";
  previewDiv.style.border = "1px solid #ffffff";
  previewDiv.style.backgroundColor = "#000000";
  previewDiv.style.fontSize = "35px";
  previewDiv.style.padding = "4px";
  previewDiv.style.marginBottom = "8px";
  container.appendChild(previewDiv);

  function updatePreview() {
    const textColor = document.getElementById(`textColor-${categoryId}-${item.id}`).value;
    const borderColor = document.getElementById(`borderColor-${categoryId}-${item.id}`).value;
    const bgColor = document.getElementById(`bgColor-${categoryId}-${item.id}`).value;
    const fontSize = document.getElementById(`fontSize-${categoryId}-${item.id}`).value;

    previewDiv.style.color = textColor;
    previewDiv.style.border = `1px solid ${borderColor}`;
    previewDiv.style.backgroundColor = bgColor;
    previewDiv.style.fontSize = `${fontSize}px`;
  }

  // The main UI for the item
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
      <input type="number" id="sockets-${categoryId}-${item.id}" value="0" min="0"/>
    </label>

    <label>Quality >:
      <input type="number" id="quality-${categoryId}-${item.id}" value="0" min="0"/>
    </label>
  `;

  // ItemLevel if needed
  if (item.usesItemLevel) {
    html += `
      <label>ItemLevel =:
        <input type="number" id="itemLevel-${categoryId}-${item.id}" value="0" min="0"/>
      </label>
    `;
  }

  // StackSize if item is stackable
  if (item.isStackable) {
    html += `
      <label>StackSize >=:
        <input type="number" id="stackSize-${categoryId}-${item.id}" value="0" min="0"/>
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
      <input type="number" id="areaLevelVal-${categoryId}-${item.id}" value="0" min="0"/>
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

  // Attach change events for preview
  const textEl = wrapper.querySelector(`#textColor-${categoryId}-${item.id}`);
  const borderEl = wrapper.querySelector(`#borderColor-${categoryId}-${item.id}`);
  const bgEl = wrapper.querySelector(`#bgColor-${categoryId}-${item.id}`);
  const fontEl = wrapper.querySelector(`#fontSize-${categoryId}-${item.id}`);
  [textEl, borderEl, bgEl, fontEl].forEach(el => {
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
      // Check if enabled
      const enableEl = document.getElementById(`enable-${cat.categoryId}-${item.id}`);
      if (!enableEl || !enableEl.checked) return;

      // If "unrecognized"
      if (cat.categoryId === "unrecognized" && item.rawLines) {
        // Output those lines verbatim
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

      // Sockets > X
      const sockVal = parseInt(document.getElementById(`sockets-${cat.categoryId}-${item.id}`).value||"0",10);
      if (sockVal>0) {
        ruleBlock += `  Sockets > ${sockVal}\n`;
      }

      // Quality > X
      const qualVal = parseInt(document.getElementById(`quality-${cat.categoryId}-${item.id}`).value||"0",10);
      if (qualVal>0) {
        ruleBlock += `  Quality > ${qualVal}\n`;
      }

      // ItemLevel
      if (item.usesItemLevel) {
        const lvl = parseInt(document.getElementById(`itemLevel-${cat.categoryId}-${item.id}`).value||"0",10);
        if (lvl>0) {
          ruleBlock += `  ItemLevel = ${lvl}\n`;
        }
      }

      // StackSize
      if (item.isStackable) {
        const st = parseInt(document.getElementById(`stackSize-${cat.categoryId}-${item.id}`).value||"0",10);
        if (st>0) {
          ruleBlock += `  StackSize >= ${st}\n`;
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
 * 6. PARSE FILTER TEXT
 *    IGNORES # LINES (they are comments).
 *    leftover lines => unrecognized category
 ***************************************************************/
function parseFilterText(rawText) {
  const text = rawText.trim();
  if (!text) {
    alert("No filter text found. Please paste your filter!");
    return;
  }

  // Reset unrecognized
  const unrecognizedCat = CATEGORIES.find(c=> c.categoryId==="unrecognized");
  unrecognizedCat.itemTypes = [];

  // Split lines, remove # comments
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l!=="" && !l.startsWith("#")); // <= IGNORE ANY LINE STARTING WITH #

  if (lines.length===0) {
    alert("All lines were comments or blank. No content remains.");
    return;
  }

  let blocks = [];
  let current = [];

  function pushBlock() {
    if (current.length>0) {
      blocks.push([...current]);
      current=[];
    }
  }

  lines.forEach(ln => {
    if (ln.startsWith("Show") || ln.startsWith("Hide")) {
      pushBlock();
      current.push(ln);
    } else {
      current.push(ln);
    }
  });
  pushBlock();

  if (blocks.length===0) {
    alert("No 'Show' or 'Hide' lines found after ignoring # lines.");
    return;
  }

  let matchedCount=0;
  let unmatchedCount=0;

  for (let block of blocks) {
    const showOrHide= block[0].startsWith("Show") ? "Show":"Hide";
    let linesDict= {
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

    let leftover=[];

    for (let line of block.slice(1)) {
      let recognized=false;
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
        linesDict.alertSound=parts[0];
        if (parts[1]) linesDict.alertDur= parts[1];
        recognized=true;
      }
      if (!recognized) leftover.push(line);
    }

    // Attempt matching
    let foundCat=null;
    let foundItem=null;

    // If we have a baseName => isStackable
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
      matchedCount++;
      // enable
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

      // color lines
      if (linesDict.textColor) {
        let rgb= linesDict.textColor.split(" ").map(x=> parseInt(x,10));
        if (rgb.length>=3) {
          const cHex="#"+rgb.slice(0,3).map(x=> x.toString(16).padStart(2,"0")).join("");
          document.getElementById(`textColor-${foundCat.categoryId}-${foundItem.id}`).value= cHex;
        }
      }
      if (linesDict.borderColor) {
        let rgb= linesDict.borderColor.split(" ").map(x=> parseInt(x,10));
        if (rgb.length>=3) {
          const cHex="#"+rgb.slice(0,3).map(x=> x.toString(16).padStart(2,"0")).join("");
          document.getElementById(`borderColor-${foundCat.categoryId}-${foundItem.id}`).value= cHex;
        }
      }
      if (linesDict.bgColor) {
        let rgb= linesDict.bgColor.split(" ").map(x=> parseInt(x,10));
        if (rgb.length>=3) {
          const cHex="#"+rgb.slice(0,3).map(x=> x.toString(16).padStart(2,"0")).join("");
          document.getElementById(`bgColor-${foundCat.categoryId}-${foundItem.id}`).value= cHex;
        }
      }
      if (linesDict.fontSize) {
        document.getElementById(`fontSize-${foundCat.categoryId}-${foundItem.id}`).value= linesDict.fontSize;
      }
      if (linesDict.alertSound) {
        document.getElementById(`alertSound-${foundCat.categoryId}-${foundItem.id}`).value= linesDict.alertSound;
        document.getElementById(`alertDuration-${foundCat.categoryId}-${foundItem.id}`).value= linesDict.alertDur;
      }

      // leftover => unrecognized
      leftover.forEach(l => addUnrecognizedLine(l, linesDict.showOrHide));
    } else {
      // entire block unmatched => unrecognized
      unmatchedCount++;
      addUnrecognizedBlock(block);
    }
  }

  rebuildUnrecognizedUI();
  alert(`Loaded filter with ${blocks.length} blocks.\nMatched: ${matchedCount}. Unmatched: ${unmatchedCount}. Comments (#) were ignored.`);
}

/***************************************************************
 * 6D. UNRECOGNIZED UTILS
 ***************************************************************/
function addUnrecognizedLine(line, showOrHide) {
  const unCat = CATEGORIES.find(c => c.categoryId==="unrecognized");
  const newId = Date.now() + Math.floor(Math.random()*10000);
  unCat.itemTypes.push({
    id: newId,
    name: line,
    showOrHide,
    enabled:false,
    isStackable:false,
    usesItemLevel:false,
    rawLines:[showOrHide, line]
  });
}
function addUnrecognizedBlock(block) {
  const unCat = CATEGORIES.find(c => c.categoryId==="unrecognized");
  const newId = Date.now() + Math.floor(Math.random()*10000);
  const showOrHide= block[0].startsWith("Show")? "Show":"Hide";
  unCat.itemTypes.push({
    id:newId,
    name: block.join("\\n"),
    showOrHide,
    enabled:false,
    isStackable:false,
    usesItemLevel:false,
    rawLines:block
  });
}
function rebuildUnrecognizedUI() {
  const idx = CATEGORIES.findIndex(c=> c.categoryId==="unrecognized");
  if (idx<0) return;
  const section = document.querySelectorAll(".category-section")[idx];
  if (!section) return;

  while (section.children.length>2) {
    section.removeChild(section.lastChild);
  }
  const unCat= CATEGORIES[idx];
  unCat.itemTypes.forEach(item => {
    const itemEl = createItemTypeHTML(unCat.categoryId, item);
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
      const rawText = document.getElementById("filter-load-text")?.value || "";
      parseFilterText(rawText);
    });
  }
}

// Generate + download
document.getElementById("filter-form").addEventListener("submit", function(e){
  e.preventDefault();
  const filterText = generateFilterContent();
  const blob = new Blob([filterText], { type:"text/plain" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.getElementById("download-link");
  downloadLink.href = url;
  downloadLink.download = "my-custom-filter.filter";

  document.getElementById("download-section").style.display="block";
});

window.addEventListener("DOMContentLoaded", init);
