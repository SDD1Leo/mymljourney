import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET() {
  const { data: models, error } = await supabase.from('models').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "models fetched from supabase",
    data: models,
  });
}

export async function POST(request: Request) {
  const { name, type, description, stats, tech, link } = await request.json();
  
  const { data, error } = await supabase
    .from('models')
    .insert([{ name, type, description, stats, tech, link }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "new model added to supabase",
    data: data[0],
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "Model ID is required" }, { status: 400 });
  }

  const { error } = await supabase.from('models').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Model deleted successfully" });
}