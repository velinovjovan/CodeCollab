"use client";
import React, { useRef, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { WhiteboardProps } from "@/interfaces";

const Whiteboard = ({ communityId, userId }: WhiteboardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const supabase = createClient();

  useEffect(() => {
    loadWhiteboard();

    const channel = supabase
      .channel(`whiteboard-${communityId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "community_whiteboards",
          filter: `community_id=eq.${communityId}`,
        },
        (payload: any) => {
          if (payload.new.updated_by !== userId) {
            loadWhiteboardData(payload.new.content);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [communityId]);

  const loadWhiteboard = async () => {
    const { data } = await supabase
      .from("community_whiteboards")
      .select("*")
      .eq("community_id", communityId)
      .single();

    if (data?.content) {
      loadWhiteboardData(data.content);
    }
  };

  const loadWhiteboardData = (imageData: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageData;
  };

  const saveWhiteboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL("image/png");

    const { data: existing } = await supabase
      .from("community_whiteboards")
      .select("*")
      .eq("community_id", communityId)
      .single();

    if (existing) {
      await supabase
        .from("community_whiteboards")
        .update({ content: imageData, updated_by: userId })
        .eq("community_id", communityId);
    } else {
      await supabase.from("community_whiteboards").insert({
        community_id: communityId,
        content: imageData,
        updated_by: userId,
      });
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = tool === "eraser" ? "#1e293b" : color;
    ctx.lineWidth = tool === "eraser" ? lineWidth * 3 : lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveWhiteboard();
    }
  };

  const clearCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveWhiteboard();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1920;
    canvas.height = 1080;
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-800/50 border-b border-slate-700 p-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTool("pen")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tool === "pen"
                ? "bg-purple-600 text-white"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            ✏️ Pen
          </button>
          <button
            onClick={() => setTool("eraser")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tool === "eraser"
                ? "bg-purple-600 text-white"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            🧹 Eraser
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Color:</label>
          <div className="flex gap-1">
            {[
              "#ffffff",
              "#ef4444",
              "#3b82f6",
              "#22c55e",
              "#eab308",
              "#a855f7",
            ].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setTool("pen");
                }}
                className={`w-7 h-7 rounded-lg border-2 transition-all ${
                  color === c && tool === "pen"
                    ? "border-white scale-110"
                    : "border-slate-600 hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-xs text-gray-400 w-6">{lineWidth}</span>
        </div>
        <button
          onClick={clearCanvas}
          className="ml-auto px-4 py-1.5 bg-red-600/80 text-white rounded-lg hover:bg-red-500 transition-all text-sm font-medium"
        >
          🗑️ Clear
        </button>
      </div>
      <div className="flex-1 bg-slate-900 p-4 overflow-auto flex items-center justify-center">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border-2 border-slate-700 rounded-lg shadow-2xl cursor-crosshair w-full"
          style={{ maxWidth: "100%", height: "auto", display: "block" }}
        />
      </div>
      <div className="bg-slate-800/50 border-t border-slate-700 p-2 text-center">
        <p className="text-xs text-gray-500">
          Draw collaboratively • Auto-saves after each stroke
        </p>
      </div>
    </div>
  );
};

export default Whiteboard;
