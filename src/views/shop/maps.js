// material-ui
import { Typography } from '@mui/material';
import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| SHOP MAP PAGE ||============================== //
// Sample data for shop coordinates and information
const shopData = [
    { id: 1, name: 'Shop 1', lat: 9.0108, lng: 38.7617, info: 'This is Shop 1' },
    { id: 2, name: 'Shop 2', lat: 9.0227, lng: 38.7465, info: 'This is Shop 2' },
    { id: 3, name: 'Shop 3', lat: 9.0346, lng: 38.7423, info: 'This is Shop 3' }
    // Add more shop coordinates and information here
];

// ShopMarker component to display markers on the map
const ShopMarker = ({ name, info }) => {
    const [showInfo, setShowInfo] = useState(false);

    const toggleInfo = () => {
        setShowInfo(!showInfo);
    };

    return (
        <div className="marker" onClick={toggleInfo}>
            🏪
            {showInfo && (
                <div className="info-card">
                    <h4>{name}</h4>
                    <p>{info}</p>
                </div>
            )}
        </div>
    );
};

const ShopMap = () => {
    return (
        <div style={{ height: '400px', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'YOUR_API_KEY' }} // Replace with your Google Maps API key
                defaultCenter={{ lat: 9.0108, lng: 38.7617 }} // Set the default center of the map
                defaultZoom={12} // Set the default zoom level of the map
            >
                {shopData.map((shop) => (
                    <ShopMarker key={shop.id} lat={shop.lat} lng={shop.lng} name={shop.name} info={shop.info} />
                ))}
            </GoogleMapReact>
        </div>
    );
};

export default ShopMap;
