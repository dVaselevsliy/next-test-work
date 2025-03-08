export const fetchRecipes = async () => {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")

  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status}`);
  }

  return res.json()
}