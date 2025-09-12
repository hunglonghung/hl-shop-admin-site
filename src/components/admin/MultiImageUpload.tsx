import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function MultiImageUpload({ images, onChange, maxImages = 5 }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (files: FileList) => {
    if (files.length === 0) return;
    
    const remainingSlots = maxImages - images.length;
    if (files.length > remainingSlots) {
      toast({
        variant: "destructive",
        title: "Too many images",
        description: `You can only upload ${remainingSlots} more image(s)`
      });
      return;
    }

    try {
      setUploading(true);
      const uploadPromises = Array.from(files).map(async (file) => {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large (max 5MB)`);
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not a valid image`);
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/gallery/${fileName}`;

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);

      toast({
        title: "Success",
        description: `Uploaded ${uploadedUrls.length} image(s) successfully`
      });

    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload images"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleImageUpload(files);
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden bg-muted">
              <img 
                src={imageUrl} 
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <div 
            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className="text-center">
                <div className="animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-xs text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div className="text-center">
                <Plus className="w-6 h-6 text-muted-foreground mb-2 mx-auto" />
                <p className="text-xs text-muted-foreground">Add Image</p>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading || images.length >= maxImages}
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{images.length} of {maxImages} images</span>
        <span>Supported: JPEG, PNG, WebP (max 5MB each)</span>
      </div>
    </div>
  );
}