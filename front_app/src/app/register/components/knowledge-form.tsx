"use client";

import type React from "react";
import { v4 as uuidv4 } from "uuid";
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
import axios from "axios";

export default function KnowledgeForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState(""); // ★ content 追加
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

    await axios.post(
      "https://m6ld96ezo0.execute-api.ap-northeast-1.amazonaws.com/prod/test",
      {
        userId: uuidv4(),
        title: title,
        description: description,
        author: author,
        date: "2025-02-18",
        tags: tags,
        content: content,
      }
    );

    setTimeout(() => {
      setIsSubmitting(false);
      setTitle("");
      setDescription("");
      setTags([]);
      setTagInput("");
      setAuthor("");
      setContent(""); // ★ content リセット
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
        <CardContent sx={{ pt: 3, pb: 3, display: "flex", flexDirection: "column", gap: 3 }}>
          {/* タイトル */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1, color: "white" }}>
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
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9c27b0",
                  },
                },
              }}
            />
          </Box>

          {/* 説明 */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1, color: "white" }}>
              <BookIcon fontSize="small" />
              説明
            </Typography>
            <TextField
              fullWidth
              placeholder="ナレッジの詳細説明を入力してください"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              required
              variant="outlined"
              InputProps={{
                sx: {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9c27b0",
                  },
                },
              }}
            />
          </Box>

          {/* コンテンツ（★ 追加部分） */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1, color: "white" }}>
              <BookIcon fontSize="small" />
              コンテンツ
            </Typography>
            <TextField
              fullWidth
              placeholder="ナレッジの本文を入力してください（Markdownなど）"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={10}
              required
              variant="outlined"
              InputProps={{
                sx: {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9c27b0",
                  },
                },
              }}
            />
          </Box>

          {/* タグ */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1, color: "white" }}>
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
                    color: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#9c27b0",
                    },
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
          </Box>

          {/* 作成者 */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1, color: "white" }}>
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
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9c27b0",
                  },
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
              setDescription("");
              setContent("");
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
