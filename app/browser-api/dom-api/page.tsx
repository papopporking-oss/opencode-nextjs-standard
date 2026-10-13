"use client";

import { useEffect, useState } from "react";

/**
 * DOM API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
 *                https://developer.mozilla.org/en-US/docs/Web/API/Document
 *                https://developer.mozilla.org/en-US/docs/Web/API/Element
 *
 * The DOM (Document Object Model) API is the core interface for
 * interacting with HTML documents. It represents the page structure
 * as a tree of nodes that can be traversed and manipulated.
 */
export default function Page() {
  const [domInfo, setDomInfo] = useState<string[]>([]);

  useEffect(() => {
    // Step 1: The Document object is the entry point (available as global `document`)
    console.log("DOM API: document is the root entry point");
    console.log("  document.nodeType:", document.nodeType); // 9 = DOCUMENT_NODE

    // Step 2: Querying elements — multiple selection methods
    // getElementById: fastest, returns single element by ID
    const main = document.getElementById("demo-container");
    console.log("DOM API: getElementById:", main);
    console.log("DOM API: getElementById — element:", main?.tagName);

    // querySelector: CSS selector, returns first match
    const firstButton = document.querySelector(".demo-btn");
    console.log("DOM API: querySelector('.demo-btn'):", firstButton?.tagName);

    // querySelectorAll: returns static NodeList of all matches
    const allButtons = document.querySelectorAll(".demo-btn");
    console.log(`DOM API: querySelectorAll('.demo-btn'): ${allButtons.length} button(s)`);

    // getElementsByClassName: returns live HTMLCollection (auto-updates!)
    const liveCollection = document.getElementsByClassName("demo-btn");
    console.log(`DOM API: getElementsByClassName('demo-btn'): ${liveCollection.length} button(s) (live)`);

    // Step 3: Element properties
    if (firstButton) {
      console.log("DOM API: Element properties of first button:");
      console.log("  tagName:", firstButton.tagName);
      console.log("  className:", firstButton.className);
      console.log("  id:", firstButton.id);
      console.log("  innerHTML:", firstButton.innerHTML);
      console.log("  textContent:", firstButton.textContent);
      console.log("  children count:", firstButton.children.length);
      console.log("  attributes count:", firstButton.attributes.length);
      console.log("  parentElement:", firstButton.parentElement?.tagName);
      console.log("  nextElementSibling:", firstButton.nextElementSibling?.tagName);
    }

    // Step 4: Creating new elements
    const newDiv = document.createElement("div");
    newDiv.textContent = "Dynamically created element";
    newDiv.className = "dynamic-el";
    newDiv.id = "dynamic-element";
    console.log("DOM API: createElement('div') — new element:", newDiv);

    // Step 5: Set attributes
    newDiv.setAttribute("data-created", new Date().toISOString());
    console.log("DOM API: setAttribute('data-created', ...)");
    console.log("  getAttribute('data-created'):", newDiv.getAttribute("data-created"));
    newDiv.removeAttribute("data-created"); // Cleanup demo attr
    console.log("DOM API: removeAttribute('data-created')");

    // Step 6: Append element to the DOM
    const container = document.getElementById("demo-container");
    if (container) {
      container.appendChild(newDiv);
      console.log("DOM API: appendChild — element added to container");
    }

    // Step 7: DOM traversal
    const domTreeInfo: string[] = [];
    if (container) {
      // Parent node
      domTreeInfo.push(`Parent of container: ${container.parentElement?.tagName}`);
      console.log("DOM API: parentElement:", container.parentElement?.tagName);

      // Child nodes (includes text nodes from whitespace)
      console.log(`DOM API: container.childNodes: ${container.childNodes.length} nodes`);

      // Children (only element children, no text nodes)
      console.log(`DOM API: container.children: ${container.children.length} elements`);
      Array.from(container.children).forEach((child, i) => {
        console.log(`  children[${i}]: <${child.tagName}> class="${child.className}"`);
      });

      // Sibling navigation
      console.log("DOM API: previousElementSibling:", container.previousElementSibling?.tagName);
      console.log("DOM API: nextElementSibling:", container.nextElementSibling?.tagName);

      // Closest ancestor matching selector
      const closestMain = container.closest("main");
      console.log("DOM API: closest('main'):", closestMain?.tagName);

      // Contains check
      console.log("DOM API: container.contains(firstButton):", container.contains(firstButton));
    }

    // Step 8: Styling elements programmatically
    const styleTarget = document.getElementById("style-target");
    if (styleTarget) {
      // Direct style property manipulation
      styleTarget.style.backgroundColor = "#e8f5e9";
      styleTarget.style.padding = "12px";
      styleTarget.style.borderRadius = "8px";
      console.log("DOM API: style property set on style-target");

      // classList operations
      styleTarget.classList.add("highlighted");
      styleTarget.classList.remove("highlighted");
      styleTarget.classList.toggle("active"); // Toggle on/off
      console.log("DOM API: classList methods — add, remove, toggle");

      // Check if class exists
      console.log("DOM API: classList.contains('active'):", styleTarget.classList.contains("active"));

      // Computed style (actual rendered style after CSS)
      const computed = window.getComputedStyle(styleTarget);
      console.log("DOM API: getComputedStyle — fontSize:", computed.fontSize);
      console.log("DOM API: getComputedStyle — color:", computed.color);
    }

    // Step 9: Event handling at DOM level
    const handleDemoEvent = (event: Event) => {
      console.log("DOM API: Event fired:", event.type);
      console.log("  target:", (event.target as Element)?.tagName);
      console.log("  currentTarget:", (event.currentTarget as Element)?.tagName);

      // Step 10: Event phases
      // true (default omitted) = bubbling phase
      // false = capturing phase (rarely used)
      console.log("  eventPhase:", event.eventPhase); // 1=Capturing, 2=AtTarget, 3=Bubbling
    };

    // Add event listener to container for demonstration
    container?.addEventListener("click", handleDemoEvent);
    console.log("DOM API: Event listener added to container");

    // Step 11: MutationObserver — watch for DOM changes
    if (container) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          console.log("DOM API: MutationObserver detected change:");
          console.log("  Type:", mutation.type); // "childList", "attributes", "characterData"
          console.log("  Added nodes:", mutation.addedNodes.length);
          console.log("  Removed nodes:", mutation.removedNodes.length);
        });
      });

      observer.observe(container, {
        childList: true,    // Watch for added/removed children
        attributes: true,   // Watch for attribute changes
        subtree: false,     // Don't watch descendants
        attributeFilter: ["class"], // Only watch specific attributes
      });

      console.log("DOM API: MutationObserver started on container");
    }

    // Step 12: Get element dimensions and position
    if (container) {
      const rect = container.getBoundingClientRect();
      console.log("DOM API: getBoundingClientRect():");
      console.log("  top:", rect.top, "left:", rect.left);
      console.log("  width:", rect.width, "height:", rect.height);
      console.log("  bottom:", rect.bottom, "right:", rect.right);
    }

    // Step 13: Document-level properties
    console.log("DOM API: Document properties:");
    console.log("  document.title:", document.title);
    console.log("  document.URL:", document.URL);
    console.log("  document.head:", document.head?.tagName);
    console.log("  document.body:", document.body?.tagName);
    console.log("  document.forms length:", document.forms.length);
    console.log("  document.images length:", document.images.length);
    console.log("  document.links length:", document.links.length);

    setDomInfo(domTreeInfo);

    return () => {
      container?.removeEventListener("click", handleDemoEvent);
      console.log("DOM API: Event listener removed, cleanup complete");
    };
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">DOM API</h1>
      <div className="p-3 border border-blue-500 rounded-lg bg-blue-50 mb-4">
        <p>Open DevTools Console to see DOM querying, creation, traversal, styling, and event handling.</p>
      </div>

      <div id="demo-container">
        <p>This is the demo container (id=demo-container)</p>

        <div id="style-target">Style Target — CSS modified via JS</div>

        <div>
          <button className="demo-btn" onClick={() => console.log("DOM API: Button 1 clicked")}>Button 1</button>
          <button className="demo-btn" onClick={() => console.log("DOM API: Button 2 clicked")}>Button 2</button>
          <button className="demo-btn" onClick={() => console.log("DOM API: Button 3 clicked")}>Button 3</button>
        </div>

        <div id="dynamic-content">
          <p>Dynamic element will be appended here</p>
        </div>
      </div>

      {domInfo.length > 0 && (
        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm max-h-64 overflow-auto mt-3 font-mono">
          {domInfo.map((l, i) => <div key={i}>{l}</div>)}
        </pre>
      )}

      <a className="text-blue-600 hover:underline text-sm mt-4 inline-block" href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model" target="_blank" rel="noopener noreferrer">MDN: DOM API</a>
    </main>
  );
}