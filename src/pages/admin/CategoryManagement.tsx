import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  subcategories: string[];
  created_at: string;
  updated_at: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newSubcategories, setNewSubcategories] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

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
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const { error } = await supabase
        .from('categories')
        .insert([{ name: newCategoryName.trim(), subcategories: [] }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category created successfully",
      });
      
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const addSubcategory = (categoryId: string) => {
    const subcategoryName = newSubcategories[categoryId]?.trim();
    if (!subcategoryName) return;

    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const updatedSubcategories = [...category.subcategories, subcategoryName];
    updateCategory(categoryId, { subcategories: updatedSubcategories });
    
    setNewSubcategories(prev => ({ ...prev, [categoryId]: "" }));
  };

  const removeSubcategory = (categoryId: string, subcategoryIndex: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const updatedSubcategories = category.subcategories.filter((_, index) => index !== subcategoryIndex);
    updateCategory(categoryId, { subcategories: updatedSubcategories });
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category.id);
    setEditingName(category.name);
  };

  const saveEdit = (categoryId: string) => {
    if (!editingName.trim()) return;
    updateCategory(categoryId, { name: editingName.trim() });
    setEditingCategory(null);
    setEditingName("");
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingName("");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Category Management</h1>
        <p className="text-muted-foreground">
          Manage product categories and their subcategories for better organization.
        </p>
      </div>

      {/* Add New Category */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createCategory()}
              />
            </div>
            <Button onClick={createCategory} disabled={!newCategoryName.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex-1">
                {editingCategory === category.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(category.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="text-lg font-medium"
                    />
                    <Button size="sm" onClick={() => saveEdit(category.id)}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <CardTitle className="flex items-center gap-2">
                    {category.name}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => startEditing(category)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                )}
              </div>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => deleteCategory(category.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Subcategories */}
                <div>
                  <Label className="text-sm font-medium">Subcategories</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {category.subcategories.map((subcategory, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="flex items-center gap-1"
                      >
                        {subcategory}
                        <button
                          onClick={() => removeSubcategory(category.id, index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Add Subcategory */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add subcategory"
                    value={newSubcategories[category.id] || ""}
                    onChange={(e) => 
                      setNewSubcategories(prev => ({ 
                        ...prev, 
                        [category.id]: e.target.value 
                      }))
                    }
                    onKeyDown={(e) => e.key === 'Enter' && addSubcategory(category.id)}
                  />
                  <Button 
                    size="sm" 
                    onClick={() => addSubcategory(category.id)}
                    disabled={!newSubcategories[category.id]?.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No categories found. Create your first category above.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}