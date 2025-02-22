import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AuthContext } from "../Provider/AuthProvider";
import useAxiosPublic from "../Hook/useAxiosPublic";
import TaskColumn from "./TaskColumn";

const TaskBoard = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  const { data: tasks = { "To-Do": [], "In Progress": [], "Done": [] }, isLoading } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      if (!user?.email) return { "To-Do": [], "In Progress": [], "Done": [] };
      const { data } = await axiosPublic.get(`/tasks?email=${user.email}`);
      return data.reduce((acc, task) => {
        acc[task.category] = acc[task.category] ? [...acc[task.category], task] : [task];
        return acc;
      }, { "To-Do": [], "In Progress": [], "Done": [] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, newCategory }) => {
      await axiosPublic.put(`/tasks/${taskId}`, { category: newCategory });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", user?.email]);
    },
  });

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Task Manager</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {Object.keys(tasks).map((category) => (
            <TaskColumn
              key={category}
              category={category}
              tasks={tasks[category]}
              updateTask={updateTaskMutation.mutate}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default TaskBoard;
