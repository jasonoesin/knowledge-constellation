import { AnimatePresence, motion } from "framer-motion";

export const Tooltip = (props) => {
  const data = props.data;

  if (data == null) return;

  const category = data.labels[0];
  const color = data.color;

  return (
    <AnimatePresence>
      {props.data && (
        <motion.div
          key={"Tooltip"}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          exit={{ opacity: 0 }}
          className="absolute z-[10] bottom-[4rem] left-[2rem] bg-[#1c1f21] w-[25rem]  h-fit rounded-xl shadow-md px-4 py-4 flex flex-col gap-2"
        >
          <strong className="">Node Details</strong>
          <div
            style={{ backgroundColor: color }}
            className="w-fit px-3 py-1 rounded-full"
          >
            {category}
          </div>
          <strong className="">Properties</strong>
          <div className="flex gap-2 flex-col">
            {Object.entries(data.properties).map(([key, value]) => (
              <div className="">
                <strong className="bg-[#333336] rounded-full px-3 py-1 w-fit mr-2 h-fit">
                  {key}
                </strong>
                : {value}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
