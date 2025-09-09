import { ProductsTable } from "@/components/admin/ProductsTable";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Products Management</h1>
        <p className="text-muted-foreground">
          Manage your sports products inventory, add new items, and update existing ones.
        </p>
      </div>
      
      <ProductsTable />
    </div>
  );
}