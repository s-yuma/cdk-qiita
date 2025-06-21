"use client"

import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { Box, Typography } from "@mui/material"
import KnowledgeForm from "./components/knowledge-form"

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

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f172a 0%, #4a1d96 50%, #0f172a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, md: 6 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "600px", mx: "auto" }}>
          <Typography variant="h4" align="center" sx={{ mb: 1, color: "white" }}>
            ナレッジ共有アプリ
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4, color: "rgba(255, 255, 255, 0.7)" }}>
            あなたの知識を世界と共有しよう
          </Typography>
          <KnowledgeForm />
        </Box>
      </Box>
    </ThemeProvider>
  )
}
