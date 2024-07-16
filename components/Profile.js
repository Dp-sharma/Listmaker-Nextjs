'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './Profile.css'
const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showProfileBox, setShowProfileBox] = useState(false);

    const fetchUserData = async () => {
            try {
                const response = await fetch('/api/mylist', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.data);
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
    const logoutuser = async ()=>{
        try {
            const response = await fetch('/api/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
               
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data.data);
            } else {
                
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    }
    

    const userinfo = () => {
        fetchUserData();
        setShowProfileBox(!showProfileBox);
    }

    const handlelogout = ()=>{
        logoutuser();
    }
    return (
        <div className='profile'>
            <div className='flex items-center flex-col font-mono'>
                <img
                    src="profile.png"
                    onClick={userinfo}
                    className='profile_data'
                    
                />
                {showProfileBox && (
                    <div className='profile_item_box'>
                        {loading ? (
                            <img src="loading.gif" alt="loading gif" />
                        ) : (
                            userData ? (
                                <div className='flex flex-col'>
                                    <h1 className='profile_item'>Welcome, {userData.name}</h1>
                                    {/* <p className='profile_item'>Email: {userData.email}</p> */}
                                    <Link href={'/logout'} onClick={handlelogout}  className='bg-red-400 px-4 py-1 rounded-2xl cursor-pointer profile_item'>Logout</Link>
                                </div>
                            ) : (
                                <div className='flex flex-col'>
                                    <Link href={'/login'} className='bg-green-300 px-4 py-1 my-1 rounded-2xl cursor-pointer  text-black font-serif '>Login</Link>
                                    <Link href={'/register'} className='bg-green-300 px-4 py-1 my-1 rounded-2xl cursor-pointer text-black font-serif '>Register</Link>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
            {/* Render the rest of your user-specific content here */}
        </div>
    );
}

export default Profile;
