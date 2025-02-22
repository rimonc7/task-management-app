import { useDrag } from "react-dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosPublic from "../Hook/useAxiosPublic";
import { MdDelete } from "react-icons/md";

const TaskCard = ({ task }) => {
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  const [, drag] = useDrag({
    type: "TASK",
    item: { _id: task._id, category: task.category },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const confirmDelete = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to recover this task!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmDelete.isConfirmed) {
        return axiosPublic.delete(`/tasks/${task._id}`);
      } else {
        return Promise.reject("Deletion cancelled");
      }
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Task has been removed.", "success");
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
    },
  });

  return (
    <div
      ref={drag}
      className="bg-white p-3 rounded-md shadow-md mb-2 flex justify-between items-center cursor-move"
    >
      <div>
        <h4 className="font-medium">{task.title}</h4>
        <p className="text-sm text-gray-500">{task.description}</p>
      </div>
      <button
        onClick={() => deleteMutation.mutate()}
        className=" p-1 rounded"
      >
       <MdDelete className="text-red-500" />
      </button>
    </div>
  );
};

export default TaskCard;
