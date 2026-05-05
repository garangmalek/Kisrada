import View from './View.js';
import icons from 'url:../../img/icons.svg';

/**
 * PreviewView - generates the markup for a single recipe card.
 *
 * This view is never rendered directly into a parent element of its own.
 * Instead it's called with render(data, false) so it just returns an HTML
 * string, which ResultsView and BookmarksView compose together.
 *
 * That's why _parentElement is null — it only exists to satisfy the base class.
 */
class previewView extends View {
  _parentElement = null;

  _generateMarkup() {
    // Highlight the card whose id matches the current URL hash
    const id = window.location.hash.slice(1);

    return `
      <li class="preview">
        <a class="preview__link ${this._data.id === id ? 'preview__link--active' : ''}" href="#${this._data.id}">
          <figure class="preview__fig">
            <img src="${this._data.image}" alt="${this._data.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${this._data.title}</h4>
            <p class="preview__publisher">${this._data.publisher}</p>
            <!-- Badge shown only for the user's own uploaded recipes -->
            <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }
}

export default new previewView();
