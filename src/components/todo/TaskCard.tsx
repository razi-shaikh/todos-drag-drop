import { Card } from "../ui/card";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  isDragging?: boolean;
}

export const TaskCard = ({
  id,
  title,
  description,
  isDragging,
}: TaskCardProps) => {
  return (
    <Card
      id={id}
      className={`p-4 mb-2 cursor-move ${
        isDragging ? "opacity-50 border-2 border-primary" : ""
      }`}
    >
      <h3 className="font-medium text-lg">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      )}
    </Card>
  );
};
