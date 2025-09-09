import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Settings } from "lucide-react";
import { setupStorageBucket, testBucketAccess } from "@/utils/setup-storage";
import { useToast } from "@/hooks/use-toast";

export function StorageSetup() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSetupStorage = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Test if bucket already exists
      const bucketExists = await testBucketAccess();
      
      if (bucketExists) {
        setIsSetupComplete(true);
        toast({
          title: "Success",
          description: "Storage bucket is already configured and accessible"
        });
        return;
      }

      // Try to create the bucket
      const setupSuccess = await setupStorageBucket();
      
      if (setupSuccess) {
        setIsSetupComplete(true);
        toast({
          title: "Success", 
          description: "Storage bucket created successfully"
        });
      } else {
        throw new Error("Failed to create storage bucket");
      }

    } catch (error) {
      console.error('Storage setup error:', error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to setup storage");
      toast({
        variant: "destructive",
        title: "Setup Failed",
        description: "Please set up storage manually in Supabase dashboard"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSetupComplete) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Storage is configured correctly. You can now upload product images.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Storage Setup Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Image upload requires a Supabase storage bucket. Click below to set it up automatically.
          </AlertDescription>
        </Alert>

        <Button 
          onClick={handleSetupStorage}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Setting up..." : "Setup Storage Bucket"}
        </Button>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>{errorMessage}</p>
                <p className="text-sm">
                  <strong>Manual Setup:</strong> Go to your Supabase Dashboard → Storage → 
                  Create bucket named "product-images" with public access enabled.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
