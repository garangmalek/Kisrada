// Parcel turns this SVG import into a URL string at build time
import icons from 'url:../../img/icons.svg';

/**
 * Abstract base View class.
 *
 * Every concrete view (RecipeView, ResultsView, etc.) extends this.
 * It provides:
 *   • render()        – full DOM replacement
 *   • update()        – surgical DOM diff (no flicker on small changes)
 *   • renderSpinner() – loading state
 *   • renderError()   – error state
 *   • renderMessage() – success/info state
 *
 * Subclasses MUST define:
 *   • _parentElement  – the DOM node this view controls
 *   • _generateMarkup() – returns an HTML string for the current _data
 *
 * Subclasses SHOULD define:
 *   • _errorMessage   – default text shown by renderError()
 *   • _message        – default text shown by renderMessage()
 */
export default class View {
  _data; // the processed data passed in by the controller

  /**
   * Renders the view into _parentElement.
   *
   * @param {object|object[]} data The data to visualise.
   * @param {boolean} [render=true] Pass `false` to get the markup string
   *     back instead of inserting it into the DOM (used by PreviewView to
   *   compose markup inside ResultView / BookmarksView).
   * @returns {string|undefined}
   */
  render(data, render = true) {
    // Guard: empty data → show error state instead of a blank view
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    // "Dry run" mode: just return the HTML string, don't touch the DOM
    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Efficient DOM diffing update — only changes text content and attributes
   * that actually differ, avoiding a full re-render and the scroll-jump /
   * input-focus loss that comes with it.
   *
   * Used by recipeView when the user changes servings (quantities change but
   * the rest of the recipe markup stays the same).
   * @param data
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // Parse the new markup into a detached DOM tree (never inserted into page)
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (!curEl) return; // safety check for mismatched node counts

      // 1). Update TEXT NODES that differ
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // 2). Updates ATTRIBUTES that differ (e.g., data-update-to, href, class)
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value),
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
