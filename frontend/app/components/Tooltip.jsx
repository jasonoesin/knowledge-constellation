export const Tooltip = (props) => {
  return (
    <AnimatePresence>
      {props.data && (
        <motion.div
          key={"Tooltip"}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          exit={{ opacity: 0 }}
          className="absolute z-[10] bottom-[2rem] right-[2rem] bg-white w-[20rem] h-[8rem] rounded shadow-md px-4 py-2"
        >
          <div className="">{props.data.title}</div>
          <div className="">{props.data.description}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
