import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = ({ children, navItems, title }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar items={navItems} title={title} />
            <div className="pl-64">
                <Topbar />
                <main className="pt-16 p-8 min-h-screen">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
