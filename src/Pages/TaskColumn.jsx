import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";
import { Link } from "react-router-dom";

const TaskColumn = ({ category, tasks, updateTask }) => {
  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      if (item.category !== category) {
        updateTask({ taskId: item._id, newCategory: category });
      }
    },
  });

  return (
    <div
      ref={drop}
      className="bg-gray-100 w-80 min-h-64 p-4 rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold mb-2">{category}</h3>
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
      <Link className="btn text-sm flex justify-center w-fit mx-auto " to='/add-task'>Add Task</Link>
    </div>
  );
};

export default TaskColumn;
