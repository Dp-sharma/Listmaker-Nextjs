'use client'
import { useEffect, useState } from 'react';
import './All_list.css'

const All_list = ({ onTitleClick}) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(true);
    const [rotated, setRotated] = useState(false); 
    const [showallList, setShowallList] = useState(false)
    const toggle_all_list = ()=>{
        setShowallList(!showallList)
    }
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/dashboard/all-list', {
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

        fetchUserData();
    }, []);
    if (loading) {
        return <div className='loading_div'>
        <img src="loading.gif" alt="loading gif" className='loading h-28' /></div>;
    }

    if (!userData) {
        return <div className='Msg_tag'>Create new list to be showed here</div>;
    }
    const handleToggle = ()=>{
        toggle_all_list()
        setRotated(!rotated);
        setVisible(!visible)
    }
    // const handleTitleclick=()=>{
    //     handleToggle()
    // }

    const handleTitleclick = () => {
        if (window.innerWidth <= 800) {
          handleToggle();
        }
      };
      
  return (
    <div className={`all_list_component ${showallList ? 'animation_close' : 'animation_All_list'}`}  >
        <span onClick={handleToggle} ><img src="right.png" alt="All list toggle" className={`all_list_toggle ${rotated ? 'rotated' : ''}`} /></span>
    {visible &&(
        <>
         <h2 className='font-mono text-4xl text-black'>List</h2>
      {/* <span>{userData}</span> */}
      <div className="list-title flex flex-col" onClick={handleTitleclick}>
        {userData.map((title,index)=>(<button key={index} className='All_list_btn' onClick={() => onTitleClick(title)}>{title}</button >))}
      </div>
        </>
    )}
     
    </div>
  )
}

export default All_list
