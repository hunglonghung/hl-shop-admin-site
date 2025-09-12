import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  created_at: string;
}

export function BrandManagement() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: "", logo_url: "" });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
    const { data, error } = await supabase
      .from('brands' as any)
      .select('*')
        .order('name');

      if (error) throw error;
      setBrands((data as any) || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch brands"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingBrand) {
        const { error } = await supabase
          .from('brands' as any)
          .update({
            name: formData.name,
            logo_url: formData.logo_url || null
          })
          .eq('id', editingBrand.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Brand updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('brands' as any)
          .insert({
            name: formData.name,
            logo_url: formData.logo_url || null
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Brand created successfully"
        });
      }

      setFormData({ name: "", logo_url: "" });
      setShowAddBrand(false);
      setEditingBrand(null);
      fetchBrands();
    } catch (error) {
      console.error('Error saving brand:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${editingBrand ? 'update' : 'create'} brand`
      });
    }
  };

  const deleteBrand = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    try {
    const { error } = await supabase
      .from('brands' as any)
      .delete()
        .eq('id', id);

      if (error) throw error;

      setBrands(brands.filter(b => b.id !== id));
      toast({
        title: "Success",
        description: "Brand deleted successfully"
      });
    } catch (error: any) {
      console.error('Error deleting brand:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message?.includes('violates foreign key') 
          ? "Cannot delete brand - it's being used by products"
          : "Failed to delete brand"
      });
    }
  };

  const handleLogoUpload = async (file: File) => {
    try {
      setUploadingLogo(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `brand-logo-${Date.now()}.${fileExt}`;
      const filePath = `brands/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, logo_url: publicUrl }));

      toast({
        title: "Success",
        description: "Logo uploaded successfully"
      });

    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload logo"
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name, logo_url: brand.logo_url || "" });
    setShowAddBrand(true);
  };

  const closeModal = () => {
    setShowAddBrand(false);
    setEditingBrand(null);
    setFormData({ name: "", logo_url: "" });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading brands...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Brand Management</CardTitle>
          <Dialog open={showAddBrand} onOpenChange={closeModal}>
            <DialogTrigger asChild>
              <Button className="bg-admin-secondary hover:bg-admin-secondary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Brand
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingBrand ? 'Edit Brand' : 'Add New Brand'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name *</Label>
                  <Input
                    id="brand-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter brand name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Brand Logo (Optional)</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                    {formData.logo_url ? (
                      <div className="space-y-2">
                        <div className="relative inline-block">
                          <img 
                            src={formData.logo_url} 
                            alt="Brand logo"
                            className="w-20 h-20 object-contain rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => setFormData(prev => ({ ...prev, logo_url: "" }))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                          disabled={uploadingLogo}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Change Logo
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                          disabled={uploadingLogo}
                        >
                          {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                        </Button>
                      </div>
                    )}
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoUpload(file);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-admin-secondary hover:bg-admin-secondary/90">
                    {editingBrand ? 'Update Brand' : 'Create Brand'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {brand.logo_url ? (
                        <img 
                          src={brand.logo_url} 
                          alt={brand.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-xs text-muted-foreground">No logo</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell>
                    {new Date(brand.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditModal(brand)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteBrand(brand.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {brands.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No brands found. Add your first brand!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}