// Constants
const BOOST_TIME = 35; // Amount of extra time rewarded at the middle scene.
const GOOD_TIME = 5; // Amount of time lost from good solutions.
const OKAY_TIME = 10; // Amount of time lost from okay solutions.
const BAD_TIME = 15; // Amount of time lost from bad solutions.

const QUALITY_ITEMS = {
    "Knife": "Made of good metal. Used for stabbing and cutting, usually.",
    "Prybar": "Scavenged metal tool, able to open things meant to stay closed.",
    "Rope": "A length of hand-crafted linen rope from your tribe."
};
const CHEAP_ITEMS = {
    "Pickaxe": "Old, rusted, and the wood is wet, but it’s still able to serve.",
    "Sharpened Rebar": "A metal rebar once used for construction, sharpened into a long, fine spike.",
    "Painkiller": "A glass cylinder with a fine metal spike and a pump. Probably very old, but it may still numb your pains.",
    "Synthetic Cloak": "A plastic cloak. You can wrap it around yourself and blow into a plastic pipe to inflate it.",
    "Toolkit": "A set of old tools, held in an equally old, heavy, metal toolbox.",
    "Metal Hook": "A menacing hook on a long pole.",
    "Hacksaw": "A set of old tools, held in an equally old, heavy, metal toolbox.",
    "Welder Fluid": "A metal pre-Sundering cylinder, full of fuel used in industrial welders.",
    "Wire Coil": "A coil of electrical wire. Or so you think, the people tell tales of such devices being in use pre-Sundering."
};

// Starting vars
let roomsVisited = 0;
let timeRemaining = 300; // Amount of time remaining before death. // TODO: Make 30.
let villageTimeRequired = -10; // Amount of time remaining required for the good ending.
let items = JSON.parse(JSON.stringify(QUALITY_ITEMS));
let roomPool = Array.from(document.getElementsByClassName("random")); // Rooms that can be randomly chosen.

// Initialize HTML
printScene("The Gate", true);
console.log("Init completed.");

/**
 * Updates the innerHTML of element with the given HTML, applying a fade-in.
 * @param {HTMLElement} element - The element to be updated.
 * @param {string} innerHTML - The new contents of the element.
 */
function updateHTML(element, innerHTML) {
    // Reset the animation class so that it plays again.
    element.classList.remove("fade-in");
    element.offsetWidth;
    element.classList.add("fade-in");

    // Update HTML.
    element.innerHTML = innerHTML;
}

/**
 * Rewrites the page header with the current scene and time remaining.
 */
function updateHeader() {
    let header = document.getElementsByTagName("header")[0]; // Header element
    let scene = document.getElementById("scene").getAttribute("data-scene"); // Current scene name

    // Write left header
    header.firstElementChild.innerHTML = "<p>" + scene + "</p>";
    // Write right header
    header.lastElementChild.innerHTML = "<p>Time Remaining: " + timeRemaining + " Minutes</p>";
}

/**
 * Print the given scene to the page, displaying it to the user in place of the current one.
 * @param {string} sceneId The name of the scene to be printed.
 * @param {boolean} includeItems If true, the inventory will be embedded afterwards.
 */
function printScene(sceneId, includeItems) {
    console.log("Printing scene " + sceneId + ". Including inventory: " + includeItems);
    document.getElementById("result").hidden = true;

    let scene = document.getElementById("scene");
    updateHTML(scene, document.getElementById(sceneId).firstElementChild.innerHTML);
    scene.setAttribute("data-scene", sceneId);

    // Embed inventory if included or its override.
    if (includeItems) {
        embedInventory();
    } else {
        embedInventoryOverride(document.getElementById(sceneId).querySelector(".override").innerHTML);
    }
    updateHeader();
}

/**
 * Embeds the current player inventory after the scene.
 */
function embedInventory() {
    console.log("Embedding inventory.");

    // Clear existing contents.
    element = document.getElementById("inventory");
    updateHTML(element, "");

    // Add <p> tag for the inventory intro.
    let child = document.createElement("P");
    child.appendChild(document.createTextNode("You open your bag, and assess your resources.\n"));
    element.appendChild(child);

    // Add <p> and <a> tag for every item the player has.
    for (let key in items) {
        // Add <a> tag for the item button.
        let link = document.createElement("A");
        link.setAttribute("href", "javascript:void(0)");
        link.appendChild(document.createTextNode(key + ":"));

        // Add <p> tag for the item and description.
        child = document.createElement("P");
        child.appendChild(link);
        child.appendChild(document.createTextNode(" " + items[key]));
        element.appendChild(child);

        // Make the item button functional.
        link.addEventListener("click", function(){embedResult(key)});
    }

    element.hidden = false;
}

/**
 * Embeds the override content into the inventory instead of the items.
 * @param {string} override HTML to place in the inventory.
 */
function embedInventoryOverride(override) {
    console.log("Embedding inventory with override.");

    // Replace existing contents.
    element = document.getElementById("inventory");
    updateHTML(element, override);

    element.hidden = false;
}

/**
 * Embeds the result of the player's choice in place of the inventory.
 * @param {string} item The name of the item that the player chose to use.
 */
function embedResult(item) {
    console.log("Embedding result for item " + item + ".");

    let scene = document.getElementById(document.getElementById("scene").getAttribute("data-scene")); // The meta-HTML for the current scene.
    let results = scene.lastElementChild; // The div containing all possible results for the scene.
    let found = false; // Variable to track if the correct result has been found.
    let resultHTML = ""; // The HTML to be displayed.

    // Remove item from inventory.
    delete items[item];

    // Iterate through all possible results for the scene to find the one for the current item.
    for (let result of results.children) {
        // If the result's item matches the used item, handle result.
        if (result.getAttribute("data-item") === item) {
            resultHTML = result.innerHTML;
            found = true;

            // Decrement timer by proper amount.
            if (result.className === "good") {
                timeRemaining -= GOOD_TIME;
            } else {
                timeRemaining -= OKAY_TIME;
            }

            break;
        }
    }

    // If no result matched the item, embed the generic bad result.
    if (!found) {
        resultHTML = "<p>Your chosen method proves ineffective at best, leaving you to scramble and force your way through your obstacle, shorter on breath and time.</p>\n";
        timeRemaining -= BAD_TIME;
    }
    
    // Reward item based on scene.
    switch (scene.id) {
        case "The Gate":
            items["Pickaxe"] = CHEAP_ITEMS["Pickaxe"];
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Thorn Vines":
            items["Sharpened Rebar"] = CHEAP_ITEMS["Sharpened Rebar"];
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Water Room":
            items["Painkiller"] = CHEAP_ITEMS["Painkiller"];
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Sundered Pit":
            items["Synthetic Cloak"] = CHEAP_ITEMS["Synthetic Cloak"];
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Lizard Lair":
            items["Wire Coil"] = CHEAP_ITEMS["Wire Coil"];
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Canal Room":
            items["Metal Hook"] = CHEAP_ITEMS["Metal Hook"];
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Flooded Room":
            items["Hacksaw"] = CHEAP_ITEMS["Hacksaw"];
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Collapsed Tunnel":
            items["Welder Fluid"] = CHEAP_ITEMS["Welder Fluid"];
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Metal Bars":
            items["Toolkit"] = CHEAP_ITEMS["Toolkit"];
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        default:
            throw "No reward for scene " + scene.id + "!";
    }

    // Add continue button to result and set the HTML.
    resultHTML += "<p><a id=\"continue\" href=\"javascript:void(0)\">Next</a></p>"

    let result = document.getElementById("result")
    updateHTML(result, resultHTML);

    // Make the continue button functional.
    document.getElementById("continue").addEventListener("click", selectScene);
    
    result.hidden = false;
    document.getElementById("inventory").hidden = true;
    updateHeader();
}

function selectScene() {
    let selection = "";
    let showItems = false;

    // Select fixed rooms where they belong, or select and remove random room from pool.
    if (timeRemaining <= 0) {
        selection = "Death";
    } else if (roomsVisited === 2) { // TODO: Make 2.
        selection = "Withered Garden";
    } else if (roomsVisited === 5) {
        selectEnding();
        return;
    } else {
        let rand = Math.floor(Math.random() * roomPool.length);
        selection = roomPool.splice(rand, 1)[0].id;
        showItems = true;
    }

    // Print the selected scene.
    printScene(selection, showItems);
    roomsVisited++;
}

function toggleFont() {
    let page = document.getElementById("page");
    if (page.style.fontFamily == '"OpenDyslexic3Regular", serif') {
        page.style.fontFamily = '"Georgia", serif';
    } else {
        page.style.fontFamily = '"OpenDyslexic3Regular", serif';
    }
}

///// Room-specific functions /////
function takeStalk(take) {
    let resultHTML;

    // Change the time if stalk eaten and set result.
    if (take) {
        timeRemaining += BOOST_TIME - 5;
        villageTimeRequired += BOOST_TIME;

        resultHTML = "<p>After a few minutes of preparation, you consume the remains of the flower in the hopes of extending your time here. You forge on, feeling laden with guilt but freed of the numbing influence of the rot.</p>";
    } else {
        resultHTML = "<p>In a surge of panache, you discard the remains of the plant, and continue on your journey with a sprightly step.</p>";
    }
    
    // Add continue button to result and set the HTML.
    resultHTML += "<p><a id=\"continue\" href=\"javascript:void(0)\">Next</a></p>";
    updateHTML(document.getElementById("result"), resultHTML);

    document.getElementById("result").hidden = false;
    document.getElementById("inventory").hidden = true;

    updateHeader();

    // Make the continue button functional.
    document.getElementById("continue").addEventListener("click", function() { printScene("Scavenger Trade", false); toggleTrade(false);} );
}

function toggleTrade(flipped) {
    // Embed correct trade interface.
    let interface;
    if (flipped) {
        interface = document.getElementById("Toggled Trade");
    } else {
        interface = document.getElementById("Trade");
    }

    // Get dropdowns.
    let quality = interface.querySelector("#QualityItem");
    let cheap1 = interface.querySelector("#CheapItem1");
    let cheap2 = interface.querySelector("#CheapItem2");

    // Populate dropdowns with correct items.
    if (flipped) {
        // Populate cheap items the player has.
        Object.keys(CHEAP_ITEMS).forEach(item => {
            if (item in items) {
                let option = document.createElement("option");
                option.setAttribute("value", item);
                option.textContent = item;

                cheap1.appendChild(option);
                cheap2.appendChild(option.cloneNode(true));
            }
        });
        
        // Populate quality items the player does not have.
        Object.keys(QUALITY_ITEMS).forEach(item => {
            if (!(item in items)) {
                let option = document.createElement("option");
                option.setAttribute("value", item);
                option.textContent = item;

                quality.appendChild(option);
            }
        });
    } else {
        // Populate quality items the player has.
        Object.keys(QUALITY_ITEMS).forEach(item => {
            if (item in items) {
                let option = document.createElement("option");
                option.setAttribute("value", item);
                option.textContent = item;

                quality.appendChild(option);
            }
        });

        // Populate cheap items the player does not have.
        Object.keys(CHEAP_ITEMS).forEach(item => {
            if (!(item in items)) {
                let option = document.createElement("option");
                option.setAttribute("value", item);
                option.textContent = item;

                cheap1.appendChild(option);
                cheap2.appendChild(option.cloneNode(true));
            }
        });
    }

    // Add continue button to result and set the HTML.
    let resultHTML = interface.innerHTML;
    resultHTML += "<p><a id=\"continue\" href=\"javascript:void(0)\">Continue without trading.</a></p>"
    updateHTML(document.getElementById("inventory"), resultHTML);

    // Make the continue button functional.
    document.getElementById("continue").addEventListener("click", selectScene);
}

function disableItem(dropdown, item) {
    // Get dropdown to disable item in.
    let otherDropdown;
    if (dropdown.id === "CheapItem1") {
        otherDropdown = dropdown.parentElement.querySelector("#CheapItem2");
    } else if (dropdown.id === "CheapItem2") {
        otherDropdown = dropdown.parentElement.querySelector("#CheapItem1");
    }

    // Disable item and enable other items.
    Array.from(otherDropdown.children).forEach(child => {
        if (child.getAttribute("value") === item) {
            child.setAttributeNode(document.createAttribute("disabled"));
        } else if (child.hasAttribute("disabled") && !child.hasAttribute("hidden")) {
            child.removeAttribute("disabled");
        }
    })
}

function trade() {
    // Get selected items.
    let interface = document.getElementById("inventory");
    let quality = interface.querySelector("#QualityItem").value;
    let cheap1 = interface.querySelector("#CheapItem1").value;
    let cheap2 = interface.querySelector("#CheapItem2").value;

    // Check if trade is toggled or not.
    let toggled = false;
    if (interface.firstElementChild.id == "Toggled Trade Form") toggled = true;

    // Add/remove items as per trade.
    if (toggled) {
        items[quality] = QUALITY_ITEMS[quality];
        delete items[cheap1];
        delete items[cheap2];
    } else {
        delete items[quality];
        items[cheap1] = CHEAP_ITEMS[cheap1];
        items[cheap2] = CHEAP_ITEMS[cheap2];
    }

    selectScene();
}
