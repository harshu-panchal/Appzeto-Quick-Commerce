// Simplified Customer Management
import React, { useState, useMemo } from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import PageHeader from '@shared/components/ui/PageHeader';
import StatCard from '@shared/components/ui/StatCard';
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
            totalSpent: 24500,
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
            totalSpent: 8200,
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
            totalSpent: 1500,
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
            totalSpent: 112000,
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
        <div className="ds-section-spacing">
            <PageHeader
                title="Customers"
                description="Manage and track all customer accounts"
                badge={
                    <div className="ds-stat-card-icon bg-sky-50">
                        <Users className="ds-icon-lg text-sky-600" />
                    </div>
                }
                actions={
                    <>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="ds-btn ds-btn-md bg-white ring-1 ring-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                            {isExporting ? <RotateCw className="ds-icon-sm animate-spin" /> : <Download className="ds-icon-sm" />}
                            {isExporting ? 'EXPORTING...' : 'EXPORT'}
                        </button>
                        <button className="ds-btn ds-btn-md bg-primary text-white shadow-lg shadow-primary/20">
                            <UserPlus className="ds-icon-sm" />
                            NEW CUSTOMER
                        </button>
                    </>
                }
            />

            {/* Quick Stats Grid */}
            <div className="ds-grid-cards-3">
                <StatCard
                    label="Total Customers"
                    value={stats.total}
                    icon={Users}
                    color="text-sky-600"
                    bg="bg-sky-50"
                />
                <StatCard
                    label="Active Users"
                    value={stats.active}
                    icon={Activity}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                />
                <StatCard
                    label="New Today"
                    value={stats.newToday}
                    icon={UserPlus}
                    color="text-indigo-600"
                    bg="bg-indigo-50"
                />
            </div>

            {/* Filter & Search Bar */}
            <Card className="ds-card-compact">
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 ds-icon-sm text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="ds-input pl-9"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex bg-gray-100 p-0.5 rounded-lg">
                            {['all', 'active', 'inactive'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md ds-caption transition-all",
                                        filterStatus === status ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
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
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="ds-table">
                        <thead className="ds-table-header">
                            <tr>
                                <th className="ds-table-header-cell">Customer</th>
                                <th className="ds-table-header-cell">Activity</th>
                                <th className="ds-table-header-cell">Total Spend</th>
                                <th className="ds-table-header-cell">Status</th>
                                <th className="ds-table-header-cell text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((cust) => (
                                <tr key={cust.id} className="ds-table-row">
                                    <td className="ds-table-cell">
                                        <div className="flex items-center gap-3">
                                            <img src={cust.avatar} alt="" className="h-10 w-10 rounded-lg bg-gray-100 ring-2 ring-white shadow-sm" />
                                            <div>
                                                <p
                                                    onClick={() => navigate(`/admin/customers/${cust.id}`)}
                                                    className="ds-h4 hover:text-primary cursor-pointer transition-colors"
                                                >
                                                    {cust.name}
                                                </p>
                                                <p className="ds-body-sm text-gray-500">{cust.email}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <Phone className="ds-icon-sm text-gray-300" />
                                                    <span className="text-[9px] text-gray-400">{cust.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="ds-table-cell">
                                        <div>
                                            <div className="flex items-center gap-1.5 ds-body font-semibold">
                                                <ShoppingBag className="ds-icon-sm text-primary" />
                                                {cust.totalOrders} Orders
                                            </div>
                                            <p className="ds-body-sm text-gray-400 mt-0.5">Last: {cust.lastOrder}</p>
                                        </div>
                                    </td>
                                    <td className="ds-table-cell ds-h4">
                                        ₹{cust.totalSpent.toLocaleString()}
                                    </td>
                                    <td className="ds-table-cell">
                                        <Badge
                                            variant={cust.status === 'active' ? 'success' : 'error'}
                                            className="ds-badge"
                                        >
                                            {cust.status}
                                        </Badge>
                                    </td>
                                    <td className="ds-table-cell text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/customers/${cust.id}`)}
                                                className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                                            >
                                                <Eye className="ds-icon-sm" />
                                            </button>
                                            <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-900 hover:text-white transition-all">
                                                <MoreVertical className="ds-icon-sm" />
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
