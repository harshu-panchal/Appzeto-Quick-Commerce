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
        <ShadcnCard className={cn("overflow-hidden", className)} {...props}>
            {(title || subtitle || headerAction) && (
                <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-50/50 bg-gray-50/10 px-6 py-4">
                    <div className="space-y-1">
                        {title && <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>}
                        {subtitle && <CardDescription className="text-sm font-medium text-gray-500">{subtitle}</CardDescription>}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </CardHeader>
            )}
            <CardContent className={cn("p-6", !title && !subtitle && !headerAction && "pt-6")}>
                {children}
            </CardContent>
            {footer && (
                <CardFooter className="bg-gray-50/30 border-t border-gray-100/50 px-6 py-4">
                    {footer}
                </CardFooter>
            )}
        </ShadcnCard>
    );
};

export default Card;

