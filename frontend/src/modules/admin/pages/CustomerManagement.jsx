// Simplified Customer Management
import React, { useState, useMemo } from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import {
    Users,
    Search,
    Download,
    Eye,
    Phone,
    ShoppingBag,
    MoreVertical,
    UserPlus,
    RotateCw,
    Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const CustomerManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isExporting, setIsExporting] = useState(false);

    // Simplified Mock Customer Data
    const [customers] = useState([
        {
            id: 'CUST-001',
            name: 'Anjali Sharma',
            email: 'anjali.s@example.com',
            phone: '+91 98765-43210',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali',
            totalOrders: 42,
            ltv: 24500,
            joinedDate: '12 Jan 2023',
            status: 'active',
            lastOrder: '2 hours ago'
        },
        {
            id: 'CUST-002',
            name: 'Rohan Mehta',
            email: 'rohan.m@techcorp.in',
            phone: '+91 99887-76655',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
            totalOrders: 15,
            ltv: 8200,
            joinedDate: '05 Mar 2023',
            status: 'active',
            lastOrder: 'Yesterday'
        },
        {
            id: 'CUST-003',
            name: 'Priya Iyer',
            email: 'priya09@gmail.com',
            phone: '+91 91234-56789',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
            totalOrders: 4,
            ltv: 1500,
            joinedDate: '20 Dec 2023',
            status: 'inactive',
            lastOrder: '1 month ago'
        },
        {
            id: 'CUST-004',
            name: 'Vikram Singh',
            email: 'vikram.singh@gmail.com',
            phone: '+91 98822-11004',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
            totalOrders: 88,
            ltv: 112000,
            joinedDate: '15 Oct 2022',
            status: 'active',
            lastOrder: '30 mins ago'
        }
    ]);

    const stats = useMemo(() => {
        return {
            total: customers.length,
            active: customers.filter(c => c.status === 'active').length,
            newToday: 2 // Simulated
        };
    }, [customers]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.phone.includes(searchTerm);
            const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [customers, searchTerm, filterStatus]);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert('Customer database exported successfully!');
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
                <div>
                    <h1 className="admin-h1 flex items-center gap-3">
                        Customers
                        <div className="p-2 bg-sky-100 rounded-xl">
                            <Users className="h-5 w-5 text-sky-600" />
                        </div>
                    </h1>
                    <p className="admin-description mt-1">Manage and track all customer accounts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-5 py-3 bg-white ring-1 ring-slate-200 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
                    >
                        {isExporting ? <RotateCw className="h-4 w-4 animate-spin text-sky-500" /> : <Download className="h-4 w-4" />}
                        {isExporting ? 'EXPORTING...' : 'EXPORT USERS'}
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-sky-600 text-white rounded-2xl text-xs font-bold hover:bg-sky-700 transition-all shadow-lg active:scale-95 shadow-sky-200">
                        <UserPlus className="h-4 w-4" />
                        NEW CUSTOMER
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Customers', value: stats.total, icon: Users, bg: 'bg-sky-50', iconColor: 'text-sky-600' },
                    { label: 'Active Users', value: stats.active, icon: Activity, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
                    { label: 'New Today', value: stats.newToday, icon: UserPlus, bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
                ].map((stat, i) => (
                    <Card key={i} className="p-6 border-none shadow-sm ring-1 ring-slate-100 bg-white group hover:ring-sky-200 transition-all overflow-hidden relative">
                        <div className="relative z-10 flex items-center gap-4">
                            <div className={cn("p-3 rounded-2xl h-12 w-12 flex items-center justify-center", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.iconColor)} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Filter & Search Bar */}
            <Card className="p-4 border-none shadow-xl ring-1 ring-slate-100/50 bg-white/80 backdrop-blur-xl rounded-[28px]">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-semibold outline-none focus:ring-2 focus:ring-sky-500/10 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            {['all', 'active', 'inactive'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all",
                                        filterStatus === status ? "bg-white text-sky-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Customer List Table */}
            <Card className="border-none shadow-2xl ring-1 ring-slate-100 overflow-hidden bg-white rounded-[32px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="admin-table-header pl-8 py-5">Customer</th>
                                <th className="admin-table-header">Activity</th>
                                <th className="admin-table-header">Total Spend</th>
                                <th className="admin-table-header">Status</th>
                                <th className="admin-table-header text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredCustomers.map((cust) => (
                                <tr key={cust.id} className="group hover:bg-slate-50/40 transition-all">
                                    <td className="px-6 py-5 pl-8">
                                        <div className="flex items-center gap-4">
                                            <img src={cust.avatar} alt="" className="h-12 w-12 rounded-2xl bg-slate-100 ring-4 ring-white shadow-sm" />
                                            <div>
                                                <p
                                                    onClick={() => navigate(`/admin/customers/${cust.id}`)}
                                                    className="text-sm font-black text-slate-900 leading-none hover:text-sky-600 cursor-pointer transition-colors"
                                                >
                                                    {cust.name}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{cust.email}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Phone className="h-2.5 w-2.5 text-slate-300" />
                                                    <span className="text-[9px] font-black text-slate-400">{cust.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div>
                                            <div className="flex items-center gap-1.5 font-black text-slate-700 text-xs">
                                                <ShoppingBag className="h-3 w-3 text-sky-500" />
                                                {cust.totalOrders} Orders
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">Last: {cust.lastOrder}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-black text-slate-900 text-sm">
                                        ₹{cust.ltv.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge
                                            variant={cust.status === 'active' ? 'success' : 'danger'}
                                            className="text-[8px] font-black px-2 py-0.5 uppercase tracking-widest"
                                        >
                                            {cust.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5 text-right pr-8">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/customers/${cust.id}`)}
                                                className="p-2.5 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-600 hover:text-white transition-all active:scale-90"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default CustomerManagement;
