import View from './View.js';

/**
 * AddRecipeView - manages the "Add Recipe" modal window.
 *
 * The modal is controlled purely by toggling CSS classes ('hidden') on the
 * overlay and window elements - no display:none is set in JS so CSS
 * transitions can fire.
 *
 * Note: the constructor wires up the open/close buttons immediately.
 * This is safe because 'new AddRecipeView()' only runs after the DOM is ready
 * (it's called at module evaluation time, which parcel delays until DOMContentLoaded).
 */
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded!';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  // ─── Modal open/close ─────────────────────────────────────────────────────

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerCloseWindow() {
    // Close on X button click or click anywhere on the dimmed overlay
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // ─── Publisher ────────────────────────────────────────────────────────────

  /**
   * Collects all form fields via the FormData API, converts to a plain object,
   * and hands it to the controller.
   * Using FormData means we don't have to manually querySelector every field.
   * @param handler
   */
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      // Spread FormData into an array of [name, value] pairs, then convert
      const data = Object.fromEntries([...new FormData(this)]);
      handler(data);
    });
  }

  // AddRecipeView never re-renders itself, so _generateMarkup is a no-op.
  // The form HTML lives in index.html and is only shown/hidden
  _generateMarkup() {}
}

export default new AddRecipeView();
