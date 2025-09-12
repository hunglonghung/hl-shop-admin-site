import { BrandManagement } from "@/components/admin/BrandManagement";

export default function BrandsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Brand Management</h1>
        <p className="text-muted-foreground">
          Manage product brands, upload logos, and organize your inventory by brand.
        </p>
      </div>
      
      <BrandManagement />
    </div>
  );
}