import { TaskCard } from "./TaskCard";
import { Card } from "../ui/card";
import { Plus } from "lucide-react";

interface TaskColumnProps {
  title: string;
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
  columnId: string;
}

export const TaskColumn = ({ title, tasks, columnId }: TaskColumnProps) => {
  return (
    <Card className="flex-1 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
          {tasks.length}
        </span>
      </div>
      <div id={columnId} className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </div>
    </Card>
  );
};
