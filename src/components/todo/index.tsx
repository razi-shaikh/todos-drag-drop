"use client";

import { TaskColumn } from "./TaskColumn";
import { AddTask } from "./AddTask";
import { useState } from "react";
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

  const handleAddTask = (title: string, description?: string) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
    };
    setPendingTasks([...pendingTasks, newTask]);
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
