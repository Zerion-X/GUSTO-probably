import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Clock3, ChefHat, Heart, Bookmark } from "lucide-react";
import { getRecipeById } from "../data/recipes";
import { getPostById } from "../utils/postStorage";
import AnimatedBackground from "../components/Layout/AnimatedBackground";

export default function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isPostView =
    new URLSearchParams(location.search).get("type") === "post";
  const recipe = !isPostView ? getRecipeById(id) : undefined;
  const post = getPostById(id);

  const item = recipe ?? post;

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8EA] px-6 text-center">
        <div className="rounded-[28px] border border-white/40 bg-white/50 p-10 shadow-2xl backdrop-blur-xl">
          <h1 className="mb-3 text-3xl text-[#3A2419]">Recipe not found</h1>
          <p className="mb-6 text-[#8B5A3C]">
            This recipe may have been removed or the link is invalid.
          </p>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="rounded-full bg-[#C47A2C] px-5 py-2 font-medium text-white transition hover:bg-[#a95f14]"
          >
            Back to Kitchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF8EA]">
      <AnimatedBackground />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="flex w-fit items-center gap-2 rounded-full border border-[#C47A2C]/30 bg-white/70 px-4 py-2 text-[#8B5A3C] transition hover:bg-white"
        >
          <ArrowLeft size={18} />
          Back to recipes
        </button>

        <section className="overflow-hidden rounded-[32px] border border-white/40 bg-white/50 shadow-2xl backdrop-blur-xl">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative h-80 lg:h-full">
              <img
                src={item.image}
                alt={"name" in item ? item.name : item.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur">
                  {"difficulty" in item
                    ? `${item.difficulty} • ${item.time}`
                    : "Community Recipe"}
                </p>
                <h1
                  className="text-4xl text-white drop-shadow-lg sm:text-5xl"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {"name" in item ? item.name : item.title}
                </h1>
              </div>
            </div>

            <div className="p-8 lg:p-10">
              <p className="text-lg leading-8 text-[#8B5A3C]">
                {item.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 rounded-full bg-[#FFF3E3] px-4 py-2 text-[#C47A2C]">
                  <Heart size={18} fill="currentColor" />
                  <span>{"likes" in item ? item.likes : 0}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-[#FFF3E3] px-4 py-2 text-[#C47A2C]">
                  <Bookmark size={18} fill="currentColor" />
                  <span>{"saves" in item ? item.saves : 0}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-[#FFF3E3] px-4 py-2 text-[#C47A2C]">
                  <ChefHat size={18} />
                  <span>
                    {"author" in item ? item.author : "Gusto Kitchen"}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-[#FFF3E3] px-4 py-2 text-[#C47A2C]">
                  <Clock3 size={18} />
                  <span>
                    {"time" in item ? `${item.time}` : "Community Recipe"}
                  </span>
                </div>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-3 text-2xl text-[#3A2419]">Ingredients</h2>
                  <ul className="space-y-2 text-[#8B5A3C]">
                    {"ingredients" in item ? (
                      <ul>
                        {item.ingredients.map((ingredient) => (
                          <li
                            key={ingredient}
                            className="flex items-start gap-2"
                          >
                            <span className="mt-2 h-2 w-2 rounded-full bg-[#C47A2C]" />
                            <span>{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[#8B5A3C]">No ingredients provided.</p>
                    )}
                  </ul>
                </div>

                <div>
                  <h2 className="mb-3 text-2xl text-[#3A2419]">Steps</h2>
                  <ol className="space-y-3 text-[#8B5A3C]">
                    {item.steps.map((step, index) => (
                      <li key={step} className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C47A2C] text-sm font-semibold text-white">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
