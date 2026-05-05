/**
 * controller.js — the "traffic controller" of the MVC architecture.
 *
 * Rules enforced here:
 *  • Controller imports from BOTH model and views.
 *  • Model imports from NO views.
 *  • Views import from NO model (and from each other only for composition).
 *
 * Each `control*` function follows the same pattern:
 *   1. Show a spinner so the user knows something is happening.
 *   2. Call the model (async, wrapped in try/catch).
 *   3. Tell the relevant view(s) to render the new state.
 */

import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// ─── Recipe ───────────────────────────────────────────────────────────────────

/**
 * Triggered by: hashchange event OR page load with a hash already in the URL.
 *
 * Also calls update() (not render()) on resultsView and bookmarksView so the
 * active-link highlight moves without re-rendering the entire list.
 * @returns {Promise<void>}
 */
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return; // nothing to load if there's no hash

    recipeView.renderSpinner();

    // Keep the sidebar in sync: highlight the selected result card
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Fetch and store the recipe in state
    await model.loadRecipe(id);

    // Hand state.recipe to the view — view knows nothing about the model
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};


// ─── Search ───────────────────────────────────────────────────────────────────

/**
 * Triggered by: search form submit.
 * @returns {Promise<void>}
 */
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render only page 1 — getSearchResultsPage() slices the full results array
    resultsView.render(model.getSearchResultsPage());

    // 4) Render pagination buttons based on total result count
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    resultsView.renderError(); // replaces the spinner with the error message
  }
};

// ─── Pagination ───────────────────────────────────────────────────────────────

/**
 * Triggered by: click on a pagination button.
 * @param {number} goToPage The page number stored in the button's data-goto attribute.
 */
const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

// ─── Servings ─────────────────────────────────────────────────────────────────

/**
 * Triggered by: click on +/- buttons inside the recipe view
 * Uses update() instead of render() to avoid a full DOM replacement —
 * only the quantities and the button data attributes change.
 *
 * @param {number} newServings value from the clicked button's data-update-to.
 */
const controlServings = function (newServings) {
  model.updateServings(newServings); // mutates state.recipe in place
  recipeView.update(model.state.recipe); // surgical DOM diff
};

// ─── Bookmarks ────────────────────────────────────────────────────────────────

/**
 * Triggered by: click on the bookmark button inside the recipe view.
 * Toggles the bookmark state and re-renders the affected areas.
 */
const controlAddBookmark = function () {
  if (model.state.recipe.isBookmarked) {
    model.removeBookmark(model.state.recipe.id);
  } else {
    model.addBookmark(model.state.recipe);
  }

  // Update — only the bookmark icon SVG href needs to change
  recipeView.update(model.state.recipe);

  // Full re-render of the bookmarks dropdown list
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Triggered by: page 'load' event (wired up via bookmarksView.addHandlerRender).
 * Restores bookmarks from localStorage into the dropdown on first load.
 */
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// ─── Add Recipe ───────────────────────────────────────────────────────────────

/**
 * Triggered by: "Upload" button inside the add-recipe modal form.
 * @param {Object} newRecipe Plain object built from FormData in addRecipeView.
 * @returns {Promise<void>}
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // Show the newly uploaded recipe in the main panel
    recipeView.render(model.state.recipe);

    // Confirmation message inside the modal
    addRecipeView.renderMessage();

    // Reflect the auto-bookmark in the dropdown
    bookmarksView.render(model.state.bookmarks);

    // Sync the URL hash without triggering a hashchange re-fetch
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close the modal after a short delay so the user can read the message
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥💥💥', err);
    addRecipeView.renderError(err.message);
  }
};

// ─── Init ─────────────────────────────────────────────────────────────────────

/**
 * Wire up all event handlers in one place.
 * Views expose "addHandler*" methods so the controller can subscribe
 * without knowing anything about how the DOM events are structured.
 * This keeps the "Publisher-Subscriber" pattern clean.
 */
const init = function () {
  bookmarksView.addHandlerUpdate(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
