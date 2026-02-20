"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem("focusflow-tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("focusflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;
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

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedCount / tasks.length) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl text-white">

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          FocusFlow
        </h1>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What needs focus today?"
            className="flex-1 p-3 rounded-lg text-black outline-none"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-3 rounded-lg font-semibold transition"
          >
            Add
          </button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <p className="text-sm">
            {completedCount} of {tasks.length} completed
          </p>
          <div className="w-full bg-white/20 h-2 rounded-full mt-1">
            <div
              className="bg-green-400 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-4">
          {["all", "active", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === type
                  ? "bg-white text-black"
                  : "bg-white/20"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-sm opacity-70">
              No tasks here 🚀
            </p>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between bg-white/20 p-3 rounded-lg"
              >
                <span
                  onClick={() => toggleTask(t.id)}
                  className={`cursor-pointer flex-1 ${
                    t.completed ? "line-through opacity-60" : ""
                  }`}
                >
                  {t.text}
                </span>

                <button
                  onClick={() => deleteTask(t.id)}
                  className="ml-3 text-red-300 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}