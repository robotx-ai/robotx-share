"use client";

import { motion } from "framer-motion";
import { LuBotMessageSquare, LuClipboardCheck, LuWrench } from "react-icons/lu";

const stages = [
  {
    icon: LuWrench,
    title: "Stage 1",
    desc: "On-site setup",
  },
  {
    icon: LuBotMessageSquare,
    title: "Stage 2",
    desc: "Active service window",
  },
  {
    icon: LuClipboardCheck,
    title: "Stage 3",
    desc: "Wrap-up and reporting",
  },
];

function Sleep() {
  return (
    <div>
      <p className="text-xl font-semibold">Deployment stages</p>
      <div className="flex justify-between pt-6 gap-4">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.12 }}
            className="flex-1 border border-neutral-200 rounded-xl px-5 py-5 flex flex-col gap-2"
          >
            <stage.icon size={22} className="text-neutral-700" />
            <p className="text-base font-semibold text-black">{stage.title}</p>
            <p className="text-sm text-neutral-500">{stage.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Sleep;
