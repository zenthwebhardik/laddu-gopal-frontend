import { motion } from 'framer-motion';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
};

export default function PageWrapper({ children }) {
  return (
    <motion.main
      {...pageTransition}
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {children}
    </motion.main>
  );
}
