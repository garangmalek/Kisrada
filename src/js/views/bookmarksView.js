import View from './View.js';
import previewView from './previewView.js';

/**
 * BookmarksView - renders saved recipes in the header dropdown.
 *
 * Structurally identical to ResultsView; it just targets a different
 * _parentElement and has a friendlier empty-state message.
 */
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  /**
   * Loads bookmarks from localStorage on page load so they survive refreshes.
   * The 'load' event fires after the DOM and all deferred scripts are ready.
   * @param handler
   */
  addHandlerUpdate(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
