"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Chip,
  Box,
  alpha,
} from "@mui/material";
import {
  Book as BookIcon,
  Tag as TagIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

export default function KnowledgeForm() {
  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleAddTagButton = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ここでフォームデータを処理します
    console.log({
      title,
      tags,
      author,
    });

    // 送信完了後の処理
    setTimeout(() => {
      setIsSubmitting(false);
      // フォームをリセット
      setTitle("");
      setTags([]);
      setAuthor("");
      alert("ナレッジが正常に共有されました！");
    }, 1000);
  };

  return (
    <Card
      sx={{
        width: "100%",
        bgcolor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        border: "none",
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BookIcon fontSize="small" />
            <Typography variant="h6">新しいナレッジを共有</Typography>
          </Box>
        }
        subheader={
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
            あなたの知識や経験を入力して、他の人と共有しましょう
          </Typography>
        }
        sx={{
          background: "linear-gradient(90deg, #9c27b0 0%, #3f51b5 100%)",
          color: "white",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />
      <form onSubmit={handleSubmit}>
        <CardContent
          sx={{
            pt: 3,
            pb: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "white",
              }}
            >
              <BookIcon fontSize="small" />
              タイトル
            </Typography>
            <TextField
              fullWidth
              placeholder="ナレッジのタイトルを入力してください"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              variant="outlined"
              InputProps={{
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
                },
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "white",
              }}
            >
              <TagIcon fontSize="small" />
              タグ
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  sx={{
                    bgcolor: alpha("#9c27b0", 0.3),
                    color: "white",
                    border: "1px solid rgba(156, 39, 176, 0.3)",
                    "& .MuiChip-deleteIcon": {
                      color: "rgba(255, 255, 255, 0.7)",
                      "&:hover": {
                        color: "#ff5252",
                      },
                    },
                  }}
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                placeholder="タグを入力してください"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                variant="outlined"
                InputProps={{
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
                  },
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAddTagButton}
                sx={{ minWidth: "100px" }}
                startIcon={<AddIcon />}
              >
                追加
              </Button>
            </Box>
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                display: "block",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              複数のタグを追加できます。入力後、Enterキーまたは追加ボタンを押してください。
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "white",
              }}
            >
              <PersonIcon fontSize="small" />
              作成者
            </Typography>
            <TextField
              fullWidth
              placeholder="あなたの名前を入力してください"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              variant="outlined"
              InputProps={{
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
                },
              }}
            />
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: "space-between", p: 3, pt: 0 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setTitle("");
              setTags([]);
              setTagInput("");
              setAuthor("");
            }}
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                bgcolor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            クリア
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <RefreshIcon className="animate-spin" />
              ) : (
                <SendIcon />
              )
            }
            sx={{
              background: "linear-gradient(90deg, #9c27b0 0%, #3f51b5 100%)",
              color: "white",
              px: 3,
              "&:hover": {
                background: "linear-gradient(90deg, #7b1fa2 0%, #303f9f 100%)",
                boxShadow: "0 4px 10px rgba(156, 39, 176, 0.3)",
              },
            }}
          >
            {isSubmitting ? "送信中..." : "共有する"}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}
