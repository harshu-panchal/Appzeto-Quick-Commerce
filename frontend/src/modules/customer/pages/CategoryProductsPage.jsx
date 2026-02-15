import React from 'react';
import { useParams } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';
import ProductCard from '../components/shared/ProductCard';

// Extended product list to ensure we have items for various categories
const allProducts = [
    {
        id: 1,
        name: 'Fresh Organic Strawberry',
        category: 'Fruits',
        price: 349,
        originalPrice: 499,
        image: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 2,
        name: 'Green Bell Pepper',
        category: 'Vegetables',
        price: 45,
        originalPrice: 60,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 3,
        name: 'Fresh Avocado',
        category: 'Fruits',
        price: 120,
        originalPrice: 180,
        image: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 4,
        name: 'Organic Broccoli',
        category: 'Vegetables',
        price: 85,
        originalPrice: 110,
        image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 5,
        name: 'Fresh Red Tomato',
        category: 'Vegetables',
        price: 35,
        originalPrice: 50,
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 6,
        name: 'Organic Banana Bunch',
        category: 'Fruits',
        price: 60,
        originalPrice: 80,
        image: 'https://images.unsplash.com/photo-1571771896612-6184984fc38b?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 7,
        name: 'Fresh Milk',
        category: 'Dairy',
        price: 65,
        originalPrice: 70,
        image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 8,
        name: 'Whole Wheat Bread',
        category: 'Bakery',
        price: 45,
        originalPrice: 55,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 9,
        name: 'Orange Juice',
        category: 'Drinks',
        price: 180,
        originalPrice: 220,
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 10,
        name: 'Chicken Breast',
        category: 'Meat',
        price: 280,
        originalPrice: 320,
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 11,
        name: 'Brown Eggs (12 pcs)',
        category: 'Dairy',
        price: 90,
        originalPrice: 110,
        image: 'https://images.unsplash.com/photo-1516488556308-ea2447743663?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 12,
        name: 'Potato',
        category: 'Vegetables',
        price: 30,
        originalPrice: 40,
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 13,
        name: 'Coca Cola 2L',
        category: 'Drinks',
        price: 95,
        originalPrice: 110,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 14,
        name: 'Chips Party Pack',
        category: 'Snacks',
        price: 50,
        originalPrice: 60,
        image: 'https://images.unsplash.com/photo-1621939514649-28b12e81658b?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 15,
        name: 'Shampoo',
        category: 'Personal Care',
        price: 350,
        originalPrice: 499,
        image: 'https://images.unsplash.com/photo-1556228578-8d84f5ae1d41?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 16,
        name: 'Dog Food 3kg',
        category: 'Pet Food',
        price: 1200,
        originalPrice: 1400,
        image: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 17,
        name: 'Detergent Powder',
        category: 'Household',
        price: 210,
        originalPrice: 250,
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=260&auto=format&fit=crop',
    },
    {
        id: 18,
        name: 'Corn Flakes',
        category: 'Breakfast',
        price: 320,
        originalPrice: 380,
        image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=260&auto=format&fit=crop',
    },
];

const CategoryProductsPage = () => {
    const { categoryName } = useParams();

    // Filter products based on the category name from URL
    // We convert both to lowercase for case-insensitive matching
    const filteredProducts = allProducts.filter(
        product => product.category.toLowerCase() === categoryName?.toLowerCase()
    );

    // Format the category name for display (capitalize first letter)
    const displayCategoryName = categoryName
        ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
        : 'Products';

    return (
        <CustomerLayout>
            <div className="relative z-10 py-8 w-full max-w-[1920px] mx-auto px-4 md:px-[50px] animate-in fade-in slide-in-from-bottom-4 duration-700 mt-48 md:mt-24">
                <div className="mb-8 text-left">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0c831f] mb-2">{displayCategoryName}</h1>
                    <p className="text-gray-600 text-lg">
                        {filteredProducts.length} items found in {displayCategoryName}
                    </p>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
                        <p className="text-muted-foreground">We couldn't find any products in this category.</p>
                        <a href="/products" className="inline-block mt-4 text-[#0c831f] font-bold hover:underline">
                            Browse all products
                        </a>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
};

export default CategoryProductsPage;
