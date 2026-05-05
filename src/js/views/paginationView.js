import View from './View.js';
import icons from 'url:../../img/icons.svg';

/**
 * PaginationView - renders the previous/next page buttons below search results.
 *
 * It receives the full state.search object (not just the current page slice)
 * so it can calculate total pages and decide which buttons to show.
 */
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // ─── Publisher ────────────────────────────────────────────────────────────

  /**
   * Event delegation: one listener on the pagination container catches clicks
   * on either button. The target page number is stored in data-goto so the
   * markup drives the logic, not hardcoded if/else in JS.
   * @param handler
   */
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto; // dataset values are always strings
      handler(goToPage);
    });
  }

  // ─── Markup ───────────────────────────────────────────────────────────────

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );

    const prevBtn = `
      <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
    `;

    const nextBtn = `
      <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;

    // Only 1 page → no pagination needed
    if (numPages === 1) return '';

    // First page → only show Next
    if (curPage === 1) return nextBtn;

    // Last page → only show Prev
    if (curPage === numPages) return prevBtn;

    // Middle page → show both
    return `${prevBtn}${nextBtn}`;
  }
}

export default new PaginationView();
