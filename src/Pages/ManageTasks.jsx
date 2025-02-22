import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hook/useAxiosPublic";
import { useContext, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const ManageTasks = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [selectedTask, setSelectedTask] = useState(null); // Store selected task for editing

  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosPublic.get(`/tasks?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Handle Delete
  const handleDelete = async (taskId) => {
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
      await axiosPublic.delete(`/tasks/${taskId}`);
      Swal.fire("Deleted!", "The task has been removed.", "success");
      refetch();
    }
  };

  // Handle Edit
  const handleEdit = (task) => {
    setSelectedTask(task);
    setValue("title", task.title);
    setValue("description", task.description);
    setValue("category", task.category);
    document.getElementById("my_modal_5").showModal();
  };
+
  const onSubmit = async (data) => {
    if (!selectedTask) return;

    await axiosPublic.put(`/tasks/${selectedTask._id}`, data);
    Swal.fire("Updated!", "Task has been updated.", "success");
    refetch();
    reset();
    document.getElementById("my_modal_5").close();
  };

  return (
    <div className="p-6 lg:mx-40">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Tasks</h2>

      {isLoading ? (
        <p className="text-gray-600 text-center mt-5">Loading tasks...</p>
      ) : tasks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-center">Category</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr
                  key={task._id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="py-3 px-6">{task.title}</td>
                  <td className="py-3 px-6">
                    {task.description || "No description"}
                  </td>
                  <td className="py-3 px-6 text-center">{task.category}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(task)}
                      className="bg-blue-500 text-white px-4 mx-1 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-5">No tasks found yet</p>
      )}

      {/* Modal Component */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Task</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                {...register("title", { required: true })}
                placeholder="Enter task title"
                className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                placeholder="Enter task description (optional)"
                className="w-full px-4 py-3 border rounded-xl shadow-sm h-28 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-bold rounded-xl shadow-lg transform hover:scale-105 transition duration-200"
            >
              Update Task
            </button>
          </form>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ManageTasks;
