"use client";

import { useState } from "react";
import { PlusCircle, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTask, TaskColumn } from "@/components/todo";
import { Task } from "@/components/todo/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const STORAGE_KEY = "todoAppData";

interface TodoAppData {
  pendingTasks: Task[];
  doneTasks: Task[];
}

export default function TodoApp() {
  const [appData, setAppData] = useLocalStorage<TodoAppData>(STORAGE_KEY, {
    pendingTasks: [
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
    ],
    doneTasks: [
      {
        id: "3",
        title: "Setup project",
        description: "Initialize Next.js app with TypeScript configuration",
        priority: "low",
        createdAt: "2025-05-08T11:15:00.000Z",
      },
    ],
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">(
    "all"
  );

  const { pendingTasks, doneTasks } = appData;

  const updateAppData = (newData: Partial<TodoAppData>) => {
    setAppData((prev) => ({ ...prev, ...newData }));
  };

  const handleAddTask = (taskData: Task, isEditing: boolean) => {
    if (isEditing && taskData.id) {
      updateAppData({
        pendingTasks: pendingTasks.map((task) =>
          task.id === taskData.id ? { ...task, ...taskData } : task
        ),
        doneTasks: doneTasks.map((task) =>
          task.id === taskData.id ? { ...task, ...taskData } : task
        ),
      });
    } else {
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
      };
      updateAppData({
        pendingTasks: [...pendingTasks, newTask],
      });
    }

    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    updateAppData({
      pendingTasks: pendingTasks.filter((task) => task.id !== taskId),
      doneTasks: doneTasks.filter((task) => task.id !== taskId),
    });
  };

  const handleEditTask = (taskId: string) => {
    const taskToEdit =
      pendingTasks.find((task) => task.id === taskId) ||
      doneTasks.find((task) => task.id === taskId);

    if (taskToEdit) {
      setEditingTask(taskToEdit);
    }
  };

  const handleTaskMoved = (
    taskId: string,
    from: "pending-tasks" | "done-tasks",
    to: "pending-tasks" | "done-tasks"
  ) => {
    const sourceTasks = from === "pending-tasks" ? pendingTasks : doneTasks;
    const taskToMove = sourceTasks.find((task) => task.id === taskId);

    if (!taskToMove) return;

    if (from === "pending-tasks") {
      updateAppData({
        pendingTasks: pendingTasks.filter((task) => task.id !== taskId),
        doneTasks: [...doneTasks, taskToMove],
      });
    } else {
      updateAppData({
        doneTasks: doneTasks.filter((task) => task.id !== taskId),
        pendingTasks: [...pendingTasks, taskToMove],
      });
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
          onTaskMoved={handleTaskMoved}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onToggleComplete={handleTaskMoved}
        />
        <TaskColumn
          title="Completed"
          tasks={filteredDoneTasks}
          columnId="done-tasks"
          onTaskMoved={handleTaskMoved}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onToggleComplete={handleTaskMoved}
        />
      </div>
    </div>
  );
}
