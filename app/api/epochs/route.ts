import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET() {
  const { data: epochs, error } = await supabase.from('epochs').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "epochs fetched from supabase",
    data: epochs,
  });
}

export async function POST(request: Request) {
  const { title, description, metric } = await request.json();
  
  const { data, error } = await supabase
    .from('epochs')
    .insert([{ date: new Date().toISOString(), title, description, metric }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "new epoch added to supabase",
    data: data[0],
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "Epoch ID is required" }, { status: 400 });
  }

  const { error } = await supabase.from('epochs').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Epoch deleted successfully" });
}