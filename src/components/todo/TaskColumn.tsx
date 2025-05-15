"use client";

import { useEffect, useRef } from "react";
import dragula from "dragula";
import { TaskCardProps, TaskCard } from "./TaskCard";
import { Card } from "../ui/card";

interface TaskColumnProps {
  title: string;
  tasks: TaskCardProps[];
  columnId: string;
}

export const TaskColumn = ({ title, tasks, columnId }: TaskColumnProps) => {
  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!columnRef.current) return;

    dragula([
      document.getElementById("pending-tasks")!,
      document.getElementById("done-tasks")!,
    ]).on("drop", (el, target, source) => {
      const taskId = el.id;
      const from = source.id;
      const to = target.id;

      if (from !== to) {
        const taskData = JSON.parse(el.dataset.task!);
        const event = new CustomEvent("taskMoved", {
          detail: { taskId, from, to, taskData },
        });
        window.dispatchEvent(event);
      }
    });
  }, []);

  return (
    <div className="flex-1">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <Card ref={columnRef} id={columnId} className="p-4 min-h-[200px]">
        {tasks.map((task) => (
          <div key={task.id} id={task.id} data-task={JSON.stringify(task)}>
            <TaskCard {...task} />
          </div>
        ))}
      </Card>
    </div>
  );
};
