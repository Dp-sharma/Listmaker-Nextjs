import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
// import ListItem from '@/app/models/ListItem'; // Ensure you create a ListItem model
import ListItem from '@/app/models/listitem';
export async function POST(req) {
  const { items } = await req.json();

  try {
    await connectDB();

    const newList = new ListItem({ items });
    await newList.save();

    return NextResponse.json({ success: true, message: 'List saved successfully!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Failed to save list.' }, { status: 500 });
  }
}
