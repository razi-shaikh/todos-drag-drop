"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTask, TaskColumn } from "@/components/todo";
import { Task } from "@/types";

// Define TaskData type for add/edit operations
type TaskData = Omit<Task, "id"> & { id?: string };

export default function TodoApp() {
  // Default tasks that will only be used if localStorage is empty
  const defaultPendingTasks: Task[] = [
    {
      id: "1",
      title: "Learn Drag and Drop",
      description: "Research and implement drag and drop functionality",
      priority: "high",
      createdAt: "2025-05-10T09:00:00.000Z",
    },
    {
      id: "2",
      title: "Build Todo App",
      description: "Create UI with better components and user experience",
      priority: "medium",
      createdAt: "2025-05-12T14:30:00.000Z",
    },
  ];

  const defaultDoneTasks: Task[] = [
    {
      id: "3",
      title: "Setup project",
      description: "Initialize Next.js app with TypeScript configuration",
      priority: "low",
      createdAt: "2025-05-08T11:15:00.000Z",
    },
  ];

  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">(
    "all"
  );

  // Load tasks from localStorage on initial render
  useEffect(() => {
    // Check if we're in a browser environment (since localStorage isn't available during SSR)
    if (typeof window !== "undefined") {
      const storedPendingTasks = localStorage.getItem("pendingTasks");
      const storedDoneTasks = localStorage.getItem("doneTasks");

      if (storedPendingTasks) {
        setPendingTasks(JSON.parse(storedPendingTasks));
      } else {
        // If no stored tasks, use default tasks
        setPendingTasks(defaultPendingTasks);
      }

      if (storedDoneTasks) {
        setDoneTasks(JSON.parse(storedDoneTasks));
      } else {
        // If no stored tasks, use default tasks
        setDoneTasks(defaultDoneTasks);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    // Only save to localStorage if tasks have been initialized
    // (prevents overwriting with empty arrays on first render)
    if (pendingTasks.length > 0 || doneTasks.length > 0) {
      localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks));
      localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
    }
  }, [pendingTasks, doneTasks]);

  const handleAddTask = (taskData: TaskData, isEditing: boolean) => {
    if (isEditing && taskData.id) {
      setPendingTasks(
        pendingTasks.map((task) =>
          task.id === taskData.id ? { ...task, ...taskData } : task
        )
      );

      setDoneTasks(
        doneTasks.map((task) =>
          task.id === taskData.id ? { ...task, ...taskData } : task
        )
      );
    } else {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
      };
      setPendingTasks([...pendingTasks, newTask]);
    }

    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setPendingTasks(pendingTasks.filter((task) => task.id !== taskId));
    setDoneTasks(doneTasks.filter((task) => task.id !== taskId));
  };

  const handleEditTask = (taskId: string) => {
    const taskToEdit =
      pendingTasks.find((task) => task.id === taskId) ||
      doneTasks.find((task) => task.id === taskId);

    if (taskToEdit) {
      setEditingTask(taskToEdit);
    }
  };

  const handleTaskMove = (
    taskId: string,
    from: "pending-tasks" | "done-tasks",
    to: "pending-tasks" | "done-tasks"
  ) => {
    if (from === to) return;

    // Find the task in the source column
    const sourceTasks = from === "pending-tasks" ? pendingTasks : doneTasks;
    const taskToMove = sourceTasks.find((task) => task.id === taskId);

    if (!taskToMove) return;

    // Remove from source column
    if (from === "pending-tasks") {
      setPendingTasks(pendingTasks.filter((task) => task.id !== taskId));
    } else {
      setDoneTasks(doneTasks.filter((task) => task.id !== taskId));
    }

    // Add to target column
    if (to === "pending-tasks") {
      setPendingTasks([...pendingTasks, taskToMove]);
    } else {
      setDoneTasks([...doneTasks, taskToMove]);
    }
  };

  // Filter tasks based on priority
  const filteredPendingTasks = pendingTasks.filter(
    (task) => filter === "all" || task.priority === filter
  );

  const filteredDoneTasks = doneTasks.filter(
    (task) => filter === "all" || task.priority === filter
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <AddTask
        onAddTask={handleAddTask}
        taskToEdit={editingTask}
        onCancelEdit={() => setEditingTask(null)}
      />

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium">My Tasks</h2>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="px-3"
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === "high" ? "default" : "outline"}
            onClick={() => setFilter("high")}
            className="px-3"
          >
            High
          </Button>
          <Button
            size="sm"
            variant={filter === "medium" ? "default" : "outline"}
            onClick={() => setFilter("medium")}
            className="px-3"
          >
            Medium
          </Button>
          <Button
            size="sm"
            variant={filter === "low" ? "default" : "outline"}
            onClick={() => setFilter("low")}
            className="px-3"
          >
            Low
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        <TaskColumn
          title="To Do"
          tasks={filteredPendingTasks}
          columnId="pending-tasks"
          onTaskMove={handleTaskMove}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onToggleComplete={(id: string) =>
            handleTaskMove(id, "pending-tasks", "done-tasks")
          } // Move from pending to done
        />
        <TaskColumn
          title="Completed"
          tasks={filteredDoneTasks}
          columnId="done-tasks"
          onTaskMove={handleTaskMove}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onToggleComplete={(id: string) =>
            handleTaskMove(id, "done-tasks", "pending-tasks")
          } // Move from done to pending
        />
      </div>
    </div>
  );
}
