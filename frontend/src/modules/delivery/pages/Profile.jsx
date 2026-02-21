import React, { useState, useEffect } from 'react';
import { useAuth } from '@core/context/AuthContext';
import { deliveryApi } from '../services/deliveryApi';
import {
    User,
    Phone,
    Truck,
    MapPin,
    ShieldCheck,
    Power,
    Edit2,
    Save,
    ChevronRight,
    Star,
    CheckCircle2,
    Bike,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Profile = () => {
    const { user, login } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        vehicleType: 'bike',
        vehicleNumber: '',
        currentArea: '',
        isOnline: true
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await deliveryApi.getProfile();
            const data = response.data.result;
            setProfileData(data);
            setFormData({
                name: data.name || '',
                vehicleType: data.vehicleType || 'bike',
                vehicleNumber: data.vehicleNumber || '',
                currentArea: data.currentArea || '',
                isOnline: data.isOnline ?? true
            });
        } catch (error) {
            toast.error('Failed to load profile');
        }
    };

    const handleToggleOnline = async () => {
        const newStatus = !formData.isOnline;
        try {
            await deliveryApi.updateProfile({ isOnline: newStatus });
            setFormData(prev => ({ ...prev, isOnline: newStatus }));
            toast.success(`You are now ${newStatus ? 'Online' : 'Offline'}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await deliveryApi.updateProfile(formData);
            const updatedProfile = response.data.result;
            setProfileData(updatedProfile);
            login({ ...user, ...updatedProfile });
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (!profileData) return <div className="p-8 text-center text-slate-400">Loading your profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Hero Profile Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="h-32 w-32 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white shadow-2xl overflow-hidden">
                            {profileData.avatar ? (
                                <img src={profileData.avatar} alt={profileData.name} className="h-full w-full object-cover" />
                            ) : (
                                <User size={48} className="text-slate-400" />
                            )}
                        </div>
                        <div className={cn(
                            "absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center",
                            formData.isOnline ? "bg-emerald-500" : "bg-slate-300"
                        )}>
                            <Power size={14} className="text-white" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{profileData.name}</h1>
                            {profileData.isVerified && (
                                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                    <ShieldCheck size={12} />
                                    Verified Pro
                                </div>
                            )}
                        </div>
                        <p className="text-slate-500 font-bold flex items-center justify-center md:justify-start gap-2">
                            <Phone size={16} />
                            +91 {profileData.phone}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                            <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Rating</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Star size={16} className="text-amber-400 fill-amber-400" />
                                    <span className="text-lg font-black text-slate-900">4.9</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Trips</p>
                                <div className="flex items-center gap-1.5 mt-1 text-lg font-black text-slate-900">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    1,280
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                        >
                            {isEditing ? 'Cancel' : (
                                <>
                                    <Edit2 size={16} />
                                    Edit Profile
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleToggleOnline}
                            className={cn(
                                "px-6 py-3 rounded-2xl font-black text-xs tracking-widest uppercase transition-all flex items-center gap-2 border-2",
                                formData.isOnline
                                    ? "border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                    : "border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-100"
                            )}
                        >
                            <Power size={16} />
                            {formData.isOnline ? 'Go Offline' : 'Go Online'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Stats/Docs */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Vehicle Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                        <Bike size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</p>
                                        <p className="text-sm font-black text-slate-900 capitalize">{profileData.vehicleType}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                        <ArrowRight size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Number</p>
                                        <p className="text-sm font-black text-slate-900 uppercase">{profileData.vehicleNumber || 'Not Specified'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Verification</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Driving License</span>
                                <Badge variant="success" className="text-[8px]">Verified</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Identity Proof</span>
                                <Badge variant="success" className="text-[8px]">Verified</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Insurance</span>
                                <Badge variant="warning" className="text-[8px]">Expiring</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Information Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-900">Professional Details</h2>
                            {isEditing && (
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                    Editing Mode
                                </span>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                                            <input
                                                type="text"
                                                name="name"
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] pl-12 pr-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-100 transition-all outline-none"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Type</label>
                                        <div className="relative group">
                                            <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                                            <select
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] pl-12 pr-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-100 transition-all outline-none appearance-none"
                                                value={formData.vehicleType}
                                                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                            >
                                                <option value="bike">Bike / Motorcycle</option>
                                                <option value="scooter">Scooter</option>
                                                <option value="cycle">Bicycle</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Number</label>
                                        <div className="relative group">
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                                            <input
                                                type="text"
                                                placeholder="e.g. MP-09-XY-1234"
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] pl-12 pr-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-100 transition-all outline-none"
                                                value={formData.vehicleNumber}
                                                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Area</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                                            <input
                                                type="text"
                                                placeholder="e.g. Vijay Nagar, Indore"
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] pl-12 pr-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-100 transition-all outline-none"
                                                value={formData.currentArea}
                                                onChange={(e) => setFormData({ ...formData, currentArea: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-emerald-600 text-white rounded-[1.25rem] font-black text-sm tracking-[2px] uppercase shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    {isLoading ? 'SAVING...' : (
                                        <>
                                            <Save size={18} />
                                            Save Settings
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <DataPoint label="Account Name" value={profileData.name} icon={User} />
                                    <DataPoint label="Primary Phone" value={`+91 ${profileData.phone}`} icon={Phone} />
                                    <DataPoint label="vehicle model" value={profileData.vehicleType} icon={Truck} isCapitalize />
                                    <DataPoint label="Plate Number" value={profileData.vehicleNumber || 'Not provided'} icon={ShieldCheck} />
                                    <DataPoint label="Delivery Circle" value={profileData.currentArea || 'Assigning...'} icon={MapPin} />
                                    <DataPoint label="Account Status" value={profileData.isVerified ? 'Fully Verified' : 'Pending Verification'} icon={CheckCircle2} />
                                </div>

                                <div className="mt-8 p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
                                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shrink-0 shadow-sm border border-amber-100">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-amber-900">Security Notice</h4>
                                        <p className="text-xs font-medium text-amber-700 mt-1 leading-relaxed">
                                            Password management is handled via OTP for your safety. To update your mobile number, please contact technical support at <span className="font-bold underline">support@appzeto.com</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DataPoint = ({ label, value, icon: Icon, isCapitalize }) => (
    <div className="group">
        <div className="flex items-center gap-3 mb-1.5 ml-1">
            <Icon size={12} className="text-slate-300 group-hover:text-primary transition-colors" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        </div>
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-primary/10 transition-all">
            <p className={cn("text-base font-black text-slate-900", isCapitalize && "capitalize")}>{value}</p>
        </div>
    </div>
);

const Badge = ({ children, variant, className }) => {
    const variants = {
        primary: "bg-blue-50 text-blue-600 border-blue-100",
        success: "bg-emerald-50 text-emerald-600 border-emerald-100",
        warning: "bg-amber-50 text-amber-600 border-amber-100",
    };
    return (
        <span className={cn("px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border", variants[variant], className)}>
            {children}
        </span>
    );
};

export default Profile;
