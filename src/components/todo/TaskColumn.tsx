"use client";

import { useEffect, useRef } from "react";
import dragula from "dragula";
import { TaskCard } from "./TaskCard";
import { Task } from "@/types";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  columnId: "pending-tasks" | "done-tasks";
  onTaskMove?: (taskId: string, from: "pending-tasks" | "done-tasks", to: "pending-tasks" | "done-tasks") => void;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string) => void;
}
export const TaskColumn = ({
  title,
  tasks,
  columnId,
  onTaskMove,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
}: TaskColumnProps) => {
  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!columnRef.current || !onTaskMove) return;

    const drake = dragula([
      document.getElementById("pending-tasks")!,
      document.getElementById("done-tasks")!,
    ]);

    drake.on("drop", (el, target, source) => {
      const taskId = el.id;
      const from = source.id as "pending-tasks" | "done-tasks";
      const to = target.id as "pending-tasks" | "done-tasks";

      if (from !== to) {
        onTaskMove(taskId, from, to);
      }
    });

    return () => drake.destroy();
  }, [onTaskMove]);

  return (
    <div className="flex-1 min-w-0">
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg flex items-center">
            {title}
            <span className="ml-2 inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              {tasks.length}
            </span>
          </h2>
        </div>

        <div ref={columnRef} id={columnId} className="min-h-32">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg border-gray-200 text-gray-400">
              <p className="text-sm">No tasks here yet</p>
              {columnId === "pending-tasks" && (
                <p className="text-xs mt-1">Add your first task above</p>
              )}
              {columnId === "done-tasks" && (
                <p className="text-xs mt-1">Complete tasks will appear here</p>
              )}
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} id={task.id}>
                <TaskCard
                  {...task}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                  onToggleComplete={onToggleComplete}
                  status={columnId === "done-tasks" ? "done" : "pending"}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
