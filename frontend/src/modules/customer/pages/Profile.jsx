import React from 'react';
import Card from '@shared/components/ui/Card';
import Button from '@shared/components/ui/Button';
import Input from '@shared/components/ui/Input';
import { useAuth } from '@core/context/AuthContext';

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h2>
            <Card title="Personal Information">
                <form className="space-y-4">
                    <Input label="Full Name" defaultValue={user?.name} />
                    <Input label="Email Address" type="email" defaultValue={user?.email} disabled />
                    <Input label="Phone Number" placeholder="+1 (555) 000-0000" />
                    <div className="pt-4 border-t">
                        <Button>Update Profile</Button>
                    </div>
                </form>
            </Card>

            <Card title="Delivery Address" className="mt-8">
                <div className="space-y-4">
                    <p className="text-gray-600">You currently have no saved addresses.</p>
                    <Button variant="outline">Add New Address</Button>
                </div>
            </Card>
        </div>
    );
};

export default Profile;
