/**
 * SearchView — manages the search form in the header.
 *
 * This view is intentionally simple: it reads a value and listens for submits.
 * It does NOT extend View because it never renders any data-driven markup —
 * the form is static HTML; we only interact with the input field.
 */
class SearchView {
  _parentEl = document.querySelector('.search');

  /** Returns the current value of the search field and clears it afterwards. */
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    return (this._parentEl.querySelector('.search__field').value = '');
  }

  // ─── Publisher ────────────────────────────────────────────────────────────

  /**
   * Attaches a submit listener to the form.
   * preventDefault() stops the browser from reloading the page.
   * The handler is supplied by the controller (controlSearchResults).
   * @param handler
   */
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
