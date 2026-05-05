import View from './View.js';
import previewView from './previewView.js';

/**
 * ResultsView - renders the list of recipe previews cards in the sidebar.
 *
 * It delegates the per-card markup to PreviewView. by calling
 * previewView.render(result, false) — the `false` flag means "give me the
 * HTML string, don't insert anything into the DOM yet".
 * ResultsView then joins all the strings and inserts them at once.
 */
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please try again ;)';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
