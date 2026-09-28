import type { Post } from "../dto/post.js"

const posts: Post[] = [
  {
    id: 1,
    title: "Як вивчати JavaScript?",
    content: "Поради для початківців у JavaScript.",
    author: "Anna",
    category: "programming",
  },
  {
    id: 2,
    title: "Що таке Node.js?",
    content: "Node.js дозволяє запускати JavaScript на сервері.",
    author: "Alex",
    category: "programming",
  },
  {
    id: 3,
    title: "Моя улюблена гра",
    content: "Розповідь про мою улюблену гру.",
    author: "Max",
    category: "games",
  },
  {
    id: 4,
    title: "Подорож до Києва",
    content: "Цікаві місця, які варто відвідати.",
    author: "Sofia",
    category: "travel",
  },
  {
    id: 5,
    title: "Корисні технології",
    content: "Технології, які використовують щодня.",
    author: "Anna",
    category: "technology",
  },
]

export function getAll(
  category?: string,
  take?: number,
): Post[] {
  let result = [...posts]

  if (category) {
    result = result.filter((post) => post.category === category)
  }

  if (take !== undefined) {
    result = result.slice(0, take)
  }

  return result
}

export function getById(id: number): Post | undefined {
  return posts.find((post) => post.id === id)
}

export function addPost(newPost: Post): Promise<Post> {
  return new Promise((resolve) => {
    posts.push(newPost)
    resolve(newPost)
  })
}