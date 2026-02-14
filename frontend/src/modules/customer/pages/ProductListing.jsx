import React from 'react';
import Card from '@shared/components/ui/Card';
import Button from '@shared/components/ui/Button';
import Badge from '@shared/components/ui/Badge';

const ProductListing = () => {
    const dummyProducts = [
        { id: 1, name: 'Fresh Milk', price: 2.5, category: 'Dairy', stock: 50 },
        { id: 2, name: 'Organic Bananas', price: 1.2, category: 'Produce', stock: 100 },
        { id: 3, name: 'Whole Wheat Bread', price: 3.0, category: 'Bakery', stock: 30 },
        { id: 4, name: 'Large Eggs', price: 4.5, category: 'Dairy', stock: 20 },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Explore Products</h2>
                <div className="flex space-x-2">
                    <Badge variant="primary">All</Badge>
                    <Badge>Dairy</Badge>
                    <Badge>Produce</Badge>
                    <Badge>Bakery</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dummyProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                        <div className="h-40 bg-gray-100 mb-4 rounded-lg flex items-center justify-center text-gray-400">
                            Img Placeholder
                        </div>
                        <h4 className="font-semibold text-lg">{product.name}</h4>
                        <p className="text-gray-500 text-sm mb-4">{product.category}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-primary-600">${product.price}</span>
                            <Button size="sm">Add to Cart</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ProductListing;
