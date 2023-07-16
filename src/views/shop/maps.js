// material-ui
import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
// project imports

import { Typography, Box, Divider, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Marker from 'assets/images/icons/marker.svg';
import { IconCategory, IconPhone, IconPin, IconUser } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
// ==============================|| SHOP MAP PAGE ||============================== //

// ShopMarker component to display markers on the map
const ShopMarker = ({ name, info, category, manager, phone, onPress }) => {
    const theme = useTheme();
    const [showInfo, setShowInfo] = useState(false);

    const toggleInfo = () => {
        setShowInfo(!showInfo);
    };

    return (
        <Box className="marker" onClick={toggleInfo}>
            <img src={Marker} alt="marker" width={30} height={30} />
            {showInfo && (
                <Box sx={{ width: 220, height: 220, padding: 2, borderRadius: 2, backgroundColor: theme.palette.background.default }}>
                    <Typography sx={{ fontSize: theme.typography.h4 }}>{name}</Typography>
                    <Divider />

                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                        <IconPin color={theme.palette.primary.main} />
                        <Typography sx={{ marginLeft: 1, fontSize: theme.typography.body1, textTransform: 'capitalize' }}>
                            {info}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                        <IconCategory color={theme.palette.primary.dark} />{' '}
                        <Typography sx={{ marginLeft: 1, fontSize: theme.typography.body1 }}>{category}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                        <IconUser color={theme.palette.primary.dark} />{' '}
                        <Typography sx={{ marginLeft: 1, fontSize: theme.typography.body1 }}>{manager}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                        <IconPhone color={theme.palette.primary.dark} />{' '}
                        <Typography sx={{ marginLeft: 1, fontSize: theme.typography.body1 }}>{phone}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                        <Button sx={{ marginBottom: 0 }} onClick={onPress}>
                            View Details
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

const ShopMap = ({ shopData, onPress }) => {
    const navigate = useNavigate();
    return (
        <Box style={{ height: '450px', width: '100%', borderRadius: 4 }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyANs4M9AMbQxsSl7f-vIF2cMKhxpdtnbq0' }} // Replace with your Google Maps API key
                defaultCenter={{ lat: 9.0108, lng: 38.7617 }} // Set the default center of the map
                defaultZoom={12} // Set the default zoom level of the map
            >
                {shopData.map((shop) => (
                    <ShopMarker
                        key={shop.id}
                        lat={shop.latitude}
                        lng={shop.longitude}
                        name={shop.name}
                        info={shop.address}
                        category={shop.category}
                        manager={shop.manager ? shop.manager : 'Not Assigned'}
                        phone={shop.phone}
                        onPress={() =>
                            navigate('/view-shop', {
                                state: { ...shop }
                            })
                        }
                    />
                ))}
            </GoogleMapReact>
        </Box>
    );
};

export default ShopMap;
