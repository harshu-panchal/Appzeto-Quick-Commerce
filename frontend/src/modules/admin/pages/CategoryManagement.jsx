import React, { useState, useMemo } from 'react';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import {
    HiOutlinePlus,
    HiOutlineChevronRight,
    HiOutlineChevronDown,
    HiOutlineTrash,
    HiOutlinePencilSquare,
    HiOutlineFolderOpen,
    HiOutlineFolder,
    HiOutlineTag,
    HiOutlineMagnifyingGlass,
    HiOutlineFunnel,
    HiOutlineXMark,
    HiOutlinePhoto,
    HiOutlineExclamationTriangle,
    HiOutlineEye,
    HiOutlineEyeSlash
} from 'react-icons/hi2';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([
        {
            id: 'h1',
            name: 'Grocery',
            slug: 'grocery',
            description: 'All daily essential items',
            status: 'active',
            type: 'header',
            children: [
                {
                    id: 'c1',
                    name: 'Fruits & Vegetables',
                    slug: 'fruits-vegetables',
                    description: 'Fresh from farms',
                    status: 'active',
                    type: 'category',
                    children: [
                        { id: 's1', name: 'Fresh Fruits', slug: 'fresh-fruits', status: 'active', type: 'subcategory' },
                        { id: 's2', name: 'Fresh Vegetables', slug: 'fresh-vegetables', status: 'active', type: 'subcategory' },
                    ]
                },
                {
                    id: 'c2',
                    name: 'Dairy & Bread',
                    slug: 'dairy-bread',
                    status: 'active',
                    type: 'category',
                    children: [
                        { id: 's3', name: 'Milk', slug: 'milk', status: 'active', type: 'subcategory' },
                        { id: 's4', name: 'Bread & Pav', slug: 'bread', status: 'inactive', type: 'subcategory' },
                    ]
                }
            ]
        },
        {
            id: 'h2',
            name: 'Electronics',
            slug: 'electronics',
            status: 'active',
            type: 'header',
            children: [
                {
                    id: 'c3',
                    name: 'Mobile Phones',
                    slug: 'mobile-phones',
                    status: 'active',
                    type: 'category',
                    children: [
                        { id: 's5', name: 'Smartphone', slug: 'smartphone', status: 'active', type: 'subcategory' },
                        { id: 's6', name: 'Keypad Phones', slug: 'keypad', status: 'active', type: 'subcategory' },
                    ]
                }
            ]
        }
    ]);

    const [expanded, setExpanded] = useState(['h1', 'h2', 'c1']);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        status: 'active',
        type: 'header',
        parentId: ''
    });

    const [filterStatus, setFilterStatus] = useState('all');

    const toggleExpand = (id) => {
        setExpanded(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const expandAll = () => {
        const allIds = [];
        const traverse = (items) => {
            items.forEach(item => {
                if (item.children) {
                    allIds.push(item.id);
                    traverse(item.children);
                }
            });
        };
        traverse(categories);
        setExpanded(allIds);
    };

    const collapseAll = () => setExpanded([]);

    const filteredCategories = useMemo(() => {
        if (!searchTerm && filterStatus === 'all') return categories;

        const filterNode = (node) => {
            const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || node.status === filterStatus;

            let filteredChildren = [];
            if (node.children) {
                filteredChildren = node.children.map(filterNode).filter(Boolean);
            }

            if (matchesSearch && matchesStatus) return { ...node, children: node.children };
            if (filteredChildren.length > 0) return { ...node, children: filteredChildren };
            return null;
        };

        return categories.map(filterNode).filter(Boolean);
    }, [categories, searchTerm, filterStatus]);

    const handleSave = () => {
        if (editingItem) {
            console.log('Editing:', formData);
        } else {
            console.log('Creating:', formData);
        }
        setIsAddModalOpen(false);
        setEditingItem(null);
    };

    const handleDelete = () => {
        console.log('Deleting:', deleteTarget.id);
        setIsDeleteModalOpen(false);
        setDeleteTarget(null);
    };

    const openModal = (type, parentId = '', item = null) => {
        if (item) {
            setFormData({
                name: item.name,
                slug: item.slug,
                description: item.description || '',
                status: item.status || 'active',
                type: item.type,
                parentId: parentId
            });
            setEditingItem(item);
        } else {
            setFormData({
                name: '',
                slug: '',
                description: '',
                status: 'active',
                type: type,
                parentId: parentId
            });
            setEditingItem(null);
        }
        setIsAddModalOpen(true);
    };

    const renderTree = (items, level = 0) => {
        return items.map(item => (
            <motion.div
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.id}
                className="select-none"
            >
                <div
                    className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl transition-all mb-1.5 group relative overflow-hidden",
                        level === 0 ? "bg-white shadow-sm ring-1 ring-gray-100 mt-3 border-l-4 border-indigo-500" : "hover:bg-gray-100/50",
                        expanded.includes(item.id) ? "bg-gray-50 ring-1 ring-gray-100" : ""
                    )}
                >
                    <div className="flex items-center space-x-2.5 flex-1 cursor-pointer" onClick={() => item.children && item.children.length > 0 && toggleExpand(item.id)}>
                        <div style={{ paddingLeft: `${level * 24}px` }} className="flex items-center space-x-3">
                            {item.children && item.children.length > 0 ? (
                                <div className={cn(
                                    "p-0.5 rounded transition-colors",
                                    expanded.includes(item.id) ? "bg-primary/10 text-primary" : "text-gray-300 group-hover:text-gray-400"
                                )}>
                                    {expanded.includes(item.id) ?
                                        <HiOutlineChevronDown className="h-3.5 w-3.5" /> :
                                        <HiOutlineChevronRight className="h-3.5 w-3.5" />
                                    }
                                </div>
                            ) : (
                                <div className="w-5" />
                            )}

                            <div className={cn(
                                "h-8 w-8 rounded-lg flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105",
                                level === 0 ? "bg-indigo-50 text-indigo-600 ring-2 ring-indigo-50" :
                                    level === 1 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                            )}>
                                {level === 0 ? <HiOutlineFolderOpen className="h-4 w-4" /> :
                                    level === 1 ? <HiOutlineFolder className="h-4 w-4" /> :
                                        <HiOutlineTag className="h-3.5 w-3.5" />}
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center space-x-1.5">
                                    <span className={cn(
                                        "text-xs tracking-tight",
                                        level === 0 ? "font-bold text-gray-900" :
                                            level === 1 ? "font-semibold text-gray-700" : "font-medium text-gray-600"
                                    )}>
                                        {item.name}
                                    </span>
                                    {item.status === 'inactive' && (
                                        <Badge variant="gray" className="text-[7px] h-3 px-1 font-bold uppercase tracking-tighter">Draft</Badge>
                                    )}
                                </div>
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{item.slug}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 mr-1.5">
                        <div className="flex -space-x-0.5 items-center mr-1.5">
                            {item.children?.length > 0 && (
                                <span className="mr-1 text-[9px] font-bold text-gray-400">{item.children.length} items</span>
                            )}
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); openModal(item.type, '', item); }}
                            className="p-1.5 hover:bg-white hover:text-primary rounded-lg transition-all text-gray-400 shadow-sm ring-1 ring-gray-100 bg-white/50"
                        >
                            <HiOutlinePencilSquare className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); setIsDeleteModalOpen(true); }}
                            className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all text-gray-400 shadow-sm ring-1 ring-gray-100 bg-white/50"
                        >
                            <HiOutlineTrash className="h-3.5 w-3.5" />
                        </button>
                        {level < 2 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openModal(level === 0 ? 'category' : 'subcategory', item.id);
                                }}
                                className="p-1.5 bg-primary text-white hover:bg-indigo-700 rounded-lg transition-all shadow-md shadow-primary/20"
                            >
                                <HiOutlinePlus className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    <div className={cn(
                        "absolute right-0 top-0 bottom-0 w-1",
                        item.status === 'active' ? "bg-emerald-500" : "bg-gray-300"
                    )} />
                </div>
                <AnimatePresence>
                    {item.children && item.children.length > 0 && expanded.includes(item.id) && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            {renderTree(item.children, level + 1)}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        ));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-16">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="admin-h1 flex items-center gap-2">
                        Manage Categories
                        <Badge variant="primary" className="text-[9px] px-1.5 py-0 font-bold tracking-wider uppercase">Admin</Badge>
                    </h1>
                    <p className="admin-description mt-0.5">Organize your store by grouping items together into folders.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button className="p-2.5 bg-white ring-1 ring-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <HiOutlinePhoto className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => openModal('header')}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2"
                    >
                        <HiOutlinePlus className="h-4 w-4" />
                        <span>CREATE NEW HEADER</span>
                    </button>
                </div>
            </div>

            {/* Toolbox */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <Card className="lg:col-span-3 border-none shadow-sm ring-1 ring-slate-100 p-3 bg-white/60 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row gap-3 items-center">
                        <div className="relative flex-1 group w-full">
                            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-all" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search catalog..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border-none rounded-xl text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/5 transition-all outline-none"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 rounded-full transition-colors">
                                    <HiOutlineXMark className="h-3 w-3 text-slate-500" />
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2 shrink-0 w-full md:w-auto">
                            <button
                                onClick={() => setFilterStatus(prev => prev === 'active' ? 'all' : 'active')}
                                className={cn(
                                    "flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                                    filterStatus === 'active'
                                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                                        : "bg-white ring-1 ring-slate-200 text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                <HiOutlineFunnel className="h-4 w-4" />
                                <span>{filterStatus === 'active' ? 'SHOW ACTIVE' : 'SHOW ALL'}</span>
                            </button>
                            <button
                                onClick={expanded.length > 0 ? collapseAll : expandAll}
                                className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-white ring-1 ring-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:ring-primary hover:text-primary transition-all"
                            >
                                <span>{expanded.length > 0 ? 'CLOSE ALL' : 'OPEN ALL'}</span>
                            </button>
                        </div>
                    </div>
                </Card>

                <Card className="lg:col-span-1 border-none shadow-sm ring-1 ring-indigo-50 bg-gradient-to-tr from-indigo-50 to-white p-4 flex flex-col justify-between overflow-hidden relative">
                    <div className="z-10">
                        <p className="admin-label text-indigo-400 mb-1">Total Groups</p>
                        <h4 className="admin-stat-value text-indigo-900 line-height-none">254</h4>
                        <p className="text-[10px] font-semibold text-indigo-400 mt-1">Working Fine</p>
                    </div>
                    <HiOutlineFolderOpen className="absolute -right-2 -bottom-2 h-16 w-16 text-indigo-500/5 rotate-12" />
                </Card>
            </div>

            {/* Tree Section */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8">
                    <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 ring-1 ring-slate-100 min-h-[500px] shadow-xl shadow-slate-200/40">
                        {filteredCategories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-slate-300">
                                <HiOutlineFolder className="h-16 w-16 mb-3 opacity-20" />
                                <p className="text-base font-bold italic">No records found</p>
                                <button onClick={() => { setSearchTerm(''); setFilterStatus('all'); }} className="mt-3 text-sm text-primary font-semibold hover:underline">Clear all filters</button>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {renderTree(filteredCategories)}
                            </div>
                        )}
                    </div>
                </div>

                <div className="xl:col-span-4 space-y-6">
                    <Card className="bg-slate-900 border-none shadow-xl p-6 rounded-3xl text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-0.5">Help Guide</h3>
                            <p className="text-slate-500 text-[10px] font-medium mb-6">How to organize your groups</p>

                            <div className="space-y-4">
                                {[
                                    { step: '1', title: 'Main Group', desc: 'Big sections like Grocery.', color: 'bg-indigo-500' },
                                    { step: '2', title: 'Category', desc: 'Middle groups like Fruits.', color: 'bg-emerald-500' },
                                    { step: '3', title: 'Small Group', desc: 'Detailed groups.', color: 'bg-amber-500' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className={cn("h-8 w-8 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg rotate-2 group-hover:rotate-0 transition-transform duration-500", item.color)}>
                                            {item.step}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs mb-0.5">{item.title}</p>
                                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
                            onClick={() => setIsAddModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-3xl relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
                        >
                            <div className="lg:w-1/4 bg-slate-50 p-6 border-r border-slate-100 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="aspect-square w-full rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50 flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-slate-200 group">
                                        <HiOutlinePhoto className="h-8 w-8 text-slate-200" />
                                        <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-wider">Icon</p>
                                    </div>
                                    <div className="p-4 bg-slate-900 rounded-2xl text-white">
                                        <div className="flex flex-col items-center text-center">
                                            <Badge variant="primary" className="text-[7px] font-bold mb-1">{formData.type}</Badge>
                                            <span className="text-xs font-bold truncate w-full">{formData.name || 'Untitled'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-6 lg:p-8 relative">
                                <button onClick={() => setIsAddModalOpen(false)} className="absolute right-6 top-6 p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                    <HiOutlineXMark className="h-5 w-5" />
                                </button>

                                <div className="space-y-6">
                                    <header>
                                        <Badge variant="outline" className="text-[9px] font-bold uppercase bg-slate-50 mb-1.5">{formData.type} level</Badge>
                                        <h3 className="admin-h2">{editingItem ? 'Edit Group' : 'New Group'}</h3>
                                    </header>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Name</label>
                                            <input
                                                value={formData.name}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        name: val,
                                                        slug: val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                                                    });
                                                }}
                                                className="w-full px-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-semibold outline-none ring-primary/5 focus:ring-2"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Slug</label>
                                            <input value={formData.slug} readOnly className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm text-slate-400 font-semibold outline-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-semibold min-h-[80px] outline-none"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                        <p className="text-xs font-bold text-slate-900">Show to customers?</p>
                                        <div className="flex p-1 bg-slate-200/60 rounded-xl">
                                            <button onClick={() => setFormData({ ...formData, status: 'active' })} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1.5", formData.status === 'active' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500")}>
                                                <HiOutlineEye className="h-3.5 w-3.5" />
                                                <span>ACTIVE</span>
                                            </button>
                                            <button onClick={() => setFormData({ ...formData, status: 'inactive' })} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1.5", formData.status === 'inactive' ? "bg-white text-slate-700 shadow-sm" : "text-slate-500")}>
                                                <HiOutlineEyeSlash className="h-3.5 w-3.5" />
                                                <span>HIDE</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-100">DISCARD</button>
                                        <button onClick={handleSave} className="flex-[2] py-3 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-lg hover:-translate-y-0.5 transition-all">SAVE CHANGES</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md relative z-10 bg-white rounded-3xl p-8 text-center">
                            <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4"><HiOutlineExclamationTriangle className="h-8 w-8" /></div>
                            <h3 className="text-lg font-bold text-slate-900">Delete {deleteTarget?.name}?</h3>
                            <p className="text-slate-500 text-xs font-medium mt-2 leading-relaxed">This will permanently remove this group and everything inside it. You cannot undo this.</p>
                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-50">CANCEL</button>
                                <button onClick={handleDelete} className="flex-1 py-3 rounded-xl text-xs font-bold bg-rose-500 text-white shadow-md">DELETE</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryManagement;
