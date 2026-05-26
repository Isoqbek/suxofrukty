import ProductForm from "../ProductForm";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-montserrat font-bold text-xl text-[#2C2417]">Yangi mahsulot</h1>
      <ProductForm />
    </div>
  );
}
