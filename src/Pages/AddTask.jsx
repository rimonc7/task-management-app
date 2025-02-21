import { useForm } from "react-hook-form";
import useAxiosPublic from "../Hook/useAxiosPublic";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import Swal from "sweetalert2";

const AddTask = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const { register, handleSubmit, reset } = useForm();
  const handleAddTask = async (data) => {
    const { title, description, category } = data;
    const taskInfo = {
      user: user?.email,
      title,
      description,
      category,
    };

    axiosPublic.post("/tasks", taskInfo).then((res) => {
      if (res.data.insertedId) {
        Swal.fire({
          title: "Task Added",
          icon: "success",
          draggable: true,
        });
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Add New Task
        </h2>
        <form onSubmit={handleSubmit(handleAddTask)} className="space-y-5">
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
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
