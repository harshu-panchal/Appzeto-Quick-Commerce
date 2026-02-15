import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative bg-slate-900 pt-20 pb-10 mt-20 text-slate-300">
            {/* Top Wave Divider */}
            <div className="absolute top-[-1px] left-0 w-full overflow-hidden leading-[0] rotate-180">
                <svg className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
                </svg>
            </div>

            <div className="container mx-auto px-4 z-10 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xl">
                                A
                            </div>
                            <span className="text-2xl font-bold text-white">Appzeto</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Your daily dose of fresh, organic, and healthy products delivered straight to your door. Freshness guaranteed.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-500 hover:text-white transition-colors"><Facebook size={18} /></a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-500 hover:text-white transition-colors"><Twitter size={18} /></a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-500 hover:text-white transition-colors"><Instagram size={18} /></a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-500 hover:text-white transition-colors"><Youtube size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-brand-400 transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-brand-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-brand-400 transition-colors">Shop</a></li>
                            <li><a href="#" className="hover:text-brand-400 transition-colors">Blogs</a></li>
                            <li><a href="#" className="hover:text-brand-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Categories</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-brand-400 transition-colors">Fruits & Vegetables</a></li>
                            <li><a href="#" className="hover:text-brand-400 transition-colors">Dairy Products</a></li>
                            <li><a href="#" className="hover:text-brand-400 transition-colors">Meat & Fish</a></li>
                            <li><a href="#" className="hover:text-brand-400 transition-colors">Bakery & Snacks</a></li>
                            <li><a href="#" className="hover:text-brand-400 transition-colors">Beverages</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-brand-500 mt-1 shrink-0" size={18} />
                                <span>123 Green Street, Market Avenue, New York, USA 10001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-brand-500 shrink-0" size={18} />
                                <span>+1 (234) 567-890</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-brand-500 shrink-0" size={18} />
                                <span>support@appzeto.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm md:flex md:justify-between md:text-left">
                    <p>&copy; {new Date().getFullYear()} Appzeto. All rights reserved.</p>
                    <div className="flex gap-6 justify-center md:justify-end mt-4 md:mt-0">
                        <a href="#" className="hover:text-brand-400">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-400">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
