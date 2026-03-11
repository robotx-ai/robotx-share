"use client";

import { motion } from "framer-motion";
import {
  LuCamera,
  LuLayoutDashboard,
  LuMonitor,
  LuShield,
  LuTriangleAlert,
  LuTruck,
  LuUsers,
  LuWifi,
  LuWrench,
  LuZap,
} from "react-icons/lu";

const offers = [
  { label: "Live operator monitoring", icon: LuMonitor },
  { label: "Rapid response support", icon: LuZap },
  { label: "Remote connectivity", icon: LuWifi },
  { label: "On-site onboarding", icon: LuUsers },
  { label: "Safety camera monitoring", icon: LuCamera },
  { label: "Daily maintenance checks", icon: LuWrench },
  { label: "Dedicated control workspace", icon: LuLayoutDashboard },
  { label: "Safety compliance protocols", icon: LuShield },
  { label: "On-site deployment support", icon: LuTruck },
  { label: "Emergency response readiness", icon: LuTriangleAlert },
];

function Offers() {
  return (
    <div>
      <p className="text-xl font-semibold">What this service includes</p>
      <div className="grid grid-cols-2 gap-x-12 gap-y-3 pt-6">
        {offers.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="flex items-center gap-3"
          >
            <item.icon size={20} className="text-neutral-700 flex-shrink-0" />
            <p className="text-neutral-500 text-sm">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Offers;
