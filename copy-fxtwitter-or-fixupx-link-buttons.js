// ==UserScript==
// @name         Copy fxtwitter or fixupx link buttons
// @name:ES      Botones de copiar enlace de fxtwitter o fixupx
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds two buttons at the top of the status page on Twitter to easily copy an fxtwitter or fixupx url
// @description:ES  Añade dos botones en la parte superior de las páginas de tweets para copiar enlaces fxtwitter o fixupx fácilmente
// @author       LuisAlfredo92
// @match        *x.com/*
// @match        *twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    var re = new RegExp(".*(x.com|twitter.com)\/.+\/status\/.+");
    var exists = false;

    // Function to change url
    function modifyAndSaveUrl(type) {
        // Get URL
        const currentUrl = window.location.href;
        const isTwitter = currentUrl.includes("twitter.com");
        var modifiedUrl = "";
        if (type === "t") {
            modifiedUrl = currentUrl.replace(isTwitter ? "twitter.com" : "x.com", "fxtwitter.com");
        } else {
            modifiedUrl = currentUrl.replace(isTwitter ? "twitter.com" : "x.com", "fixupx.com");
        }

        // Copy to url
        navigator.clipboard.writeText(modifiedUrl)
            .then(() => console.log("Modified URL copied to clipboard: ", modifiedUrl))
            .catch((ex) => console.error("Failed to copy the modified URL: ", ex));
    }

    // Function to create buttons
    function createButton(label, type) {
        const button = document.createElement("BUTTON");
        button.appendChild(document.createTextNode(label));
        button.addEventListener("click", () => modifyAndSaveUrl(type) );
        button.style.flexGrow = "1";
        button.style.textAlign = "center";
        button.style.fontFamily = "TwitterChirp";
        button.style.border = "none";
        button.style.borderRadius = "25px";
        button.style.padding = "10px 0px";
        button.style.fontWeight = "bold";

        return button;
    }

    const callback = (mutationList) => {
        // Check if the current page is a tweet
        const currentUrl = window.location.href;
        if(!re.test(currentUrl)) return;

        for (const mutation of mutationList) {
            if(mutation.type !== "attributes") return;

            // Checks if the buttons doesn't already exist
            if(exists) {
                const existingContainers = document.querySelectorAll("#fxtwitterFixupxButtons");
                if(existingContainers.length != 0)
                    return;

                exists = false;
            }

            const containers = document.querySelectorAll(".css-175oi2r.r-1iusvr4.r-16y2uox.r-ttdzmv");
            if(containers.length == 0) return;

            // Create container and changes its style
            const container = document.createElement("DIV");
            container.id = "fxtwitterFixupxButtons";
            container.style.marginBottom = "15px";
            container.style.display = "flex";
            container.style.flexDirection = "row";
            container.style.gap = "10px";

            // Add buttons
            container.appendChild(fxtwitterButton);
            container.appendChild(fixupxButton);

            // Insert container
            containers[0].prepend(container);
            exists = true;
        }
    };

    // Create buttons
    const fxtwitterButton = createButton("Copy fxtwitter link", "t");
    const fixupxButton = createButton("Copy fixupx link", "x");

    // Displays the buttons when the page is correctly loaded
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, subtree: true };
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(document, config);
})();