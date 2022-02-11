// Constants
const BOOST_TIME = 30; // Amount of extra time rewarded at the middle scene.
const CUTOFF = 20; // Amount of time remaining required for the good ending.
const GOOD_TIME = 5; // Amount of time lost from good solutions.
const OKAY_TIME = 10; // Amount of time lost from okay solutions.
const BAD_TIME = 15; // Amount of time lost from bad solutions.

// Starting vars
let roomsVisited = 0;
let timeRemaining = 30;
let items = {
    "Knife": "Made of good metal. Used for stabbing and cutting, usually.",
    "Prybar": "Scavenged metal tool, able to open things meant to stay closed.",
    "Rope": "A length of hand-crafted linen rope from your tribe."
};
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

    embedInventory(includeItems);
    updateHeader();
}

/**
 * Embeds the current player inventory after the scene.
 * @param {boolean} show If true, the inventory will be shown. Otherwise, it will be hidden.
 */
function embedInventory(show) {
    console.log("Embedding Inventory. Showing: " + show);

    // Clear existing contents.
    element = document.getElementById("inventory");
    updateHTML(element, element.innerHTML);
    element.innerHTML = "";

    // Hide inventory if it is not meant to show.
    if (!show) {
        element.hidden = true;
        return undefined;
    }

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
            items["Pickaxe"] = "Old, rusted, and the wood is wet, but it’s still able to serve.";
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Thorn Vines":
            items["Sharpened Rebar"] = "A metal rebar once used for construction, sharpened into a long, fine spike.";
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Water Room":
            items["Painkiller"] = "A glass cylinder with a fine metal spike and a pump. Probably very old, but it may still numb your pains.";
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Sundered Pit":
            items["Synthetic Cloak"] = "A plastic cloak, you can wrap it around yourself and blow into a plastic pipe to inflate it.";
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Lizard Lair":
            items["Wire Coil"] = "A coil of electrical wire. Or so you think, the people tell tales of such devices being in use pre-Sundering.";
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Canal Room":
            items["Metal Hook"] = "A menacing hook on a long pole.";
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Flooded Room":
            items["Hacksaw"] = "Saw with teeth, meant for cutting teeth.";
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Collapsed Tunnel":
            items["Welder Fluid"] = "A meta pre-Sundering cylinder, full of fuel used in industrial welders.";
            resultHTML += "<p>RESULT</p>" // TODO: Insert Itty's item found text.
            break;
        case "Metal Bars":
            items["Toolkit"] = "A set of old tools, held in an equally old, heavy, metal toolbox.";
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
    } else if (roomsVisited === 2) {
        selection = "Withered Garden";
    } else if (roomsVisited === 5) {
        selection = "Wild Patch";
    } else {
        let rand = Math.floor(Math.random() * roomPool.length);
        selection = roomPool.splice(rand, 1)[0].id;
        showItems = true;

        roomsVisited++;
    }

    // Print the selected scene.
    printScene(selection, showItems);
}

function toggleFont() {
    let page = document.getElementById("page");
    if (page.style.fontFamily == '"OpenDyslexic3Regular", serif') {
        page.style.fontFamily = '"Georgia", serif';
    } else {
        page.style.fontFamily = '"OpenDyslexic3Regular", serif';
    }
}
