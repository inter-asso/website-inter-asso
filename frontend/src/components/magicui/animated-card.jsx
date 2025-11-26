import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AnimatedCard({
  children,
  className,
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
