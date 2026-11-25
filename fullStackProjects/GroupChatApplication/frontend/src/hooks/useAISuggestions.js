// src/hooks/useAISuggestions.js
import { useState, useEffect, useRef } from "react";
import api from "../lib/axios";

export const useAISuggestions = (text, lastIncomingMessage) => {
  const [suggestion, setSuggestion] = useState("");
  const [smartReplies, setSmartReplies] = useState([]);
  const abortControllerRef = useRef(null);

  // 1. Predictive Typing (Debounced)
  useEffect(() => {
    if (!text || text.length < 3) {
      setSuggestion("");
      return;
    }

    // Cancel previous request if user is typing fast
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await api.post(
          "/ai/predict",
          { text },
          { signal: abortControllerRef.current.signal },
        );
        setSuggestion(res.data.suggestion || "");
      } catch (error) {
        if (error.name !== "CanceledError") console.error(error);
      }
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [text]);

  // 2. Smart Replies (Triggered when a new message arrives)
  useEffect(() => {
    if (!lastIncomingMessage) return;

    const fetchReplies = async () => {
      try {
        const res = await api.post("/ai/replies", {
          lastMessage: lastIncomingMessage,
        });
        setSmartReplies(res.data.replies || []);
      } catch (error) {
        console.error("Failed to get smart replies", error);
      }
    };

    fetchReplies();
  }, [lastIncomingMessage]);

  return { suggestion, smartReplies, clearReplies: () => setSmartReplies([]) };
};
