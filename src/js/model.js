import { API_URL, KEY, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

// ─── Central application state ────────────────────────────────────────────────
// This single object is the "source of truth" for the whole app.
// Views never write to this — only model functions do.
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [], // full result list from the API
    page: 1, // current pagination page
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

// ─── Private helpers ──────────────────────────────────────────────────────────

/**
 * Normalizes the raw API recipe object into our app's naming convention
 * (camelCase instead of snake_case) and extracts only what we need.
 * Spreading `recipe.key` conditionally means user-uploaded recipes carry
 * their key, but public ones stay clean.
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

/** Writes the current bookmarks array to localStorage so they survive a refresh. */
const persistedBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// ─── Recipe ───────────────────────────────────────────────────────────────────

/**
 * Fetches a single recipe by id and stores it in state.recipe.
 * Also flags it as bookmarked if it already exists in state.bookmarks.
 * Throws on network errors so the controller can surface them to the user.
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    // Sync bookmark flag without mutating the bookmarks array
    state.recipe.isBookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id,
    );
  } catch (err) {
    throw err;
  }
};

// ─── Search ───────────────────────────────────────────────────────────────────

/**
 * Searches the API and stores normalized results in state.search.results.
 * Resets the page to 1 so pagination always starts fresh on a new search.
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

/**
 * Returns the slice of results for the requested page and saves the page
 * into state so other parts of the app know where we are.
 * Defaults to the current page stored in state.
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // e.g., page 1 → 0
  const end = page * state.search.resultsPerPage; // e.g., page 1 → 10

  return state.search.results.slice(start, end);
};

// ─── Servings ─────────────────────────────────────────────────────────────────

/**
 * Scales every ingredient quantity proportionally when the serving count changes.
 * Mutates state directly — the view will call update() rather than a full re-render.
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // ratio: new / old
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

// ─── Bookmarks ────────────────────────────────────────────────────────────────

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  // Mark the currently-displayed recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.isBookmarked = true;

  persistedBookmarks();
};

export const removeBookmark = function (id) {
  // Remove bookmark
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.isBookmarked = false;

  persistedBookmarks();
};

// ─── Add Recipe ───────────────────────────────────────────────────────────────

/**
 * Transforms the raw form data object, validates ingredient format,
 * POSTs to the API, then saves the new recipe as a bookmark automatically.
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    // Pull only the ingredient-* fields that have a value
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format!: Quantity, Unit, Description',
          );

        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null, // coerce to number or null
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);

    // Auto-bookmark the user's own recipe
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// ─── Init ─────────────────────────────────────────────────────────────────────
// Runs once when the module is first imported.
// Restores bookmarks from localStorage so they survive page refreshes.
const initBookmarks = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

initBookmarks();

const clearBookmarks = function () {
  localStorage.clear();
};
// clearBookmarks();
