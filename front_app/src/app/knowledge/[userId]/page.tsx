"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Chip,
  Divider,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios";

// ナレッジデータの型定義
interface KnowledgeItem {
  userId: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  content: string;
}

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
});

export default function KnowledgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [knowledge, setKnowledge] = useState<KnowledgeItem | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userId = params.userId;
      console.log(userId);

      try {
        const idToken =
          typeof window !== "undefined"
            ? localStorage.getItem("id_token")
            : null;

        const response = await axios.get(
          process.env.NEXT_PUBLIC_URL as string,
          {
            headers: {
              ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
            },
          }
        );
        console.log("data", response.data);

        // 🔁 ダミーから実データへ
        setKnowledge(response.data);
      } catch (error) {
        console.error("Error fetching knowledge:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.userId]);

  const handleBackToList = () => {
    router.push("/");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    // 共有機能（実際の実装ではクリップボードにコピーなど）
    alert("共有機能は現在実装中です。");
  };

  const handleEdit = () => {
    // 編集機能（実際の実装では編集ページへ遷移）
    alert("編集機能は現在実装中です。");
  };

  // マークダウンのような内容をHTMLに変換する簡易関数
  const renderContent = (content: string) => {
    if (!content) return null;

    // 行ごとに処理
    const lines = content.split("\n");

    return lines.map((line, index) => {
      // 見出し
      if (line.startsWith("# ")) {
        return (
          <Typography
            variant="h4"
            sx={{ mt: 4, mb: 2, fontWeight: 700 }}
            key={index}
          >
            {line.substring(2)}
          </Typography>
        );
      } else if (line.startsWith("## ")) {
        return (
          <Typography
            variant="h5"
            sx={{ mt: 3, mb: 2, fontWeight: 600 }}
            key={index}
          >
            {line.substring(3)}
          </Typography>
        );
      } else if (line.startsWith("### ")) {
        return (
          <Typography
            variant="h6"
            sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}
            key={index}
          >
            {line.substring(4)}
          </Typography>
        );
      }
      // コードブロック
      else if (line.startsWith("```") && !line.endsWith("```")) {
        // コードブロックの開始
        return null;
      } else if (line.endsWith("```") && !line.startsWith("```")) {
        // コードブロックの終了
        return null;
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
        );
      }
      // 空行
      else if (line.trim() === "") {
        return <Box sx={{ height: "1rem" }} key={index} />;
      }
      // 通常のテキスト
      else {
        return (
          <Typography
            variant="body1"
            sx={{ my: 1, lineHeight: 1.7 }}
            key={index}
          >
            {line}
          </Typography>
        );
      }
    });
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            background:
              "linear-gradient(135deg, #0f172a 0%, #4a1d96 50%, #0f172a 100%)",
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
    );
  }

  if (!knowledge) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            background:
              "linear-gradient(135deg, #0f172a 0%, #4a1d96 50%, #0f172a 100%)",
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
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0f172a 0%, #4a1d96 50%, #0f172a 100%)",
          p: { xs: 2, md: 6 },
        }}
      >
        <Box sx={{ maxWidth: "900px", mx: "auto" }}>
          {/* ヘッダー部分 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
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
                  color: isBookmarked
                    ? "primary.main"
                    : "rgba(255, 255, 255, 0.7)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.05)" },
                }}
                aria-label={
                  isBookmarked ? "ブックマークを解除" : "ブックマークに追加"
                }
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
              <Typography
                variant="h4"
                sx={{ mb: 2, color: "white", fontWeight: 700 }}
              >
                {knowledge.title}
              </Typography>

              <Typography
                variant="body1"
                sx={{ mb: 3, color: "rgba(255, 255, 255, 0.7)" }}
              >
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

              <Divider
                sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.1)" }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
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
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                  >
                    {knowledge.author}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarIcon
                    fontSize="small"
                    sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
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
            <Box sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
              {renderContent(knowledge.content)}
            </Box>
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
                  background:
                    "linear-gradient(90deg, #7b1fa2 0%, #303f9f 100%)",
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
  );
}
