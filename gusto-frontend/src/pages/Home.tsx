import AnimatedBackground from "../components/Layout/AnimatedBackground";
import RecipeCard, {type RecipeCardProps, } from "../components/Recipe/RecipeCard";
import img1 from "../assets/images (3).jpg";
import img2 from "../assets/images (1).jpg";
import img3 from "../assets/images (2).jpg";
import img4 from "../assets/images (4).jpg";
import img5 from "../assets/images (5).jpg";
import img6 from "../assets/images.jpg";

export default function Home() {
  const recipes: RecipeCardProps[] = [
    {
      id: 1,
      image: img1,
      name: "Classic Pizza",
      summary:
        "Traditional Italian pizza with mozzarella, basil and tomato sauce.",
      likes: 22,
      saves: 32,
    },
    {
      id: 2,
      image: img2,
      name: "Cheese Burger",
      summary:
        "Juicy homemade burger served with cheddar cheese and crispy fries.",
      likes: 41,
      saves: 36,
    },
    {
      id: 3,
      image: img3,
      name: "Creamy Pasta",
      summary:
        "Creamy Alfredo pasta with grilled chicken and parmesan.",
      likes: 51,
      saves: 19,
    },
    {
      id: 4,
      image: img6,
      name: "Pepperoni Pizza",
      summary:
        "A crispy pizza topped with pepperoni and mozzarella cheese.",
      likes: 64,
      saves: 28,
    },
    {
      id: 5,
      image: img4,
      name: "Double Burger",
      summary:
        "Two juicy beef patties with cheddar and caramelized onions.",
      likes: 38,
      saves: 15,
    },
    {
      id: 6,
      image: img5,
      name: "Carbonara",
      summary:
        "Classic Roman pasta with egg, pecorino and pancetta.",
      likes: 73,
      saves: 44,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF8EA]">
      <AnimatedBackground />

      <main className="relative z-10 mx-auto max-w-7xl px-8 py-12">
        <h1
          className="mb-10 text-6xl text-[#3A2419]"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Recipes
        </h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              {...recipe}
            />
          ))}
        </div>
      </main>
    </div>
  );
}