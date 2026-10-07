import { ProductForm } from "../product-form";

export const metadata = { title: "Novo produto" };

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Novo produto</h1>
      <ProductForm />
    </div>
  );
}
