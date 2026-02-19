import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(undefined);

export const LocationProvider = ({ children }) => {
    // Default location (Dhakad Snazzy, Indore)
    const [currentLocation, setCurrentLocation] = useState({
        name: "Indore, Madhya Pradesh 452010...",
        storeName: "DHAKAD SNAZZY",
        time: "12-15 mins"
    });

    // Address list (Mocking saved addresses)
    const [savedAddresses, setSavedAddresses] = useState([
        {
            id: 'home',
            label: "Home",
            address: "Indore, Madhya Pradesh 452010...",
            phone: "6264715409",
            isCurrent: true
        }
    ]);

    // Update the home address when the top location is clicked/updated
    const updateLocation = (newLoc) => {
        setCurrentLocation(newLoc);

        // Update the Home address in the list to match the selected location
        setSavedAddresses(prev => prev.map(addr =>
            addr.label === "Home"
                ? { ...addr, address: newLoc.name }
                : addr
        ));
    };

    const addAddress = (newAddress) => {
        setSavedAddresses(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                label: newAddress.label || "Other",
                address: newAddress.address,
                phone: newAddress.phone || "N/A",
                isCurrent: false
            }
        ]);
    };

    return (
        <LocationContext.Provider value={{ currentLocation, savedAddresses, updateLocation, addAddress }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};
