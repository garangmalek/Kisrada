import View from './View.js';
import icons from 'url:../../img/icons.svg';
import Fraction from 'fraction.js';

// fractional converts decimal quantities (e.g., 0.5) → readable fractions ("1/2")
// Install with: npm install fractional

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'No recipe found. Please try another one!';
  _message = '';

  // ─── Publisher ────────────────────────────────────────────────────────────

  /**
   * Listens for both 'hashchange' (user clicks a result link) and
   * 'load' (page first opens with a hash already in the URL).
   * @param handler
   */
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler),
    );
  }

  /**
   * Uses event delegation on the whole recipe section.
   * Only the buttons with class .btn--update-servings carry a data-update-to attribute,
   * so we can safely ignore all other clicks.
   * @param handler
   */
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;

      const { updateTo } = btn.dataset;
      // Guard against going below 1 serving
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn-bookmark');
      if (!btn) return;
      handler();
    });
  }

  // ─── Markup ───────────────────────────────────────────────────────────────

  _generateMarkup() {
    return `
      <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
          <!-- data-update-to drives the controlServings handler -->
            <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <!-- Only show the "user" badge for recipes uploaded via the API key -->
        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        
        <!-- Bookmark icon fills when already bookmarked -->
        <button class="btn--round btn-bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${this._data.isBookmarked ? '-fill' : ''}"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="src/img/icons.svg#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }

  /**
   * Generates markup for a single ingredient list item.
   * Defined as a separate method (not an arrow function on the class) so it
   * can be passed directly to .map() without losing `this` binding issues.
   * @param ing
   * @returns {string}
   * @private
   */
  _generateMarkupIngredient(ing) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${ing.quantity ? new Fraction(ing.quantity).toFraction(true) : ''}</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>
    `;
  }
}

// Export a single instance - every import gets the same object (Singleton)
export default new RecipeView();
