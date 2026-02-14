import React from 'react';
import Card from '@shared/components/ui/Card';
import Button from '@shared/components/ui/Button';
import Badge from '@shared/components/ui/Badge';
import { HiOutlinePlus } from 'react-icons/hi';

const ProductManagement = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>
                <Button>
                    <HiOutlinePlus className="mr-2 h-5 w-5" />
                    Add Product
                </Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <tbody className="divide-y">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 bg-gray-100 rounded"></div>
                                            <span className="font-semibold text-gray-900">Product Name {i}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">Electronics</td>
                                    <td className="px-6 py-4 font-bold text-primary-600">$199.99</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="success">In Stock</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-primary-600 hover:text-primary-700 font-medium">Edit</button>
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

export default ProductManagement;
