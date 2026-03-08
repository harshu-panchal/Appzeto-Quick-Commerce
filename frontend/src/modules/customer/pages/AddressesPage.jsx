import { useNavigate } from 'react-router-dom';
import { Plus, Home, Briefcase, MapPin, Trash2, Edit2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { customerApi } from '../services/customerApi';

const AddressesPage = () => {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [rawAddresses, setRawAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileName, setProfileName] = useState('');
    const [profilePhone, setProfilePhone] = useState('');

    const fetchAddresses = useCallback(async () => {
        try {
            const { data } = await customerApi.getProfile();
            const profile = data?.result ?? data?.data ?? data;
            const raw = Array.isArray(profile?.addresses) ? profile.addresses : [];
            setRawAddresses(raw);
            setProfileName(profile?.name ?? '');
            setProfilePhone(profile?.phone ?? '');
            setAddresses(raw.map((addr, idx) => ({
                id: addr._id ?? idx,
                type: (addr.label || 'home').charAt(0).toUpperCase() + (addr.label || 'home').slice(1),
                name: profile?.name ?? '',
                address: addr.fullAddress || [addr.landmark, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ') || '',
                city: addr.city,
                state: addr.state,
                pincode: addr.pincode,
                phone: profile?.phone ?? '',
                isDefault: idx === 0
            })));
        } catch {
            setAddresses([]);
            setRawAddresses([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [saving, setSaving] = useState(false);

    const [addForm, setAddForm] = useState({
        type: 'home',
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    const openAddModal = () => {
        setAddForm({ type: 'home', name: profileName, phone: profilePhone || '', address: '', city: '', state: '', pincode: '' });
        setIsAddOpen(true);
    };

    const handleSaveNewAddress = async () => {
        const name = addForm.name?.trim();
        const address = addForm.address?.trim();
        const city = addForm.city?.trim();
        const state = addForm.state?.trim();
        const pincode = addForm.pincode?.trim();
        if (!address) {
            toast.error('Please enter the address');
            return;
        }
        const newAddr = {
            label: addForm.type.toLowerCase(),
            fullAddress: address,
            ...(city && { city }),
            ...(state && { state }),
            ...(pincode && { pincode })
        };
        setSaving(true);
        try {
            await customerApi.updateProfile({
                ...(name && { name }),
                ...(addForm.phone && { phone: addForm.phone.trim() }),
                addresses: [...rawAddresses, newAddr]
            });
            toast.success('Address saved successfully');
            setIsAddOpen(false);
            setLoading(true);
            await fetchAddresses();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save address');
        } finally {
            setSaving(false);
        }
    };

    const [editForm, setEditForm] = useState({
        type: 'home',
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [updating, setUpdating] = useState(false);

    const handleEdit = (addr) => {
        setSelectedAddress(addr);
        setEditForm({
            type: (addr.type || 'Home').toLowerCase(),
            name: addr.name ?? '',
            phone: addr.phone ?? '',
            address: addr.address ?? '',
            city: addr.city ?? '',
            state: addr.state ?? '',
            pincode: addr.pincode ?? ''
        });
        setIsEditOpen(true);
    };

    const handleUpdateAddress = async () => {
        if (!selectedAddress) return;
        const address = editForm.address?.trim();
        if (!address) {
            toast.error('Please enter the address');
            return;
        }
        const idx = addresses.findIndex(a => (a.id === selectedAddress.id) || (a.address === selectedAddress.address && a.type === selectedAddress.type));
        if (idx < 0) {
            setIsEditOpen(false);
            return;
        }
        const updatedRaw = {
            ...(rawAddresses[idx] && typeof rawAddresses[idx] === 'object' ? rawAddresses[idx] : {}),
            label: editForm.type.toLowerCase(),
            fullAddress: address,
            ...(editForm.city?.trim() && { city: editForm.city.trim() }),
            ...(editForm.state?.trim() && { state: editForm.state.trim() }),
            ...(editForm.pincode?.trim() && { pincode: editForm.pincode.trim() })
        };
        const updatedAddresses = rawAddresses.map((raw, i) => (i === idx ? updatedRaw : raw));
        setUpdating(true);
        try {
            await customerApi.updateProfile({
                ...(editForm.name?.trim() && { name: editForm.name.trim() }),
                ...(editForm.phone?.trim() && { phone: editForm.phone.trim() }),
                addresses: updatedAddresses
            });
            toast.success('Address updated successfully');
            setIsEditOpen(false);
            setSelectedAddress(null);
            setLoading(true);
            await fetchAddresses();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update address');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = (addr) => {
        setSelectedAddress(addr);
        setIsDeleteOpen(true);
    };

    const [deleting, setDeleting] = useState(false);

    const handleConfirmDelete = async () => {
        if (!selectedAddress) return;
        const idx = addresses.findIndex(a => (a.id === selectedAddress.id) || (a.address === selectedAddress.address && a.type === selectedAddress.type));
        if (idx < 0) {
            setIsDeleteOpen(false);
            return;
        }
        const updatedAddresses = rawAddresses.filter((_, i) => i !== idx);
        setDeleting(true);
        try {
            await customerApi.updateProfile({ addresses: updatedAddresses });
            toast.success('Address deleted successfully');
            setIsDeleteOpen(false);
            setSelectedAddress(null);
            setLoading(true);
            await fetchAddresses();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete address');
        } finally {
            setDeleting(false);
        }
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
                    onClick={openAddModal}
                    className="w-full bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-dashed border-[#0c831f]/30 flex items-center justify-center gap-3 text-[#0c831f] hover:bg-green-50 transition-colors group"
                >
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={20} strokeWidth={3} />
                    </div>
                    <span className="font-bold text-lg">Add New Address</span>
                </button>

                {/* Address List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center">
                            <p className="text-slate-500 font-medium">Loading addresses...</p>
                        </div>
                    ) : addresses.length === 0 ? (
                        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center">
                            <MapPin size={40} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-600 font-bold mb-1">No saved addresses</p>
                            <p className="text-slate-500 text-sm">Add your first delivery address above</p>
                        </div>
                    ) : addresses.map((addr) => (
                        <div key={addr.id} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
                            {addr.isDefault && (
                                <div className="absolute top-0 right-0 bg-[#0c831f] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                                    Default
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0">
                                    {addr.type === 'Home' ? <Home size={20} /> : addr.type === 'Work' ? <Briefcase size={20} /> : <MapPin size={20} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-black text-slate-800">{addr.type}</h3>
                                    </div>
                                    <p className="text-slate-800 font-bold text-sm mb-1">{addr.name}</p>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-1">{addr.address}</p>
                                    <p className="text-slate-500 text-sm mb-3">{[addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}</p>
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
                            <Label>Address Type</Label>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" className={`flex-1 ${addForm.type === 'home' ? 'border-[#0c831f] text-[#0c831f] bg-green-50' : ''}`} onClick={() => setAddForm(f => ({ ...f, type: 'home' }))}>Home</Button>
                                <Button type="button" variant="outline" className={`flex-1 ${addForm.type === 'work' ? 'border-[#0c831f] text-[#0c831f] bg-green-50' : ''}`} onClick={() => setAddForm(f => ({ ...f, type: 'work' }))}>Work</Button>
                                <Button type="button" variant="outline" className={`flex-1 ${addForm.type === 'other' ? 'border-[#0c831f] text-[#0c831f] bg-green-50' : ''}`} onClick={() => setAddForm(f => ({ ...f, type: 'other' }))}>Other</Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" placeholder="+91 98765 43210" value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea id="address" placeholder="Flat No, Building, Street" value={addForm.address} onChange={e => setAddForm(f => ({ ...f, address: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" placeholder="New Delhi" value={addForm.city} onChange={e => setAddForm(f => ({ ...f, city: e.target.value }))} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="state">State</Label>
                                <Input id="state" placeholder="Delhi" value={addForm.state} onChange={e => setAddForm(f => ({ ...f, state: e.target.value }))} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input id="pincode" placeholder="110075" value={addForm.pincode} onChange={e => setAddForm(f => ({ ...f, pincode: e.target.value }))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={saving}>Cancel</Button>
                        <Button className="bg-[#0c831f] hover:bg-[#0b721b]" onClick={handleSaveNewAddress} disabled={saving}>{saving ? 'Saving...' : 'Save Address'}</Button>
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
                                <Button type="button" variant="outline" className={`flex-1 ${editForm.type === 'home' ? 'border-[#0c831f] text-[#0c831f] bg-green-50' : ''}`} onClick={() => setEditForm(f => ({ ...f, type: 'home' }))}>Home</Button>
                                <Button type="button" variant="outline" className={`flex-1 ${editForm.type === 'work' ? 'border-[#0c831f] text-[#0c831f] bg-green-50' : ''}`} onClick={() => setEditForm(f => ({ ...f, type: 'work' }))}>Work</Button>
                                <Button type="button" variant="outline" className={`flex-1 ${editForm.type === 'other' ? 'border-[#0c831f] text-[#0c831f] bg-green-50' : ''}`} onClick={() => setEditForm(f => ({ ...f, type: 'other' }))}>Other</Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input id="edit-name" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-phone">Phone Number</Label>
                            <Input id="edit-phone" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-address">Address</Label>
                            <Textarea id="edit-address" value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-city">City</Label>
                                <Input id="edit-city" placeholder="New Delhi" value={editForm.city} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-state">State</Label>
                                <Input id="edit-state" placeholder="Delhi" value={editForm.state} onChange={e => setEditForm(f => ({ ...f, state: e.target.value }))} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-pincode">Pincode</Label>
                            <Input id="edit-pincode" placeholder="110075" value={editForm.pincode} onChange={e => setEditForm(f => ({ ...f, pincode: e.target.value }))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={updating}>Cancel</Button>
                        <Button className="bg-[#0c831f] hover:bg-[#0b721b]" onClick={handleUpdateAddress} disabled={updating}>{updating ? 'Updating...' : 'Update Address'}</Button>
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
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={deleting}>Cancel</Button>
                        <Button variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={handleConfirmDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddressesPage;
