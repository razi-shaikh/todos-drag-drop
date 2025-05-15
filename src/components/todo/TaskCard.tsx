import { Check, Trash2, Edit, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  priority?: "low" | "medium" | "high";
  isDragging?: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleComplete: (id: string) => void;
  status: "pending" | "done";
}

export const TaskCard = ({
  id,
  title,
  description,
  createdAt,
  priority = "medium",
  isDragging = false,
  onDelete,
  onEdit,
  onToggleComplete,
  status,
}: TaskCardProps) => {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const isCompleted = status === "done";

  return (
    <Card
      id={id}
      className={`p-4 mb-3 cursor-move transition-all hover:shadow-md ${
        isDragging ? "opacity-50 border-2 border-primary" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1">
          <button
            className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center ${
              isCompleted
                ? "bg-green-500 border-green-600 text-white"
                : "border-gray-300 hover:border-green-500"
            }`}
            onClick={() => onToggleComplete(id)}
            aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {isCompleted && <Check size={12} />}
          </button>

          <div className="flex-1">
            <h3
              className={`font-medium text-lg ${
                isCompleted ? "line-through text-gray-500" : ""
              }`}
            >
              {title}
            </h3>
            {description && (
              <p
                className={`text-sm mt-1 ${
                  isCompleted ? "line-through text-gray-400" : "text-gray-600"
                }`}
              >
                {description}
              </p>
            )}

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-gray-500 text-xs">
                <Calendar size={12} className="mr-1" />
                {formattedDate}
              </div>

              <Badge
                variant="outline"
                className={`uppercase text-xs ${priorityColors[priority]}`}
              >
                {priority}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-500 hover:text-blue-600"
            onClick={() => onEdit(id)}
            aria-label="Edit task"
          >
            <Edit size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-500 hover:text-red-600"
            onClick={() => onDelete(id)}
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
};
