"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [dark, setDark] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("focusflow_tasks");
    const savedTheme = localStorage.getItem("focusflow_theme");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedTheme) setDark(savedTheme === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("focusflow_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("focusflow_theme", dark ? "dark" : "light");
  }, [dark]);

  const addTask = () => {
    if (!task.trim()) return;

    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks =
    filter === "All"
      ? tasks
      : filter === "Completed"
      ? tasks.filter((t) => t.completed)
      : tasks.filter((t) => !t.completed);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        dark
          ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
          : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white"
      }`}
    >
      <div className="max-w-4xl mx-auto p-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              FocusFlow
            </h1>
            <p className="text-sm opacity-80 mt-2">
              Smart productivity dashboard with modern UI design.
            </p>
          </div>

          <button
            onClick={() => setDark(!dark)}
            className="px-5 py-2 rounded-xl bg-white/20 backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 transition"
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </motion.div>

        {/* Main Card */}
        <div
          className={`${
            dark ? "bg-white/10" : "bg-white/20"
          } backdrop-blur-2xl rounded-3xl p-8 shadow-2xl transition-all`}
        >
          {/* Input */}
          <div className="flex gap-4 mb-8">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="What needs focus today?"
              className="flex-1 p-4 rounded-xl bg-white/70 text-black outline-none focus:ring-4 focus:ring-indigo-400 transition"
            />

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={addTask}
              className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold shadow-xl"
            >
              Add
            </motion.button>
          </div>

          {/* Stats Section */}
          <div className="flex justify-between items-center mb-8">

            <div className="flex gap-6 text-sm">
              <div>
                <p className="opacity-70">Total</p>
                <p className="text-xl font-bold">{tasks.length}</p>
              </div>
              <div>
                <p className="opacity-70">Completed</p>
                <p className="text-xl font-bold">{completedCount}</p>
              </div>
            </div>

            {/* Progress Circle */}
            <div className="relative w-20 h-20">
              <svg className="transform -rotate-90 w-20 h-20">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="white"
                  strokeWidth="6"
                  fill="transparent"
                  opacity="0.2"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="white"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={220}
                  strokeDashoffset={220 - (220 * progress) / 100}
                  initial={{ strokeDashoffset: 220 }}
                  animate={{
                    strokeDashoffset: 220 - (220 * progress) / 100,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {progress}%
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-8">
            {["All", "Active", "Completed"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2 rounded-full font-medium transition hover:scale-105 active:scale-95 ${
                  filter === type
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white/30"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredTasks.map((t) => (
                <motion.div
                  layout
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.3 }}
                  className={`flex justify-between items-center p-4 rounded-xl shadow-lg hover:shadow-2xl transition ${
                    t.completed
                      ? "bg-green-400/60"
                      : "bg-white/60 text-black"
                  }`}
                >
                  <p
                    onClick={() => toggleTask(t.id)}
                    className={`cursor-pointer font-medium ${
                      t.completed ? "line-through opacity-70" : ""
                    }`}
                  >
                    {t.text}
                  </p>

                  <button
                    onClick={() => deleteTask(t.id)}
                    className="text-red-500 hover:scale-110 transition"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center opacity-60 mt-10"
              >
                <span className="text-4xl mb-2">🚀</span>
                <p>No tasks yet. Time to build momentum.</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-14 text-xs text-center opacity-70 tracking-wide">
          Designed & Developed by Chaitanya Mucharla • Next.js 16 • Tailwind CSS • Framer Motion
        </div>
      </div>
    </div>
  );
}