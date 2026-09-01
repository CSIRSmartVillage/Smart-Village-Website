const SMART_VILLAGE_PATTERN = /\bsmart\s+village(s)?\b/gi;

export const normalizeSmartVillageText = (value) => {
  if (typeof value !== "string") return value;

  return value.replace(
    SMART_VILLAGE_PATTERN,
    (_match, pluralSuffix) =>
      pluralSuffix ? "SMART Villages" : "SMART Village"
  );
};

const SKIPPED_TEXT_CONTAINERS =
  'script, style, textarea, code, pre, [contenteditable="true"], [data-preserve-smart-village-case]';

const shouldSkipTextNode = (node) =>
  node.parentElement?.closest(SKIPPED_TEXT_CONTAINERS);

const normalizeTextNode = (node) => {
  if (shouldSkipTextNode(node)) return;

  const normalizedValue = normalizeSmartVillageText(node.nodeValue);

  if (normalizedValue !== node.nodeValue) {
    node.nodeValue = normalizedValue;
  }
};

const normalizeTextTree = (node) => {
  if (!node) return;

  if (node.nodeType === Node.TEXT_NODE) {
    normalizeTextNode(node);
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;

  const walker = document.createTreeWalker(
    node,
    NodeFilter.SHOW_TEXT
  );
  let textNode = walker.nextNode();

  while (textNode) {
    normalizeTextNode(textNode);
    textNode = walker.nextNode();
  }
};

export const startSmartVillageDisplayNormalization = (root) => {
  if (
    typeof document === "undefined" ||
    typeof MutationObserver === "undefined" ||
    !root
  ) {
    return () => {};
  }

  normalizeTextTree(root);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "characterData") {
        normalizeTextNode(mutation.target);
        return;
      }

      mutation.addedNodes.forEach(normalizeTextTree);
    });
  });

  observer.observe(root, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  return () => observer.disconnect();
};
