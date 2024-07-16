// pages/api/dashboard/deleteItem.js
import connectDB from '@/app/lib/mongodb';
import list_model from '@/app/models/list';
import { NextResponse } from 'next/server';

export async function POST(request) {
   

    await connectDB();

    // const { title, item } = req.body;
    const { title, item } = await request.json();
    if (!title || !item) {
        return NextResponse.json({ 
            success:'false',
            msg: 'Title and item are required' }
        ,{
            status:'400'
        });
    }
    console.log(title);
    console.log(item);
    try {
        // Find the list by title
        const list = await list_model.findOne({ title });

        if (!list) {
            return NextResponse.json({
                success:'false',
                msg:"List not found"
            },{
                status:'400'
            })
            

        }

        // Remove the item from the list
        const updatedItems = list.items.filter(listItem => listItem !== item);

        // Update the list with the remaining items
        list.items = updatedItems;
        await list.save();

        return NextResponse.json({
            success :'true',
            msg:'Item Deleted successfully'
        },{statu:'200'})
        
    } catch (error) {
        console.error('Error deleting item:', error);
        NextResponse.json({
            success:'false',
            msg:error
        },{
            status:'400'
        })
    }
}
