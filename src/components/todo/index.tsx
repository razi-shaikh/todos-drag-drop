"use client";
import { useEffect, useState } from "react";
import { AddTask } from "./AddTask";
import { TaskColumn } from "./TaskColumn";
import { TaskCardProps } from "./TaskCard";

export const TodoApp = () => {
  const [pendingTasks, setPendingTasks] = useState<TaskCardProps[]>([
    {
      id: "1",
      title: "Learn Dragula.js",
      description: "Implement drag and drop",
    },
    { id: "2", title: "Build Todo App", description: "Create UI with shadcn" },
  ]);
  const [doneTasks, setDoneTasks] = useState<TaskCardProps[]>([
    { id: "3", title: "Setup project", description: "Next.js + TypeScript" },
  ]);

  const moveTask = (task: TaskCardProps, from: string, to: string) => {
    if (from === "pending-tasks") {
      setPendingTasks((prev) => prev.filter((t) => t.id !== task.id));
    } else {
      setDoneTasks((prev) => prev.filter((t) => t.id !== task.id));
    }

    if (to === "pending-tasks") {
      setPendingTasks((prev) => [...prev, task]);
    } else {
      setDoneTasks((prev) => [...prev, task]);
    }
  };

  useEffect(() => {
    const handleMove = (e: any) => {
      const { taskId, from, to, taskData } = e.detail;
      moveTask(taskData, from, to);
    };

    window.addEventListener("taskMoved", handleMove);
    return () => window.removeEventListener("taskMoved", handleMove);
  }, []);

  const handleAddTask = (title: string, description?: string) => {
    const newTask = { id: Date.now().toString(), title, description };
    setPendingTasks((prev) => [...prev, newTask]);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Todo App</h1>
      <AddTask onAddTask={handleAddTask} />
      <div className="flex gap-4">
        <TaskColumn
          title="Pending"
          tasks={pendingTasks}
          columnId="pending-tasks"
        />
        <TaskColumn title="Done" tasks={doneTasks} columnId="done-tasks" />
      </div>
    </div>
  );
};
