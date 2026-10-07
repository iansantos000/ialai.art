import { notFound } from "next/navigation";
import { getProductForAdmin } from "@/lib/products";
import { ProductForm } from "../product-form";

export const metadata = { title: "Editar produto" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductForAdmin(id);
  if (!product) notFound();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Editar produto</h1>
      <ProductForm initial={product} />
    </div>
  );
}
