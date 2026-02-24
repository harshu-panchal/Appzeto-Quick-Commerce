import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Home, Briefcase, MoreVertical, Trash2, Edit2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from 'react';

const AddressesPage = () => {
    const navigate = useNavigate();
    // Mock addresses
    const addresses = [
        {
            id: 1,
            type: 'Home',
            name: 'John Doe',
            address: 'Flat 402, Sunshine Apartments, Sector 12, Dwarka',
            city: 'New Delhi - 110075',
            phone: '+91 98765 43210',
            isDefault: true
        },
        {
            id: 2,
            type: 'Work',
            name: 'John Doe',
            address: 'Office No. 5, Technohub, Cyber City',
            city: 'Gurugram - 122002',
            phone: '+91 98765 43210',
            isDefault: false
        }
    ];

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const handleEdit = (addr) => {
        setSelectedAddress(addr);
        setIsEditOpen(true);
    };

    const handleDelete = (addr) => {
        setSelectedAddress(addr);
        setIsDeleteOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0c831f] to-[#149d29] px-5 pt-8 pb-20 relative z-10 rounded-b-[2.5rem] shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
                <div className="flex items-center gap-2 mb-2 relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors -ml-2"
                    >
                        <ChevronLeft size={28} className="text-white" />
                    </button>
                    <h1 className="text-3xl font-black text-white tracking-tight">Saved Addresses</h1>
                </div>
                <p className="text-green-50 text-sm font-medium mt-1 relative z-10">Manage your delivery locations</p>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-10 relative z-20 space-y-6">
                {/* Add New Address Button */}
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="w-full bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-dashed border-[#0c831f]/30 flex items-center justify-center gap-3 text-[#0c831f] hover:bg-green-50 transition-colors group"
                >
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={20} strokeWidth={3} />
                    </div>
                    <span className="font-bold text-lg">Add New Address</span>
                </button>

                {/* Address List */}
                <div className="space-y-4">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
                            {addr.isDefault && (
                                <div className="absolute top-0 right-0 bg-[#0c831f] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                                    Default
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0">
                                    {addr.type === 'Home' ? <Home size={20} /> : <Briefcase size={20} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-black text-slate-800">{addr.type}</h3>
                                    </div>
                                    <p className="text-slate-800 font-bold text-sm mb-1">{addr.name}</p>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-1">{addr.address}</p>
                                    <p className="text-slate-500 text-sm mb-3">{addr.city}</p>
                                    <p className="text-slate-800 font-bold text-sm">Phone: {addr.phone}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-50">
                                <button
                                    onClick={() => handleEdit(addr)}
                                    className="flex-1 py-2 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(addr)}
                                    className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Address Modal */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                        <DialogDescription>
                            Enter your delivery details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Address Type</Label>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 border-[#0c831f] text-[#0c831f] bg-green-50">Home</Button>
                                <Button variant="outline" className="flex-1">Work</Button>
                                <Button variant="outline" className="flex-1">Other</Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" placeholder="+91 98765 43210" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea id="address" placeholder="Flat No, Building, Street" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="city">City & Pincode</Label>
                            <Input id="city" placeholder="New Delhi - 110075" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button className="bg-[#0c831f] hover:bg-[#0b721b]" onClick={() => setIsAddOpen(false)}>Save Address</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Address Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Address</DialogTitle>
                        <DialogDescription>
                            Update your delivery details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Address Type</Label>
                            <div className="flex gap-2">
                                <Button variant="outline" className={selectedAddress?.type === 'Home' ? "flex-1 border-[#0c831f] text-[#0c831f] bg-green-50" : "flex-1"}>Home</Button>
                                <Button variant="outline" className={selectedAddress?.type === 'Work' ? "flex-1 border-[#0c831f] text-[#0c831f] bg-green-50" : "flex-1"}>Work</Button>
                                <Button variant="outline" className="flex-1">Other</Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input id="edit-name" defaultValue={selectedAddress?.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-phone">Phone Number</Label>
                            <Input id="edit-phone" defaultValue={selectedAddress?.phone} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-address">Address</Label>
                            <Textarea id="edit-address" defaultValue={selectedAddress?.address} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-city">City & Pincode</Label>
                            <Input id="edit-city" defaultValue={selectedAddress?.city} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button className="bg-[#0c831f] hover:bg-[#0b721b]" onClick={() => setIsEditOpen(false)}>Update Address</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Delete Address?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this address? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedAddress && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 my-2">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-800">{selectedAddress.type}</span>
                            </div>
                            <p className="text-slate-600 text-sm">{selectedAddress.address}</p>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={() => setIsDeleteOpen(false)}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddressesPage;
