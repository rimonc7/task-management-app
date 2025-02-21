import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hook/useAxiosPublic";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import Swal from "sweetalert2";

const ManageTasks = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

  // Fetch tasks for the logged-in user
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

  // Handle task deletion
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

  return (
    <div className="p-6 lg:mx-40">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Tasks</h2>

      {isLoading ? (
        <p className="text-gray-600">Loading tasks...</p>
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
                <tr key={task._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="py-3 px-6">{task.title}</td>
                  <td className="py-3 px-6">{task.description || "No description"}</td>
                  <td className="py-3 px-6 text-center">{task.category}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No tasks found for {user?.email}</p>
      )}
    </div>
  );
};

export default ManageTasks;
