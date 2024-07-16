'use client'
import { useEffect, useState, useRef } from 'react';
import './Dashboard.css'
import '@/app/main.css';
import All_list from './dashboard/All_list';
import Script from 'next/script';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';


export default function MyListPage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState(null);
    const [showTitleCard, setShowTitleCard] = useState(false);
    const [error, setError] = useState('');
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [list_pannel, setList_pannel] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0);
    const errorDataRef = useRef(null);
    const [listLoading, setListLoading] = useState(false);



    const createNewList = () => {
        console.log('Create new list executed');
        setShowTitleCard(true);
        setList_pannel(false);
    }
    const handleDeleteList = () => {
        const confirmation = window.confirm('Do you really want to delete List?')
        if (confirmation) {
            deleteList();
            console.log('Handling Delete Lisdt');
        }
        else{
            console.log('Not deleting the list');
            return
        }
    }

    const deleteList = async () => {
        try {
            const res = await fetch('api/dashboard/deleteList', {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    title
                })
            })
            if (!res.ok) {

                const errorData = await res.json();
                console.log(errorData);
                throw new Error(errorData.msg || 'Something went wrong')
            }

            setRefreshKey(prevKey => prevKey + 1);
            setList_pannel(false)
        } catch (error) {

            console.log('Error :', error);
        }
    }

    const saveList = async () => {
        try {
            const res = await fetch('api/dashboard/newList', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    items
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.log(errorData);
                setError(errorData.msg)
                errorDataRef.current = errorData.msg;
                console.log(errorDataRef)
                console.log(errorData.msg);
                throw new Error(errorData.msg || 'Something went wrong');
            } else {
                setRefreshKey(prevKey => prevKey + 1); // Trigger refresh of All_list component
            }

        } catch (error) {

            // setError(error.msg);
            console.error('Erroris this:', error);
        }
    }

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

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleInputChange = (event) => {
        // console.log(event.target.value);
        setNewItem(event.target.value);
    }
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        setError(null); // Clear error when the title changes
        errorDataRef.current = null; // Clear the global error ref
    }
    const addTitle = async () => {

        console.log('Adding the title');
        setList_pannel(false);
        setItems([]);
        await saveList();
        console.log('Ye hai hamra error', errorDataRef.current);
        if (errorDataRef.current) {

            console.log('its working')
            // console.error('Error:', error);

        } else {
            setShowTitleCard(false);
            setList_pannel(true);// Optionally, you can set some state to display the error message to the user
        }
    }

    const handleKeyDown = async (event) => {
        if (event.key === 'Enter') {
            await addItemToList();
        }
    };

    const fetchListItems = async (selectedTitle) => {
        setListLoading(true); // Set loading to true when fetching starts
        try {
            const response = await fetch(`/api/dashboard/getList?title=${selectedTitle}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTitle(selectedTitle);
                setItems(data.items);
            } else {
                console.error('Failed to fetch list items');
            }
        } catch (error) {
            console.error('Error fetching list items:', error);
        }
        finally {
            setListLoading(false); // Set loading to false when fetching ends
        }
    };

    const addItemToList = async () => {
        try {
            const res = await fetch('api/dashboard/addItem', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    item: newItem
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.log(errorData);
                throw new Error(errorData.msg || 'Something went wrong');
            } else {
                const newItemData = await res.json();
                setItems([...items, newItemData.item]);
                setNewItem("");
            }
        } catch (error) {
            setError(error.message);
            console.error('Error:', error);
        }
    }

    const handleSaveList = () => {
        console.log('Handling the save list');
        saveList();
    }
    const handleTitleClick = (title) => {

        setList_pannel(true);

        fetchListItems(title);
    }
    const editItem = async (index) => {
        const itemToEdit = items[index];
        if (!title || !itemToEdit) {
            console.error('Title or item is missing');
            return;
        }
        try {
            console.log('Editing item:', itemToEdit, 'in list:', title); // Log the data being sent
            const res = await fetch('api/dashboard/deleteItem', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ title, item: itemToEdit })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || 'Something went wrong');
            } else {
                setItems(items.filter((_, i) => i !== index));
                setNewItem(itemToEdit); // Set the item to the input field for editing
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const deleteItem = async (index) => {
        const itemToDelete = items[index];
        const confirmation = window.confirm('Do your really want to delete item?')
        if (!confirmation) {
            console.log('Not deleting the item');
            return
        }
        try {
            const res = await fetch('api/dashboard/deleteItem', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ title, item: itemToDelete })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || 'Something went wrong');
            } else {
                setItems(items.filter((_, i) => i !== index));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    if (loading) {
        return (
            <div className='loading_div'>
                <img src="loading.gif" alt="loading gif" className='loading' />
            </div>
        );
    }

    if (!userData) {
        return <div>No user data found.</div>;
    }
    const screenshot = () => {
        html2canvas(document.getElementById("image")).then(function (canvas) {
            downloadImage(canvas.toDataURL(), "Mylist.png");
        });
    };

    const downloadImage = (uri, filename) => {
        var link = document.createElement('a');
        if (typeof link.download !== 'string') {
            window.open(uri);
        }
        else {
            link.href = uri;
            link.download = filename;
            accountForFirefox(clickLink, link);
        }
    };

    const clickLink = (link) => {
        link.click();
    };

    const accountForFirefox = (click, link) => {
        document.body.appendChild(link);
        click(link);
        document.body.removeChild(link);
    };

    const downloadPDF = () => {
        const element = document.getElementById('image');
        html2canvas(element).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save('Mylist.pdf');
        });
    };
    return (
        <div className='dashboard'>
            <Script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js" />
            <Script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.esm.js" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" />
            <Script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.js" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            <div className={`all_list `}><All_list onTitleClick={handleTitleClick} key={refreshKey} /></div>
            <button className='new_list_btn' onClick={createNewList}>
                <img src="newlist.png" className='h-11 ' />
            </button>
            {list_pannel && (<div className="main_dashboard" key={refreshKey}>
                {listLoading ? (
                    <div className='loading_div'>
                        <img src="loading.gif" alt="loading gif" className='loading' />
                    </div>
                ) : (
                    <>
                        <div className="input">
                            <input
                                type="text"
                                placeholder='Enter your item'
                                className='input_dash'
                                value={newItem}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                            />
                            <button className='btn' id='btn' onClick={addItemToList}>Save</button>
                        </div>
                        <div id="list" className='listbox'>
                            <ul id='image' className='list'>


                                <div className="new_list_title text-center font-sans" id='new_list_title'>
                                    {title || 'Title'}
                                </div>
                                <div className="new_list_items">
                                    {items.map((item, index) => (
                                        <li key={index}>{item}
                                            <button className='btn list_btn edit_btn' onClick={() => editItem(index)}>Edit</button>
                                            <button className='btn list_btn delete_btn' onClick={() => deleteItem(index)}>Delete</button>
                                        </li>

                                    ))}
                                </div>
                            </ul>
                        </div>
                        {/* <button className='new_list_btn' onClick={createNewList}>
                    <img src="newlist.svg" className='h-11 rounded-2xl' />
                </button> */}

                        <button onClick={handleDeleteList} className='delete_list btn' style={{  color: "black" }}>
                            Delete List
                        </button>
                        <div className="feature_dash">
                            {/* <Download captureRef={listboxRef}/> */}
                            <button className="btn , feature_btn" onClick={screenshot}>Download image </button>
                            <button className="btn , feature_btn" id='print ' onClick={downloadPDF} >Download pdf </button>
                        </div>
                    </>
                )}
            </div>)}

            {showTitleCard && (
                <div className="title_box">
                <div id='Title_change_card'>
                    <div className='flex flex-col mt-10'>
                        <img src="close.png" alt="close image" className='title_card_close' onClick={() => { setShowTitleCard(false) }} />
                        <label htmlFor="title" className='title_card_label'>Title</label>
                        <input
                            type="text"
                            placeholder='Enter your List title'
                            className='input_title input_dash'
                            onChange={handleTitleChange}
                            onKeyDown={(e) => { if (e.key === 'Enter') addTitle() }}
                        />
                    </div>
                    {error && (
                        <div className="error">
                            {error}
                        </div>
                    )}
                </div> 
                </div>
            )}

        </div>
    );
}
