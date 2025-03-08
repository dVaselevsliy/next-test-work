'use client'

import Link from "next/link";
import { useEffect, useState } from "react";


export default function IngredientsPage() {
  const [chosenRecipes, setChosenRecipes] = useState([]);

  useEffect(() => {
    const selectedRecipesData = localStorage.getItem('chosenRecipes');
    if (selectedRecipesData) {
      const recipes = JSON.parse(selectedRecipesData);

      const recipesWithIngredients = recipes.map((recipe: any) => {
        const ingredients = [
          recipe.strIngredient1,
          recipe.strIngredient2,
          recipe.strIngredient3,
          recipe.strIngredient4,
          recipe.strIngredient5,
          recipe.strIngredient6,
          recipe.strIngredient7,
          recipe.strIngredient8,
          recipe.strIngredient9,
          recipe.strIngredient10,
          recipe.strIngredient11,
          recipe.strIngredient12,
          recipe.strIngredient13,
          recipe.strIngredient14,
          recipe.strIngredient15,
          recipe.strIngredient16,
          recipe.strIngredient17,
          recipe.strIngredient18,
          recipe.strIngredient19,
          recipe.strIngredient20,
        ]

        const filteredIngredients = ingredients.filter(ingredient => ingredient && ingredient.trim() !== "");

        return {
          ...recipe,
          ingredients: filteredIngredients
        };
      });

      setChosenRecipes(recipesWithIngredients);
    }
  }, []);

  console.log(localStorage.getItem('chosenRecipes'));

  const getAllIngredients = () => {
    const allIngredients = chosenRecipes.flatMap(recipe => recipe.ingredients);
    return allIngredients;
  };

  return (
    <div>
      <button className='button-back'>
        <a className='link-back' href="/">Back</a>
      </button>
      <h2 className="ingredients-title">Ingredients list</h2>
      {chosenRecipes.length === 0 ? (
        <p className="recipes-no">No recipes selected</p>
      ) : (
          <div className="ingredients-content">
            <div className="container-ingredients">
            {chosenRecipes.map((recipe) => (
              <div key={recipe.idMeal} className="block">
                <img src={recipe.strMealThumb} alt={`${recipe.strMeal} img`} width={200} />
                <Link href={`/recipe/${recipe.idMeal}`}>
                  <h2>{recipe.strMeal}</h2>
                </Link>
                {recipe.strCategory && <h3>{recipe.strCategory}</h3>}
                {recipe.strArea && <h3>{recipe.strArea}</h3>}
              </div>
            ))}
            </div>
            <ul className="ingredients-list">
              <h2>
                All selected ingredients
              </h2>
              {getAllIngredients().map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
      )}
    </div>
  )
}
