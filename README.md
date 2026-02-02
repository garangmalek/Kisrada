# 🍳 Kisrada - Recipe Search Application

A modern, responsive recipe search application that allows users to search, view, bookmark, and add their own recipes from a database of over 1,000,000 recipes.

![Kisrada App](https://img.shields.io/badge/status-active-success.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Color Palette](#color-palette)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## ✨ Features

- 🔍 **Search Recipes** - Search from over 1,000,000 recipes
- 📖 **Recipe Details** - View detailed cooking instructions, ingredients, and prep time
- 🔖 **Bookmarks** - Save your favorite recipes for quick access
- ➕ **Add Recipes** - Upload your own custom recipes
- 📊 **Servings Adjustment** - Dynamically adjust ingredient quantities based on servings
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ♿ **Accessible** - WCAG AA compliant with proper semantic HTML and ARIA labels
- 🎨 **Modern UI** - Clean, fresh design with professional green color palette

## 🎯 Demo

[Live Demo](#) <!-- Add your live demo link here -->

## 🛠️ Technologies

### Frontend
- **HTML5** - Semantic markup with accessibility features
- **SCSS/Sass** - Modular, maintainable styling
- **JavaScript (ES6+)** - Modern JavaScript with modules
- **CSS Grid & Flexbox** - Responsive layouts

### Design
- **Fresh & Healthy Color Palette** - Professional greens and natural tones
- **Nunito Sans** - Clean, modern typography
- **SVG Icons** - Scalable, crisp icons

### Architecture
- **MVC Pattern** - Model-View-Controller architecture
- **Component-Based** - Modular SCSS structure
- **Semantic HTML** - Modern HTML5 elements (`<header>`, `<main>`, `<aside>`, `<dialog>`)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/garangmalek/Kisrada.git
   cd kisrada
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Open in browser**
   ```
   Navigate to http://localhost:1234
   ```

## 📁 Project Structure

```
kisrada/
├── src/
│   ├── js/
│   │   ├── controller.js      # Main application controller
│   │   ├── model.js            # Data management
│   │   └── views/              # View components
│   ├── sass/
│   │   ├── _base.scss          # Base styles & variables
│   │   ├── _components.scss    # Reusable components
│   │   ├── _header.scss        # Header styles
│   │   ├── _recipe.scss        # Recipe detail styles
│   │   ├── _searchResults.scss # Search results styles
│   │   ├── _preview.scss       # Recipe preview cards
│   │   ├── _upload.scss        # Upload modal styles
│   │   └── main.scss           # Main SCSS entry point
│   ├── img/
│   │   ├── logo.png
│   │   ├── favicon.png
│   │   └── icons.svg
│   └── index.html              # Main HTML file
├── package.json
├── .gitignore
├── COLOR_GUIDE.md              # Color palette documentation
└── README.md
```

## 🎨 Color Palette

The app uses a modern **Fresh & Healthy Professional** color scheme:

### Primary Colors
- **Primary Green**: `#2d9f5d` - Main accent color
- **Light Mint**: `#6bcf9f` - Gradient start
- **Forest Green**: `#2d9f5d` - Gradient end

### Backgrounds
- **Light Background**: `#f7faf8` - Subtle mint tint
- **Surface**: `#e8f3ed` - Light green-tinted
- **Placeholder**: `#b8c9c0` - Muted sage

### Text
- **Primary Text**: `#2c3e35` - Deep charcoal green
- **Secondary Text**: `#5a6d62` - Medium gray-green

> See [COLOR_GUIDE.md](COLOR_GUIDE.md) for detailed color usage guidelines.

## 💻 Usage

### Searching for Recipes

1. Enter a recipe name or ingredient in the search bar
2. Click the search button or press Enter
3. Browse through the search results
4. Click on a recipe to view full details

### Viewing Recipe Details

- See cooking time and servings
- Adjust servings using the +/- buttons
- View complete ingredient list with measurements
- Access original recipe source

### Bookmarking Recipes

1. Click the bookmark icon on any recipe
2. Access bookmarks from the bookmarks dropdown
3. Click a bookmark to quickly view that recipe

### Adding Your Own Recipe

1. Click "Add Recipe" button
2. Fill in recipe details:
   - Title, URL, Image URL, Publisher
   - Prep time and servings
   - Up to 6 ingredients (Format: Quantity,Unit,Description)
3. Click "Upload" to save

## 🔌 API Reference

This app uses the [Forkify API](https://forkify-api.herokuapp.com/v2) for recipe data.

### Endpoints

```javascript
// Search recipes
GET https://forkify-api.herokuapp.com/v2/recipes?search={query}

// Get recipe details
GET https://forkify-api.herokuapp.com/v2/recipes/{id}

// Upload recipe (requires API key)
POST https://forkify-api.herokuapp.com/v2/recipes
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow semantic HTML practices
- Use BEM naming convention for CSS classes
- Maintain WCAG AA accessibility standards
- Write clean, commented code
- Test on multiple browsers and devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original design inspiration from Jonas Schmedtmann's Forkify project
- Recipe data provided by [Forkify API](https://forkify-api.herokuapp.com/)
- Icons from custom SVG icon set
- Font: [Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans) by Google Fonts

## 📧 Contact

Garang Malek - [@OkGarang](https://twitter.com/OkGarang) - garangmalekgom@gmail.com

Project Link: [https://github.com/garangmalek/Kisrada](https://github.com/garangmalek/Kisrada)

---

⭐ If you found this project helpful, please give it a star!

**Note**: This project is for educational and portfolio purposes. Please don't use it to teach or claim as your own work.
