import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, X, ImageIcon, Plus } from "lucide-react";

interface ProductFormData {
  name: string;
  category: string;
  subcategory: string;
  price: string;
  description: string;
  image_url: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    description: "",
    image_url: ""
  });

  const selectedCategory = categories.find(cat => cat.name === formData.category);

  useEffect(() => {
    fetchCategories();
    if (isEdit && id) {
      fetchProduct(id);
    }
  }, [id, isEdit]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch categories"
      });
    }
  };

  const fetchProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name,
        category: data.category,
        subcategory: data.subcategory,
        price: data.price.toString(),
        description: data.description || "",
        image_url: data.image_url || ""
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch product details"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        price: parseFloat(formData.price),
        description: formData.description,
        image_url: formData.image_url
      };

      if (isEdit && id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;

        toast({
          title: "Success", 
          description: "Product created successfully"
        });
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} product`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `product-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Update form data with the new image URL
      handleInputChange('image_url', publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "File size must be less than 5MB"
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a valid image file"
        });
        return;
      }

      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    handleInputChange('image_url', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          name: newCategoryName.toLowerCase(),
          subcategories: newSubcategory ? [newSubcategory] : []
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category added successfully"
      });

      setNewCategoryName("");
      setNewSubcategory("");
      setShowAddCategory(false);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add category"
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/products')}
          className="px-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Update Product Details' : 'Product Information'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (VND) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1000"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="category">Category *</Label>
                  <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="new-category">Category Name</Label>
                          <Input
                            id="new-category"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Enter category name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-subcategory">First Subcategory (Optional)</Label>
                          <Input
                            id="new-subcategory"
                            value={newSubcategory}
                            onChange={(e) => setNewSubcategory(e.target.value)}
                            placeholder="Enter subcategory name"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddCategory(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addCategory}>
                            Add Category
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    handleInputChange('category', value);
                    handleInputChange('subcategory', '');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory *</Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) => handleInputChange('subcategory', value)}
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory?.subcategories.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory.toLowerCase()}>
                        {subcategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                {formData.image_url ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img 
                        src={formData.image_url} 
                        alt="Product preview"
                        className="w-40 h-40 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Change Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a product image (max 5MB)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingImage ? 'Uploading...' : 'Choose Image'}
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPEG, PNG, WebP. Maximum size: 5MB
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description..."
                rows={4}
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/products')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-admin-secondary hover:bg-admin-secondary/90"
              >
                {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}