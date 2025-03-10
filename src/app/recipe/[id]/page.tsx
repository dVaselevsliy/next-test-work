// app/recipe/[id]/page.tsx

import { notFound } from "next/navigation";

const fetchRecipe = async (id: string) => {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status}`);
  }
  const data = await res.json();
  return data.meals[0] || null;
};

export async function generateStaticParams() {
  const recipes = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    .then((res) => res.json())
    .then((data) => data.meals || []);

  return recipes.map((recipe: any) => ({
    id: recipe.idMeal,
  }));
}

interface RecipePageProps {
  params: { id: string };
}

const RecipePage = async ({ params }: RecipePageProps) => {
  const { id } = params;

  const recipe = await fetchRecipe(id);
  
  if (!recipe) {
    return notFound();
  }

  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`] && recipe[`strMeasure${i}`]) {
      ingredients.push(`${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`);
    }
  }

  return (
    <div className="recipe-page">
      <button className="button-back">
        <a className="link-back" href="/">Back</a>
      </button>

      <h2 className="recipe-name">{recipe.strMeal}</h2>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} width={200} />
    
      <div className="recipe-info">
        <h3>{recipe.strCategory}</h3>
        <h4>{recipe.strArea}</h4>
        <p className="recipe-description">{recipe.strInstructions}</p>

        <div className="recipe-ingredients">
          <h4>Ingredients:</h4>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        
        {recipe.strTags && (
          <div className="recipe-link">
            <h4>Tags:</h4>
            <p>{recipe.strTags}</p>
          </div>
        )}

        {recipe.strYoutube && (
          <div className="recipe-link">
            <h4>Watch the recipe on YouTube:</h4>
            <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer">
              {recipe.strYoutube}
            </a>
          </div>
        )}

        {recipe.strSource && (
          <div className="recipe-link">
            <h4>Recipe Source:</h4>
            <a href={recipe.strSource} target="_blank" rel="noopener noreferrer">
              {recipe.strSource}
            </a>
          </div>
        )}

        {recipe.strCreativeCommonsConfirmed && (
          <div className="recipe-link">
            <h4>Creative Commons License:</h4>
            <p>{recipe.strCreativeCommonsConfirmed}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage;
