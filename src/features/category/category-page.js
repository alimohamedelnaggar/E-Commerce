/**
 * Category listing page — reads ?cat= from the URL and updates the title.
 * Safe to call on every page; no-ops when #category-title is missing.
 */

var CATEGORY_LABELS = {
  laptops: "Laptops",
  mobiles: "Mobiles & tablets",
  accessories: "Accessories",
  keyboards: "Keyboards",
  all: "All products"
};

function resolveCategoryName(slug) {
  var key = slug && slug.length ? slug : "all";
  return CATEGORY_LABELS[key] || key;
}

export function initCategoryPage() {
  var titleEl = document.getElementById("category-title");
  if (!titleEl) return;

  var params = new URLSearchParams(window.location.search);
  var cat = params.get("cat") || "all";
  var name = resolveCategoryName(cat);

  titleEl.textContent = name;
  document.title = name + " — TechStore";
}
