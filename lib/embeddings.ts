import { embed, embedMany } from "ai"
import { openai } from "@ai-sdk/openai"

const embeddingModel = openai.embedding("text-embedding-3-small")

export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  })
  return embedding
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: texts,
  })
  return embeddings
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

export function findMostSimilar(
  queryEmbedding: number[],
  embeddings: { id: number; embedding: number[]; content: string }[],
  topK = 5,
): { id: number; content: string; similarity: number }[] {
  return embeddings
    .map((item) => ({
      id: item.id,
      content: item.content,
      similarity: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
}
