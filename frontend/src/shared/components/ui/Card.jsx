import React from 'react';
import {
    Card as ShadcnCard,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from '@/lib/utils';

const Card = ({ children, title, subtitle, className, headerAction, footer, ...props }) => {
    return (
        <ShadcnCard className={cn("glass-card border-none rounded-[2rem]", className)} {...props}>
            {(title || subtitle || headerAction) && (
                <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-100/50 bg-gray-50/20 px-8 py-6">
                    <div className="space-y-1.5">
                        {title && <CardTitle className="admin-h3 text-gray-900 tracking-tight">{title}</CardTitle>}
                        {subtitle && <CardDescription className="admin-description font-medium text-gray-500">{subtitle}</CardDescription>}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </CardHeader>
            )}
            <CardContent className={cn("p-8", !title && !subtitle && !headerAction && "pt-8")}>
                {children}
            </CardContent>
            {footer && (
                <CardFooter className="bg-gray-50/40 border-t border-gray-100/50 px-8 py-5">
                    {footer}
                </CardFooter>
            )}
        </ShadcnCard>
    );
};

export default Card;

