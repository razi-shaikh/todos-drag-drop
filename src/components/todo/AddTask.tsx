import { useState, useRef, useEffect } from "react";
import { PlusCircle, Edit as EditIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface TaskData {
  id?: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

interface AddTaskProps {
  onAddTask: (taskData: TaskData, isEditing: boolean) => void;
  taskToEdit?: TaskData | null;
  onCancelEdit?: () => void;
}

export const AddTask = ({
  onAddTask,
  taskToEdit,
  onCancelEdit,
}: AddTaskProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority || "medium");
      setIsEditing(true);
      setTaskId(taskToEdit.id || null);

      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }
  }, [taskToEdit]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setIsEditing(false);
    setTaskId(null);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      createdAt: new Date().toISOString(),
    };

    if (isEditing && taskId) {
      onAddTask({ ...taskData, id: taskId }, true);
    } else {
      onAddTask(taskData, false);
    }

    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold">
          {isEditing ? "Edit Task" : "Add New Task"}
        </h2>
        {isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8"
            onClick={handleCancel}
            aria-label="Cancel editing"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <Input
            ref={titleInputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full"
          />
        </div>

        <div>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Priority</label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((p) => (
                <Button
                  key={p}
                  variant={priority === p ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 capitalize ${
                    priority === p ? "" : "text-gray-700"
                  }`}
                  onClick={() => setPriority(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-end">
            <Button className="w-full gap-2" onClick={handleSubmit}>
              {isEditing ? (
                <>
                  <EditIcon size={16} />
                  Update
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  Add Task
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
