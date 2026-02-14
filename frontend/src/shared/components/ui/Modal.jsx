import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
    const sizes = {
        sm: 'sm:max-w-md',
        md: 'sm:max-w-lg',
        lg: 'sm:max-w-2xl',
        xl: 'sm:max-w-4xl',
        full: 'sm:max-w-[95vw] h-[95vh]',
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={cn("overflow-hidden p-0", sizes[size])}>
                <DialogHeader className="px-6 py-4 border-b border-gray-100/50 bg-gray-50/10">
                    <DialogTitle className="text-xl font-bold text-gray-900">{title}</DialogTitle>
                </DialogHeader>

                <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>

                {footer && (
                    <DialogFooter className="px-6 py-4 bg-gray-50/30 border-t border-gray-100/50 sm:justify-end gap-3">
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Modal;

