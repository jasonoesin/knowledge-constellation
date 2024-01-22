import { AnimatePresence, motion } from "framer-motion";

export const Tooltip = (props) => {
  const data = props.data;

  console.log(data);

  if (data == null) return;

  const category = data.labels[0];
  const color = data.color;

  const properties = Object.entries(data.properties).map(([key, value]) => (
    <div className="" key={key}>
      <strong className="bg-[#333336] rounded-full px-3 py-1 w-fit mr-2 h-fit">
        {key}
      </strong>
      : {typeof value === "object" ? value.low : value}
    </div>
  ));

  return (
    <AnimatePresence>
      {data.id && (
        <motion.div
          key={"Tooltip"}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          exit={{ opacity: 0 }}
          className="absolute z-[10] bottom-[2rem] left-[2rem] bg-[#1c1f21] w-[30rem] h-fit rounded-xl shadow-md px-4 py-4 flex flex-col gap-2"
        >
          <strong className="">Node Details</strong>
          <div
            style={{ backgroundColor: color }}
            className="w-fit px-3 py-1 rounded-full"
          >
            {category}
          </div>
          <strong className="">Properties</strong>
          <div className="flex gap-2 flex-col">{properties}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
