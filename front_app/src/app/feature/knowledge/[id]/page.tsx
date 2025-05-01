"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Box, Typography, Button, Paper, IconButton, Chip, Divider, Avatar, Card, CardContent } from "@mui/material"
import {
  ArrowBack as ArrowBackIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

// ナレッジデータの型定義
interface KnowledgeItem {
  id: number
  title: string
  description: string
  author: string
  date: string
  tags: string[]
  content: string
}

// サンプルデータ（短縮版）
const knowledgeData: KnowledgeItem[] = [
  {
    id: 1,
    title: "Next.jsアプリケーションのデプロイ方法",
    description: "Vercelを使用したNext.jsアプリケーションのデプロイ手順について解説します。",
    author: "田中太郎",
    date: "2023-04-15",
    tags: ["Next.js", "Vercel", "デプロイ"],
    content: `
# Next.jsアプリケーションのデプロイ方法

Next.jsで開発したアプリケーションをVercelにデプロイする方法を解説します。Vercelは、Next.jsの開発元が提供するホスティングサービスで、Next.jsアプリケーションのデプロイに最適化されています。

## 準備

デプロイを始める前に、以下のものが必要です：

1. GitHubアカウント（またはGitLab、BitBucket）
2. Vercelアカウント
3. デプロイ準備の整ったNext.jsプロジェクト

## デプロイ手順

### 1. Vercelアカウントの作成

まだVercelアカウントをお持ちでない場合は、Vercel公式サイトにアクセスして、アカウントを作成します。GitHubアカウントでのサインアップが最も簡単です。

### 2. プロジェクトのインポート

1. Vercelダッシュボードにログインします。
2. 「New Project」ボタンをクリックします。
3. GitHubリポジトリを連携し、デプロイしたいリポジトリを選択します。
4. 必要に応じて環境変数を設定します。
5. 「Deploy」ボタンをクリックしてデプロイを開始します。
    `,
  },
  {
    id: 2,
    title: "TypeScriptの基本的な型定義",
    description: "TypeScriptで使用される基本的な型定義とその使い方について説明します。",
    author: "鈴木花子",
    date: "2023-04-10",
    tags: ["TypeScript", "プログラミング", "型定義"],
    content: `
# TypeScriptの基本的な型定義

TypeScriptは、JavaScriptに静的型付けを追加した言語です。型定義を使用することで、コードの品質向上、バグの早期発見、IDEのサポート強化などのメリットがあります。

## プリミティブ型

TypeScriptには、以下のようなプリミティブ型があります：

\`\`\`typescript
// 文字列
let name: string = "John";

// 数値
let age: number = 30;

// 真偽値
let isActive: boolean = true;
\`\`\`

## 配列

配列の型定義は以下のように行います：

\`\`\`typescript
// 文字列の配列
let names: string[] = ["John", "Jane", "Bob"];

// 別の書き方
let numbers: Array<number> = [1, 2, 3];
\`\`\`
    `,
  },
]

// MUIのカスタムテーマを作成
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9c27b0",
    },
    secondary: {
      main: "#3f51b5",
    },
    background: {
      default: "#0f172a",
      paper: "rgba(255, 255, 255, 0.1)",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        },
      },
    },
  },
})

export default function KnowledgeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [knowledge, setKnowledge] = useState<KnowledgeItem | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // IDに基づいてナレッジデータを取得
    const id = Number(params.id)
    const foundKnowledge = knowledgeData.find((item) => item.id === id)

    if (foundKnowledge) {
      setKnowledge(foundKnowledge)
    }

    setLoading(false)
  }, [params.id])

  const handleBackToList = () => {
    router.push("/list")
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    // 共有機能（実際の実装ではクリップボードにコピーなど）
    alert("共有機能は現在実装中です。")
  }

  const handleEdit = () => {
    // 編集機能（実際の実装では編集ページへ遷移）
    alert("編集機能は現在実装中です。")
  }

  // マークダウンのような内容をHTMLに変換する簡易関数
  const renderContent = (content: string) => {
    if (!content) return null

    // 行ごとに処理
    const lines = content.split("\n")

    return lines.map((line, index) => {
      // 見出し
      if (line.startsWith("# ")) {
        return (
          <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: 700 }} key={index}>
            {line.substring(2)}
          </Typography>
        )
      } else if (line.startsWith("## ")) {
        return (
          <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: 600 }} key={index}>
            {line.substring(3)}
          </Typography>
        )
      } else if (line.startsWith("### ")) {
        return (
          <Typography variant="h6" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }} key={index}>
            {line.substring(4)}
          </Typography>
        )
      }
      // コードブロック
      else if (line.startsWith("```") && !line.endsWith("```")) {
        // コードブロックの開始
        return null
      } else if (line.endsWith("```") && !line.startsWith("```")) {
        // コードブロックの終了
        return null
      } else if (line.startsWith("```") && line.endsWith("```")) {
        // 1行のコードブロック
        return (
          <Paper
            sx={{
              p: 2,
              my: 2,
              bgcolor: "rgba(0, 0, 0, 0.3)",
              borderRadius: 1,
              fontFamily: "monospace",
              fontSize: "0.9rem",
              overflowX: "auto",
            }}
            key={index}
          >
            {line.substring(3, line.length - 3)}
          </Paper>
        )
      }
      // 空行
      else if (line.trim() === "") {
        return <Box sx={{ height: "1rem" }} key={index} />
      }
      // 通常のテキスト
      else {
        return (
          <Typography variant="body1" sx={{ my: 1, lineHeight: 1.7 }} key={index}>
            {line}
          </Typography>
        )
      }
    })
  }

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f172a 0%, #4a1d96 50%, #0f172a 100%)",
            p: { xs: 2, md: 6 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            読み込み中...
          </Typography>
        </Box>
      </ThemeProvider>
    )
  }

  if (!knowledge) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f172a 0%, #4a1d96 50%, #0f172a 100%)",
            p: { xs: 2, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ color: "white", mb: 3 }}>
            指定されたナレッジが見つかりませんでした
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToList}
            sx={{
              background: "linear-gradient(90deg, #9c27b0 0%, #3f51b5 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(90deg, #7b1fa2 0%, #303f9f 100%)",
              },
            }}
          >
            一覧に戻る
          </Button>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f172a 0%, #4a1d96 50%, #0f172a 100%)",
          p: { xs: 2, md: 6 },
        }}
      >
        <Box sx={{ maxWidth: "900px", mx: "auto" }}>
          {/* ヘッダー部分 */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToList}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                },
              }}
            >
              一覧に戻る
            </Button>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={handleBookmark}
                sx={{
                  color: isBookmarked ? "primary.main" : "rgba(255, 255, 255, 0.7)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.05)" },
                }}
                aria-label={isBookmarked ? "ブックマークを解除" : "ブックマークに追加"}
              >
                {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
              <IconButton
                onClick={handleShare}
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.05)" },
                }}
                aria-label="共有する"
              >
                <ShareIcon />
              </IconButton>
              <IconButton
                onClick={handleEdit}
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.05)" },
                }}
                aria-label="編集する"
              >
                <EditIcon />
              </IconButton>
            </Box>
          </Box>

          {/* タイトルと情報 */}
          <Card
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              mb: 4,
              overflow: "visible",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ mb: 2, color: "white", fontWeight: 700 }}>
                {knowledge.title}
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, color: "rgba(255, 255, 255, 0.7)" }}>
                {knowledge.description}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {knowledge.tags.map((tag: string, index: number) => (
                  <Chip
                    key={index}
                    label={tag}
                    sx={{
                      bgcolor: "rgba(156, 39, 176, 0.2)",
                      color: "white",
                      border: "1px solid rgba(156, 39, 176, 0.3)",
                    }}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.1)" }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(156, 39, 176, 0.5)",
                      width: 32,
                      height: 32,
                    }}
                  >
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                    {knowledge.author}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarIcon fontSize="small" sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {knowledge.date}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* コンテンツ */}
          <Card
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              p: { xs: 2, sm: 4 },
            }}
          >
            <Box sx={{ color: "rgba(255, 255, 255, 0.9)" }}>{renderContent(knowledge.content)}</Box>
          </Card>

          {/* フッター */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToList}
              sx={{
                background: "linear-gradient(90deg, #9c27b0 0%, #3f51b5 100%)",
                color: "white",
                px: 4,
                py: 1,
                "&:hover": {
                  background: "linear-gradient(90deg, #7b1fa2 0%, #303f9f 100%)",
                  boxShadow: "0 4px 10px rgba(156, 39, 176, 0.3)",
                },
              }}
            >
              一覧に戻る
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
