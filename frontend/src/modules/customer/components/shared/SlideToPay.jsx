import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';

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
    const textOpacity = useTransform(x, [0, maxDrag * 0.7], [1, 0]);

    // Rotation transform based on drag position
    const rotate = useTransform(x, [0, maxDrag], [0, 360]);
    // Opacity for the arrows to fade out as it completes
    const arrowsOpacity = useTransform(x, [0, maxDrag * 0.8], [1, 0]);
    // Opacity for the checkmark to fade in
    const checkOpacity = useTransform(x, [maxDrag * 0.5, maxDrag], [0, 1]);

    // Gradient width follows the slider
    const progressWidth = useTransform(x, [0, maxDrag], [sliderWidth + 8, containerWidth]);

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
            // Reset if loading starts (optional, or handle differently)
        }
        if (!isLoading && isCompleted && !disabled) {
            // Maybe reset after success if needed, but usually we navigate away
        }
    }, [isLoading, isCompleted, disabled]);


    return (
        <div
            className="relative h-16 w-full bg-[#0c831f] rounded-full overflow-hidden select-none touch-none shadow-lg shadow-green-200"
            ref={(el) => el && setContainerWidth(el.offsetWidth)}
        >
            {/* Shimmer Effect Background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 1 }}
                />
            </div>

            {/* Text Label */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                style={{ opacity: textOpacity }}
            >
                <span className="text-white font-bold text-lg tracking-wide">
                    {text} <span className="mx-1">|</span> ₹{amount}
                </span>

                {/* Visual Cue Arrows */}
                <div className="absolute left-20 flex opacity-50 animate-pulse">
                    <ChevronRight size={16} className="text-green-200" />
                    <ChevronRight size={16} className="text-green-100 -ml-2" />
                </div>
            </motion.div>

            {/* Progress Background (fills behind the slider) */}
            {/* <motion.div
                className="absolute left-0 top-0 bottom-0 bg-blue-700 rounded-full z-0"
                style={{ width: progressWidth }}
            /> */}

            {/* Draggable Circle */}
            <motion.div
                className="absolute left-1 top-1 bottom-1 w-14 h-14 bg-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-20 shadow-md"
                drag="x"
                dragConstraints={{ left: 0, right: maxDrag }}
                dragElastic={0.1} // Some resistance
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x, rotate }}
                whileTap={{ scale: 0.95 }}
            >
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-6 w-6 border-2 border-[#0c831f] border-t-transparent rounded-full animate-spin"
                    />
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ opacity: checkOpacity }}
                        >
                            <Check size={24} className="text-green-600" strokeWidth={3} />
                        </motion.div>

                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ opacity: arrowsOpacity }}
                        >
                            <div className="flex">
                                <ChevronRight size={24} className="text-[#0c831f] ml-0.5" strokeWidth={3} />
                                <ChevronRight size={24} className="text-[#4ade80] -ml-3" strokeWidth={3} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default SlideToPay;
