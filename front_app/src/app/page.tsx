"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  Book as BookIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useKnowledgeData } from "@/(feature)/main/hooks/useKnowledgeData";


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

export default function KnowledgeListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
    const fetchToken = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      if (!code) return;

      // トークン取得
      const params = new URLSearchParams();
      params.append("grant_type", "authorization_code");
      params.append("client_id", "6vt0fm4pbts1fj9a3h2v9b8b20");
      params.append("code", code);
      params.append(
        "redirect_uri",
        "https://main.d3j2oob05fmjqq.amplifyapp.com/"
      );

      try {
        const res = await fetch(
          "https://my-app-hosted-ui-demo.auth.ap-northeast-1.amazoncognito.com/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
          }
        );

        const data = await res.json();
        if (data.id_token) {
          console.log("✅ id_token:", data.id_token);
          localStorage.setItem("id_token", data.id_token);
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);

          // クエリパラメータを削除（再読み込みしない）
          router.replace("/", undefined);
        } else {
          console.error("トークン取得失敗:", data);
        }
      } catch (err) {
        console.error("通信エラー:", err);
      }
    };

    fetchToken();
  }, [router]);


  const { knowledgeData, isLoading, isError } = useKnowledgeData();
  console.log(knowledgeData);

  if (isLoading) return <p>読み込み中...</p>;
  if (isError) return <p>エラーが発生しました。</p>;

  // 検索フィルター
  const filteredKnowledge = knowledgeData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // 新規作成ページへ移動
  const handleCreateNew = () => {
    router.push("/register");
  };

  // 詳細ページへ移動
  const handleViewDetails = (id: string) => {
    router.push(`/knowledge/${id}`);
  };

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
        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h4" sx={{ color: "white" }}>
              ナレッジベース
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
              sx={{
                background: "linear-gradient(90deg, #9c27b0 0%, #3f51b5 100%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #7b1fa2 0%, #303f9f 100%)",
                  boxShadow: "0 4px 10px rgba(156, 39, 176, 0.3)",
                },
              }}
            >
              新規作成
            </Button>
          </Box>

          <Typography
            variant="body1"
            sx={{ mb: 4, color: "rgba(255, 255, 255, 0.7)" }}
          >
            チームの知識を共有・検索できるプラットフォーム
          </Typography>

          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="ナレッジを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9c27b0",
                  },
                  color: "white",
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {filteredKnowledge.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                bgcolor: "rgba(255, 255, 255, 0.05)",
                borderRadius: 2,
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                検索結果がありません
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.5)", mt: 1 }}
              >
                別のキーワードで検索してみてください
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              {filteredKnowledge.map((item) => (
                <Box key={`${item.userId}-${item.title}`}>
                  <Card
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      height: "100%", // Ensure all cards have the same height
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => handleViewDetails(item.userId)}
                  >
                    <CardHeader
                      title={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <BookIcon fontSize="small" />
                          <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
                            {item.title}
                          </Typography>
                        </Box>
                      }
                      sx={{ pb: 1 }}
                    />
                    <CardContent
                      sx={{
                        pt: 0,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          mb: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          height: "2.5em", // Fixed height for description
                        }}
                      >
                        {item.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 2,
                          minHeight: "32px", // Ensure consistent height for tag area
                        }}
                      >
                        {item.tags.map((tag, index) => (
                          <Chip
                            key={`${tag}-${index}`}
                            label={tag}
                            size="small"
                            sx={{
                              bgcolor: "rgba(156, 39, 176, 0.2)",
                              color: "rgba(255, 255, 255, 0.9)",
                              border: "1px solid rgba(156, 39, 176, 0.3)",
                              fontSize: "0.75rem",
                            }}
                          />
                        ))}
                      </Box>
                      <Divider
                        sx={{
                          my: 1.5,
                          borderColor: "rgba(255, 255, 255, 0.1)",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              bgcolor: "rgba(156, 39, 176, 0.5)",
                              fontSize: "0.75rem",
                            }}
                          >
                            {item.author.charAt(0)}
                          </Avatar>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.7)",
                              fontSize: "0.85rem",
                            }}
                          >
                            {item.author}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CalendarIcon
                            sx={{
                              fontSize: "0.85rem",
                              color: "rgba(255, 255, 255, 0.5)",
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.5)",
                              fontSize: "0.75rem",
                            }}
                          >
                            {item.date}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
