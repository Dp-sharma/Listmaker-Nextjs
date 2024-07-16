'use client';
import '@/app/main.css';
import Script from 'next/script';
import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


export default function Home_list() {
  const getInitialItems = () => {
    const savedItems = localStorage.getItem('items');
    return savedItems ? JSON.parse(savedItems) : [];
  };

  const getInitialTitle = () => {
    const savedTitle = localStorage.getItem('title');
    return savedTitle || 'Title here';
  };

  const [items, setItems] = useState(getInitialItems);
  const [newItem, setNewItem] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const inputRef = useRef(null);
  const [title, setTitle] = useState(getInitialTitle);
  // const listboxRef = useRef(null); 

  useEffect(() => {
    if (editIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editIndex]);
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('title', title);
  }, [title]);
  useEffect(() => {
    const savedItems = localStorage.getItem('items');
    const savedTitle = localStorage.getItem('title');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
    if (savedTitle) {
      setTitle(savedTitle);
    }
  }, []);



  const addItem = async () => {
    if (newItem.trim() !== '') {
      let updatedItems;
      if (editIndex !== null) {
        updatedItems = [...items];
        updatedItems[editIndex] = newItem;
        setItems(updatedItems);
        setEditIndex(null);
      } else {
        setItems([...items, newItem]);
      }
      setNewItem('');

    }
  };

  const deleteItem = (index) => {
    if (window.confirm('Do you really want to delete the item?')) {
      const newItems = items.filter((item, i) => i !== index);
      setItems(newItems);
    } else {
      console.log('Not deleting the item');
    }
  };

  const editItem = (index) => {
    setNewItem(items[index]);
    setEditIndex(index);
  };

  const changetitle = () => {
    let newtitle = prompt('Enter the title of the string', 'Title');
    if (newtitle !== '') {
      setTitle(newtitle);

    } else {
      alert('Please enter a valid title');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addItem();
    }
  };

  const handleInputChange = (event) => {
    setNewItem(event.target.value);
  };
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
  const handlereset = ()=>{
    setItems([]);
    setTitle('title')
  }
  return (
    <div>

      <Script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js" />
      <Script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.esm.js" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" />
      <Script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.js" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      {/* This is the script  for image to pdf */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer" />

      {/* <Script src="/script/features.js"/> */}
      {/* <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jQuery.print/1.6.2/jQuery.print.js" integrity="sha512-BaXrDZSVGt+DvByw0xuYdsGJgzhIXNgES0E9B+Pgfe13XlZQvmiCkQ9GXpjVeLWEGLxqHzhPjNSBs4osiuNZyg==" crossorigin="anonymous" referrerpolicy="no-referrer" /> */}



      <div className="main">
        <div className="input">
          <input
            id="list_input"
            ref={inputRef}
            value={newItem}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Write your list item"
          />
          <button className="btn" id="btn" onClick={addItem}>
            {editIndex !== null ? 'Save' : 'Add'}
          </button>
        </div>
        <div className="listbox" id='list'  >


          <ul className="list" id="image">
            <h1 className="title text-center" id="title" onClick={changetitle}>
              {title}
            </h1>
            {items.map((item, index) => (
              <li key={index}>
                {item}
                <button className='btn , list_btn , edit_btn ' onClick={() => editItem(index)}>Edit</button>
                <button className='btn , list_btn , delete_btn' onClick={() => deleteItem(index)}>Delete</button>
              </li>
            ))}
          </ul>


        </div>
        <div className="feature">
          {/* <Download captureRef={listboxRef}/> */}
          <button className="btn , feature_btn" onClick={screenshot}>Download image </button>
          <button className="btn , feature_btn" id='print ' onClick={downloadPDF} >Download pdf </button>
        </div>
        <div><button className="btn" onClick={handlereset}>Reset List</button></div>
      </div>
    </div>
  );
}
