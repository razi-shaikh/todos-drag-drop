"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRef } from "react";

interface AddTaskProps {
  onAddTask: (title: string, description?: string) => void;
}

export const AddTask = ({ onAddTask }: AddTaskProps) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;

    if (title) {
      onAddTask(title, description);
      if (titleRef.current) titleRef.current.value = "";
      if (descriptionRef.current) descriptionRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6">
      <div className="flex gap-2">
        <Input
          ref={titleRef}
          placeholder="Task title"
          className="flex-1"
          required
        />
        <Button type="submit">Add</Button>
      </div>
      <Input
        ref={descriptionRef}
        placeholder="Description (optional)"
        className="w-full"
      />
    </form>
  );
};
