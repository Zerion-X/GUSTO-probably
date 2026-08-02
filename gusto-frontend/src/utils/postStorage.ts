import { getCurrentUser } from "./userStorage";

export interface RecipePost {
  id: number;
  author: string;
  title: string;
  description: string;
  steps: string[];
  image: string;
  createdAt: string;
  likes: number;
  saves: number;
}

const STORAGE_KEY = "gusto-posts";
const NEXT_ID_KEY = "gusto-next-post-id";

function getNextPostId(): number {
  const stored = localStorage.getItem(NEXT_ID_KEY);

  if (!stored) {
    localStorage.setItem(NEXT_ID_KEY, "2");
    return 1;
  }

  const nextId = Number(stored);

  localStorage.setItem(NEXT_ID_KEY, String(nextId + 1));

  return nextId;
}

function normalizePost(post: RecipePost): RecipePost {
  return {
    ...post,
    likes: post.likes ?? 0,
    saves: post.saves ?? 0,
  };
}

export function getPostById(
  id: string | number | undefined,
): RecipePost | undefined {
  return getPosts().find((post) => post.id === Number(id));
}

export function getPosts(): RecipePost[] {
  const posts = localStorage.getItem(STORAGE_KEY);

  if (!posts) {
    return [];
  }

  try {
    const parsed = JSON.parse(posts) as RecipePost[];

    return parsed.map(normalizePost);
  } catch {
    return [];
  }
}

function savePosts(posts: RecipePost[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error("Failed to save posts:", error);
    throw new Error(
      "Could not save the post. The omage may be too large for localStorage."
    );
  }
 
}

export function addPost(
  post: Omit<RecipePost, "id" | "author" | "createdAt" | "likes" | "saves">,
): RecipePost | undefined {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return undefined;
  }

  const posts = getPosts();
  const createdAt = new Date().toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const newPost: RecipePost = {
    id: getNextPostId(),
    author: currentUser.username,
    createdAt,
    likes: 0,
    saves: 0,
    ...post,
  };

  posts.unshift(newPost);
  savePosts(posts);

  window.dispatchEvent(new Event("gusto-posts-changed"));

  return newPost;
}

export function updatePostInteraction(
  postId: number,
  field: "likes" | "saves",
  delta: number,
): RecipePost | undefined {
  const posts = getPosts();
  const targetIndex = posts.findIndex((post) => post.id === postId);

  if (targetIndex === -1) {
    return undefined;
  }

  const updatedPost = {
    ...posts[targetIndex],
    [field]: Math.max(0, posts[targetIndex][field] + delta),
  } as RecipePost;

  posts[targetIndex] = updatedPost;
  savePosts(posts);
  window.dispatchEvent(new Event("gusto-posts-changed"));

  return updatedPost;
}

export function getPostsByUser(username: string) {
  return getPosts().filter((post) => post.author === username);
}

export function updatePost(
  postId: number,
  updatedFields: Partial<Omit<RecipePost, "id" | "author" | "createdAt" | "likes" | "saves">>,
): RecipePost | undefined {
  const posts = getPosts();
  const targetIndex = posts.findIndex((post) => post.id === postId);
  if (targetIndex === -1) {
    return undefined;
  }
  const updatedPost = {
    ...posts[targetIndex],
    ...updatedFields,
  } as RecipePost;
  posts[targetIndex] = updatedPost;
  savePosts(posts);
  window.dispatchEvent(new Event("gusto-posts-changed"));
  return updatedPost;
}

export function deletePost(postId: number): boolean {
  const posts = getPosts();
  const filtered = posts.filter((post) => post.id !== postId);

  if (filtered.length === posts.length) {
    return false;
  }

  savePosts(filtered);
  window.dispatchEvent(new Event("gusto-posts-changed"));
  return true;
}
