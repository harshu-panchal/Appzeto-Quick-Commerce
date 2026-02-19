import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { ChevronRight, Check, ChevronsRight } from 'lucide-react';

const SlideToPay = ({
    onSuccess,
    amount,
    isLoading = false,
    disabled = false,
    text = "Slide to Pay"
}) => {
    const [isCompleted, setIsCompleted] = useState(false);
    const controls = useAnimation();
    const x = useMotionValue(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [sliderWidth, setSliderWidth] = useState(56); // Width of the sliding circle

    // Maximum drag distance
    const maxDrag = Math.max(0, containerWidth - sliderWidth - 8); // 8px padding

    // Transform x to background opacity or color if needed
    const opacity = useTransform(x, [0, maxDrag], [1, 0]);
    const textOpacity = useTransform(x, [0, maxDrag * 0.5], [1, 0]);
    const shimmerOpacity = useTransform(x, [0, maxDrag * 0.3], [1, 0]);

    // Rotation transform based on drag position
    const rotate = useTransform(x, [0, maxDrag], [0, 360]);
    // Opacity for the arrows to fade out as it completes
    const arrowsOpacity = useTransform(x, [0, maxDrag * 0.8], [1, 0]);
    // Opacity for the checkmark to fade in
    const checkOpacity = useTransform(x, [maxDrag * 0.5, maxDrag], [0, 1]);

    // Background fill progress
    const fillWidth = useTransform(x, [0, maxDrag], [0, containerWidth]);

    const handleDragEnd = async () => {
        const currentX = x.get();
        if (currentX >= maxDrag * 0.9) {
            // Success threshold reached
            setIsCompleted(true);
            controls.start({ x: maxDrag });
            if (onSuccess) {
                await onSuccess();
            }
        } else {
            // Snap back
            controls.start({ x: 0 });
        }
    };

    useEffect(() => {
        if (isLoading) {
            // Loading state if handled externally
        }
    }, [isLoading]);


    return (
        <div
            className="relative h-16 w-full bg-green-50 rounded-full overflow-hidden select-none touch-none shadow-inner border border-green-200"
            ref={(el) => el && setContainerWidth(el.offsetWidth)}
        >
            {/* Progress Fill */}
            <motion.div
                className="absolute inset-y-0 left-0 bg-[#0c831f]"
                style={{ width: fillWidth }}
            />

            {/* Shimmer Effect Background (Only visible when not dragged much) */}
            <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{ opacity: shimmerOpacity }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] w-[200%] animate-[shimmer_2s_infinite]" />
            </motion.div>

            {/* Text Label */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                style={{ opacity: textOpacity }}
            >
                <span className="text-[#0c831f]/70 font-black text-sm tracking-widest uppercase flex items-center gap-2">
                    {text} <span className="text-[#0c831f]/30">|</span> <span className="text-slate-900">₹{amount}</span>
                </span>

                <div className="absolute right-4 animate-pulse text-[#0c831f]/50">
                    <ChevronsRight size={20} />
                </div>
            </motion.div>

            {/* Success State Text */}
            {isCompleted && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                >
                    <span className="text-white font-black text-lg tracking-wide uppercase flex items-center gap-2">
                        Processing <span className="animate-pulse">...</span>
                    </span>
                </motion.div>
            )}

            {/* Draggable Circle */}
            <motion.div
                className="absolute left-1 top-1 bottom-1 w-14 h-14 bg-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-20 shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-slate-100"
                drag={!isCompleted && !isLoading ? "x" : false}
                dragConstraints={{ left: 0, right: maxDrag }}
                dragElastic={0.05}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
            >
                {isLoading || isCompleted ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-6 w-6 border-2 border-[#0c831f] border-t-transparent rounded-full animate-spin"
                    />
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <motion.div className="text-[#0c831f]" style={{ opacity: arrowsOpacity }}>
                            <ChevronRight size={28} strokeWidth={3} />
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default SlideToPay;
