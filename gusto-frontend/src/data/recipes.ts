import img1 from "../assets/images (3).jpg";
import img2 from "../assets/images (1).jpg";
import img3 from "../assets/images (2).jpg";
import img4 from "../assets/images (4).jpg";
import img5 from "../assets/images (5).jpg";
import img6 from "../assets/images.jpg";

export type Recipe = {
  id: number;
  image: string;
  name: string;
  summary: string;
  likes: number;
  saves: number;
  author: string;
  time: string;
  difficulty: string;
  description: string;
  ingredients: string[];
  steps: string[];
};

export const recipes: Recipe[] = [
  {
    id: 1,
    image: img1,
    name: "Classic Pizza",
    summary:
      "Traditional Italian pizza with mozzarella, basil and tomato sauce.",
    likes: 22,
    saves: 32,
    author: "Marta Rossi",
    time: "30 mins",
    difficulty: "Easy",
    description:
      "A comforting, crowd-pleasing pizza with a crisp crust and rich tomato flavor.",
    ingredients: [
      "2 cups pizza dough",
      "1/2 cup tomato sauce",
      "1 cup mozzarella",
      "Fresh basil leaves",
      "Olive oil",
    ],
    steps: [
      "Preheat the oven to 475°F and place a pizza stone or tray inside.",
      "Roll out the dough into a thin circle and spread the sauce evenly.",
      "Top with mozzarella and basil, then drizzle with olive oil.",
      "Bake for 10-12 minutes until the crust turns golden and crisp.",
    ],
  },
  {
    id: 2,
    image: img2,
    name: "Cheese Burger",
    summary:
      "Juicy homemade burger served with cheddar cheese and crispy fries.",
    likes: 41,
    saves: 36,
    author: "Jordan Lee",
    time: "25 mins",
    difficulty: "Easy",
    description:
      "A satisfying burger with a juicy center and a perfectly toasted bun.",
    ingredients: [
      "1 lb ground beef",
      "4 burger buns",
      "4 slices cheddar",
      "Lettuce",
      "Tomato slices",
      "Pickles",
    ],
    steps: [
      "Shape the beef into patties and season generously with salt and pepper.",
      "Cook the patties on a hot skillet for 3-4 minutes per side.",
      "Add cheddar during the final minute and toast the buns.",
      "Layer the burger with lettuce, tomato, pickles and serve warm.",
    ],
  },
  {
    id: 3,
    image: img3,
    name: "Creamy Pasta",
    summary: "Creamy Alfredo pasta with grilled chicken and parmesan.",
    likes: 51,
    saves: 19,
    author: "Nina Alvarez",
    time: "35 mins",
    difficulty: "Medium",
    description:
      "Silky pasta with a rich sauce and tender grilled chicken for a cozy dinner.",
    ingredients: [
      "8 oz fettuccine",
      "2 chicken breasts",
      "2 tbsp butter",
      "1 cup heavy cream",
      "1/2 cup parmesan",
      "Garlic",
    ],
    steps: [
      "Cook the pasta until al dente and reserve a little pasta water.",
      "Sear the chicken until cooked through, then slice it.",
      "Make the sauce with butter, garlic, cream and parmesan.",
      "Toss the pasta and chicken together, adding pasta water as needed.",
    ],
  },
  {
    id: 4,
    image: img6,
    name: "Pepperoni Pizza",
    summary: "A crispy pizza topped with pepperoni and mozzarella cheese.",
    likes: 64,
    saves: 28,
    author: "Luca Romano",
    time: "28 mins",
    difficulty: "Easy",
    description:
      "A classic slice with bold pepperoni flavor and a golden crust.",
    ingredients: [
      "1 pizza dough",
      "1/2 cup tomato sauce",
      "1 cup mozzarella",
      "Pepperoni slices",
      "Oregano",
    ],
    steps: [
      "Stretch out the dough and add the sauce in a thin layer.",
      "Scatter mozzarella over the base and add the pepperoni.",
      "Bake until the edges are crisp and the cheese is bubbling.",
      "Finish with oregano and serve immediately.",
    ],
  },
  {
    id: 5,
    image: img4,
    name: "Double Burger",
    summary: "Two juicy beef patties with cheddar and caramelized onions.",
    likes: 38,
    saves: 15,
    author: "Sam Carter",
    time: "20 mins",
    difficulty: "Easy",
    description: "A bold burger stacked high for a hearty lunch or dinner.",
    ingredients: [
      "2 beef patties",
      "2 slices cheddar",
      "2 buns",
      "Caramelized onions",
      "Lettuce",
    ],
    steps: [
      "Cook the patties until nicely browned and juicy.",
      "Add cheese during the last minute so it melts perfectly.",
      "Toast the buns and pile on the onions and lettuce.",
      "Stack the patties and serve with your favorite sauce.",
    ],
  },
  {
    id: 6,
    image: img5,
    name: "Carbonara",
    summary: "Classic Roman pasta with egg, pecorino and pancetta.",
    likes: 73,
    saves: 44,
    author: "Elena Bianchi",
    time: "25 mins",
    difficulty: "Medium",
    description:
      "A rich, silky pasta that feels elegant yet simple to make at home.",
    ingredients: [
      "8 oz spaghetti",
      "3 oz pancetta",
      "2 eggs",
      "1/2 cup pecorino",
      "Black pepper",
    ],
    steps: [
      "Boil the spaghetti until al dente and save a small amount of pasta water.",
      "Cook the pancetta until crisp and fragrant.",
      "Whisk the eggs, pecorino and pepper together.",
      "Toss everything quickly off the heat so the sauce becomes creamy.",
    ],
  },
];

export function getRecipeById(id: number | string | undefined) {
  return recipes.find((recipe) => recipe.id === Number(id));
}
