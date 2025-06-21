// hooks/useKnowledgeData.ts
import useSWR from "swr"
import axios from "axios" // axios をインポート

// axiosを使ったfetcher関数
const fetcher = (url: string) => axios.get(url).then(res => res.data)

export interface KnowledgeItem {
  userId: string
  title: string
  description: string
  author: string
  date: string
  tags: string[]
}

export const useKnowledgeData = () => {
  const { data, error, isLoading } = useSWR<KnowledgeItem[]>("https://m6ld96ezo0.execute-api.ap-northeast-1.amazonaws.com/prod/test", fetcher)

  return {
    knowledgeData: data ?? [],
    isLoading,
    isError: !!error,
  }
}
