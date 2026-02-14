import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Sidebar = ({ items, title }) => {
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl">
            <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
                <h1 className="text-xl font-bold tracking-wider text-primary">{title}</h1>
            </div>
            <nav className="mt-6 px-4 space-y-2">
                {items.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200',
                                isActive
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                                    : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            )
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium text-sm">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};


export default Sidebar;
