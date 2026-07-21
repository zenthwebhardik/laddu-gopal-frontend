import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const sparkIdRef = useRef(0);
  const [trailSparks, setTrailSparks] = useState([]);
  
  // Throttle spark generation
  const lastSparkTimeRef = useRef(Date.now());
  const lastMousePosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const currentX = e.clientX;
      const currentY = e.clientY;
      setMousePosition({ x: currentX, y: currentY });
      
      const now = Date.now();
      // Calculate distance moved
      const dx = currentX - lastMousePosRef.current.x;
      const dy = currentY - lastMousePosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Emit sparks if moving fast enough or dragging, and throttled by time
      const timeThreshold = isDragging ? 15 : 40; // Emit faster when dragging
      const distThreshold = isDragging ? 5 : 20;

      if (now - lastSparkTimeRef.current > timeThreshold && distance > distThreshold) {
        lastSparkTimeRef.current = now;
        lastMousePosRef.current = { x: currentX, y: currentY };
        
        // When dragging, emit denser sparks (e.g. 2-3 per frame)
        const sparksToEmit = isDragging ? 3 : 1;
        
        const newSparks = Array.from({ length: sparksToEmit }).map(() => ({
          id: sparkIdRef.current++,
          x: currentX,
          y: currentY,
          // Random offset for realism, larger when not dragging
          offsetX: (Math.random() - 0.5) * (isDragging ? 8 : 15),
          offsetY: (Math.random() - 0.5) * (isDragging ? 8 : 15),
          isHot: isDragging, // Dragging makes it a "hot" weld
        }));
        
        setTrailSparks(prev => [...prev.slice(-80), ...newSparks]); // Keep max 80-100 sparks
        
        // Clean up sparks after they fade
        setTimeout(() => {
          setTrailSparks(prev => prev.filter(s => !newSparks.includes(s)));
        }, isDragging ? 1200 : 800);
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('portfolio-item')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    // Also support touch events for mobile
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
      }
    };
    
    const handleTouchStart = (e) => {
      setIsDragging(true);
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setMousePosition({ x: touch.clientX, y: touch.clientY });
        lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };
    
    const handleTouchEnd = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <>
      <motion.div
        className="custom-cursor-dot"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering || isDragging ? 0 : 1, // Hide dot when dragging or hovering
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      
      <motion.div
        className="custom-cursor-outline"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : (isDragging ? 0.8 : 1),
          backgroundColor: isHovering ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
          borderColor: isDragging 
            ? 'rgba(255, 255, 255, 0.8)' // Hot white outline when dragging
            : (isHovering ? 'rgba(245, 158, 11, 0.5)' : 'rgba(245, 158, 11, 0.3)'),
          borderWidth: isDragging ? '2px' : '1px'
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.15 }}
      />

      {/* Trailing sparks along the path */}
      <AnimatePresence>
        {trailSparks.map(spark => (
          <motion.div
            key={spark.id}
            className="cursor-spark"
            initial={{ 
              x: spark.x + spark.offsetX, 
              y: spark.y + spark.offsetY, 
              opacity: spark.isHot ? 1 : 0.8, 
              scale: spark.isHot ? 1.2 : 1,
              backgroundColor: '#ffffff', // Starts hot white
              boxShadow: spark.isHot ? '0 0 8px 2px rgba(255, 255, 255, 0.8)' : 'none'
            }}
            animate={{ 
              y: spark.y + spark.offsetY + (spark.isHot ? 40 : 20), // Fall downwards like cooling slag
              x: spark.x + spark.offsetX + (Math.random() - 0.5) * 20, // Drift slightly horizontally
              opacity: 0,
              scale: 0,
              backgroundColor: '#8b0000', // Cools to dark red
              boxShadow: '0 0 0px 0px rgba(0,0,0,0)'
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: spark.isHot ? 1.0 : 0.6, 
              ease: "easeOut",
              backgroundColor: { 
                times: [0, 0.2, 0.6, 1],
                // White -> Intense Orange -> Red -> Dark Red
                values: ['#ffffff', '#ff6a00', '#ff0000', '#8b0000']
              }
            }}
            style={{ 
              pointerEvents: 'none',
              zIndex: 9998
            }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
