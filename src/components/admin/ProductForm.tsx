import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Percent, Package } from "lucide-react";
import { MultiImageUpload } from "./MultiImageUpload";

interface ProductFormData {
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  price: string;
  description: string;
  image_url: string;
  additional_images: string[];
  discount_percentage: string;
  is_combo: boolean;
  combo_products: string[];
}

interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

interface Brand {
  id: string;
  name: string;
  logo_url?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
}

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    subcategory: "",
    brand: "",
    price: "",
    description: "",
    image_url: "",
    additional_images: [],
    discount_percentage: "",
    is_combo: false,
    combo_products: []
  });

  const selectedCategory = categories.find(cat => cat.name === formData.category);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProducts();
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
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, subcategory, price')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
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
        brand: data.brand || "",
        price: data.price.toString(),
        description: data.description || "",
        image_url: data.image_url || "",
        additional_images: data.additional_images || [],
        discount_percentage: data.discount_percentage?.toString() || "",
        is_combo: data.is_combo || false,
        combo_products: data.combo_products || []
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
      const discountPercentage = formData.discount_percentage ? parseFloat(formData.discount_percentage) : null;
      const discountedPrice = discountPercentage ? 
        parseFloat(formData.price) * (1 - discountPercentage / 100) : null;

      const productData = {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        brand: formData.brand || null,
        price: parseFloat(formData.price),
        description: formData.description,
        image_url: formData.image_url,
        additional_images: formData.additional_images,
        discount_percentage: discountPercentage,
        discounted_price: discountedPrice,
        is_combo: formData.is_combo,
        combo_products: formData.is_combo ? formData.combo_products : []
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

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addBrand = async () => {
    if (!newBrandName.trim()) return;

    try {
      const { error } = await supabase
        .from('brands' as any)
        .insert({
          name: newBrandName
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Brand added successfully"
      });

      setNewBrandName("");
      setShowAddBrand(false);
      fetchBrands();
    } catch (error) {
      console.error('Error adding brand:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add brand"
      });
    }
  };

  const getDiscountedPrice = () => {
    if (!formData.discount_percentage || !formData.price) return null;
    const price = parseFloat(formData.price);
    const discount = parseFloat(formData.discount_percentage);
    return price * (1 - discount / 100);
  };

  const availableProductsForCombo = products.filter(p => 
    p.id !== id && !formData.combo_products.includes(p.id)
  );

  const selectedComboProducts = products.filter(p => 
    formData.combo_products.includes(p.id)
  );

  const toggleComboProduct = (productId: string) => {
    const updatedComboProducts = formData.combo_products.includes(productId)
      ? formData.combo_products.filter(id => id !== productId)
      : [...formData.combo_products, productId];
    
    handleInputChange('combo_products', updatedComboProducts);
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="brand">Brand</Label>
                  <Dialog open={showAddBrand} onOpenChange={setShowAddBrand}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Brand
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Brand</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="new-brand">Brand Name</Label>
                          <Input
                            id="new-brand"
                            value={newBrandName}
                            onChange={(e) => setNewBrandName(e.target.value)}
                            placeholder="Enter brand name"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddBrand(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addBrand}>
                            Add Brand
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Select
                  value={formData.brand}
                  onValueChange={(value) => handleInputChange('brand', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.name}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="space-y-2">
                <Label htmlFor="discount">Discount Percentage</Label>
                <div className="relative">
                  <Input
                    id="discount"
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => handleInputChange('discount_percentage', e.target.value)}
                    placeholder="0"
                    min="0"
                    max="100"
                    step="1"
                  />
                  <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {formData.discount_percentage && formData.price && (
                  <p className="text-sm text-muted-foreground">
                    Discounted price: {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(getDiscountedPrice() || 0)}
                  </p>
                )}
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
              <Label>Product Images</Label>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Main Image *</Label>
                  <MultiImageUpload
                    images={formData.image_url ? [formData.image_url] : []}
                    onChange={(images) => handleInputChange('image_url', images[0] || '')}
                    maxImages={1}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Additional Images (Optional)</Label>
                  <MultiImageUpload
                    images={formData.additional_images}
                    onChange={(images) => handleInputChange('additional_images', images)}
                    maxImages={4}
                  />
                </div>
              </div>
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

            {/* Combo Product Section */}
            <div className="space-y-4 p-6 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-combo"
                  checked={formData.is_combo}
                  onCheckedChange={(checked) => {
                    handleInputChange('is_combo', !!checked);
                    if (!checked) {
                      handleInputChange('combo_products', []);
                    }
                  }}
                />
                <Label htmlFor="is-combo" className="flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Create Combo Product
                </Label>
              </div>

              {formData.is_combo && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Select Products for Combo</Label>
                    <div className="mt-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-background">
                      {availableProductsForCombo.map((product) => (
                        <div key={product.id} className="flex items-center space-x-2 py-2">
                          <Checkbox
                            id={`combo-${product.id}`}
                            checked={formData.combo_products.includes(product.id)}
                            onCheckedChange={() => toggleComboProduct(product.id)}
                          />
                          <Label htmlFor={`combo-${product.id}`} className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <span>{product.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                                }).format(product.price)}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {product.category} • {product.subcategory}
                            </div>
                          </Label>
                        </div>
                      ))}
                      {availableProductsForCombo.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No other products available for combo
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedComboProducts.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Selected Products ({selectedComboProducts.length})</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedComboProducts.map((product) => (
                          <Badge key={product.id} variant="secondary" className="flex items-center gap-1">
                            {product.name}
                            <button
                              type="button"
                              onClick={() => toggleComboProduct(product.id)}
                              className="ml-1 rounded-full hover:bg-muted-foreground/20"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Individual total: {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(selectedComboProducts.reduce((sum, p) => sum + p.price, 0))}
                      </p>
                    </div>
                  )}
                </div>
              )}
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