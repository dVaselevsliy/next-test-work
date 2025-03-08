'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader } from "./components/Loader";

type Recipe = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  ingredients: string[]
};

type RecipesData = {
  meals: Recipe[];
};

type Category = {
  strCategory: string;
};

export default function Home() {
  const [recipes, setRecipes] = useState<RecipesData>({ meals: [] });
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState("");
  const [chosenRecipes, setChosenRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const itemsPerRow = 3;
  const rowsPerPage = 2;
  const itemsPerPage = itemsPerRow * rowsPerPage;

  const fetchRecipes = async (searchQuery: string = "", category: string | null = null) => {
    try {
      let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`;
      if (category) url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

      const response = await fetch(url);
      const data: RecipesData = await response.json();
      return data.meals ? data : { meals: [] };
    } catch (error) {
      console.error("Recipe loading error:", error);
      return { meals: [] };
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
      const data = await response.json();
      return data.categories ? data.categories.map((c: Category) => c.strCategory) : [];
    } catch (error) {
      console.error("Category loading error:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true)
    const delayDebounce = setTimeout(() => {
      fetchRecipes(query, activeCategory)
        .then(setRecipes)
        .catch(() => setErrorMessage('Loading error'))
        .finally(() => setLoading(false))
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, activeCategory]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedRecipes = recipes.meals.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(recipes.meals.length / itemsPerPage);
  const totalPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

  const toggleSelectRecipe = (recipe: Recipe) => {
    setChosenRecipes(prev => {
      if (prev.some(r => r.idMeal === recipe.idMeal)) {
        return prev.filter(r => r.idMeal !== recipe.idMeal)
      }
      return [...prev, recipe]
    })
  }

  const saveChosenRecipes = () => {
    localStorage.setItem("chosenRecipes", JSON.stringify(chosenRecipes));
  };

  return (
    <>
      <div className="flex">
        <div className="input-container">
          <label className="label" htmlFor="input">Search recipe:</label>
          <input
            className="input"
            id="input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Enter recipe name"
            type="text"
          />
        </div>
        <div className="button-container">
          <Link href="/ingradients">
            <button className="ingradients-link" onClick={saveChosenRecipes}>Selected Ingredients</button>
          </Link>
          <select className="select" value={activeCategory || ""} onChange={(event) => setActiveCategory(event.target.value || null)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-center">
        {loading && (
          <Loader />
        )}
      </div>

      {errorMessage && (
        <h2>{errorMessage}</h2>
      )}

      <div className="container">
        {selectedRecipes.map((recipe) => (
          <div key={recipe.idMeal} className="block">
            <img src={recipe.strMealThumb} alt={`${recipe.strMeal} img`} width={200} />
            <Link className="recipes-link" href={`/recipe/${recipe.idMeal}`}>
              <h2>{recipe.strMeal}</h2>
            </Link>
            {recipe.strCategory && <h3>{recipe.strCategory}</h3>}
            {recipe.strArea && <h3>{recipe.strArea}</h3>}
            <button className="ingradients-add" onClick={() => toggleSelectRecipe(recipe)}>{chosenRecipes.includes(recipe) ? 'Drop' : 'Add'}</button>
          </div>
        ))}
      </div>

      {recipes.meals.length >= 6 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            <Image src="/back.png" alt="Arrow" width={10} height={10} />
          </button>
          <div className="page-button">
            {totalPagesArray.map((pageNumber) => (
              <button
                className={currentPage === pageNumber ? 'active' : ''}
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}>
                {pageNumber}
              </button>
            ))}

            {totalPages >= 10 && <button>...</button>}
          </div>

          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
            <Image src="/next.png" alt="Arrow" width={10} height={10} />
          </button>
        </div>
      )}
    </>
  );
}
