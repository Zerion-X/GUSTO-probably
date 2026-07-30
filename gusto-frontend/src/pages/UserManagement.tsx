import AnimatedBackground from "../components/Layout/AnimatedBackground";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileStat from "../components/Profile/ProfileStats";
import PostCard from "../components/Profile/ProfilePostCard";
import { type Post } from "../core/interfaces/Post";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/userStorage";

import { useParams } from "react-router-dom";

const posts: Post[] = [
  {
    id: 1,
    title: "Homemade Burger",
    description: "Best burger I've ever made.",
    likes: 42,
    comments: 12,
    createdAt: "2 days ago",
  },
  {
    id: 2,
    title: "Italian Pizza",
    description: "Fresh mozzarella and basil.",
    likes: 80,
    comments: 25,
    createdAt: "1 week ago",
  },
];

const stats = [
  {
    title: "Posts",
    value: 12,
  },
  {
    title: "Favorites",
    value: 8,
  },
  {
    title: "Saved Recipes",
    value: 31,
  },
];

export default function UserManagement() {
  const currentUser = getCurrentUser();
  const { username } = useParams();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!username || username !== currentUser.username) {
    return <Navigate to={`/profile/${currentUser.username}`} replace />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF8EA]">
      <AnimatedBackground />

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <ProfileHeader
          username={currentUser.username}
          email={currentUser.email}
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <ProfileStat
              key={stat.title}
              title={stat.title}
              value={stat.value}
            />
          ))}
        </div>

        <section className="mt-16">
          <h2
            className="mb-6 text-4xl text-[#3A2419]"
            style={{
              fontFamily: "Cormorant Garamond, serif",
            }}
          >
            My Posts
          </h2>

          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
