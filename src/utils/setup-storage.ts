import { supabase } from "@/integrations/supabase/client";

export async function setupStorageBucket() {
  try {
    // First, check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'product-images');
    
    if (bucketExists) {
      console.log('Storage bucket "product-images" already exists');
      return true;
    }

    // Create the bucket
    const { data, error } = await supabase.storage.createBucket('product-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
      console.error('Error creating storage bucket:', error);
      return false;
    }

    console.log('Storage bucket "product-images" created successfully:', data);
    return true;

  } catch (error) {
    console.error('Error setting up storage bucket:', error);
    return false;
  }
}

// Helper function to test bucket access
export async function testBucketAccess() {
  try {
    const { data, error } = await supabase.storage
      .from('product-images')
      .list();

    if (error) {
      console.error('Error accessing bucket:', error);
      return false;
    }

    console.log('Bucket access test successful');
    return true;
  } catch (error) {
    console.error('Error testing bucket access:', error);
    return false;
  }
}
