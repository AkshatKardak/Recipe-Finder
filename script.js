
window.onload = () => {
  loadAreas();
  loadCategories();
  loadFavorites();
};

function loadAreas() {
  fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    .then(res => res.json())
    .then(data => {
      const areaSelect = document.getElementById("area-select");
      data.meals.forEach(area => {
        const option = document.createElement("option");
        option.value = area.strArea;
        option.text = area.strArea;
        areaSelect.appendChild(option);
      });
    });
}


function loadCategories() {
  fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
    .then(res => res.json())
    .then(data => {
      const categorySelect = document.getElementById("category-select");
      data.meals.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.strCategory;
        option.text = cat.strCategory;
        categorySelect.appendChild(option);
      });
    });
}

function searchRecipe() {
  const query = document.getElementById("search-input").value.trim();
  const area = document.getElementById("area-select").value;
  const category = document.getElementById("category-select").value;

  let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";

      if (!data.meals) {
        resultsDiv.innerHTML = "No recipes found.";
        return;
      }

      const filtered = data.meals.filter(meal => {
        return (!area || meal.strArea === area) &&
               (!category || meal.strCategory === category);
      });

      if (filtered.length === 0) {
        resultsDiv.innerHTML = "No recipes match selected filters.";
        return;
      }

      filtered.forEach(meal => {
        const card = document.createElement("div");
        card.className = "recipe";
        card.innerHTML = `
          <h3>${meal.strMeal}</h3>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <p>Area: ${meal.strArea}</p>
          <p>Category: ${meal.strCategory}</p>
          <a href="${meal.strYoutube}" target="_blank">Watch Recipe ▶</a><br>
          <button onclick='addToFavorites(${JSON.stringify(meal)})'>Add to Favorites</button>
        `;
        resultsDiv.appendChild(card);
      });
    });
}

function addToFavorites(meal) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.find(fav => fav.idMeal === meal.idMeal)) {
    favorites.push(meal);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites();
  }
}

function loadFavorites() {
  const favoritesDiv = document.getElementById("favorites");
  favoritesDiv.innerHTML = "";
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites.forEach(meal => {
    const card = document.createElement("div");
    card.className = "recipe";
    card.innerHTML = `
      <h3>${meal.strMeal}</h3>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <a href="${meal.strYoutube}" target="_blank">Watch Recipe ▶</a><br>
      <button onclick='removeFromFavorites("${meal.idMeal}")'>Remove</button>
    `;
    favoritesDiv.appendChild(card);
  });
}

function removeFromFavorites(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(meal => meal.idMeal !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadFavorites();
}

