import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/admin/AdminLayout";
import ProductsPage from "./pages/admin/ProductsPage";
import AddProductPage from "./pages/admin/AddProductPage";
import EditProductPage from "./pages/admin/EditProductPage";
import CategoryManagement from "./pages/admin/CategoryManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to products page */}
          <Route path="/" element={<Navigate to="/admin/products" replace />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
          <Route path="/admin/products" element={<AdminLayout><ProductsPage /></AdminLayout>} />
          <Route path="/admin/products/add" element={<AdminLayout><AddProductPage /></AdminLayout>} />
          <Route path="/admin/products/edit/:id" element={<AdminLayout><EditProductPage /></AdminLayout>} />
          <Route path="/admin/categories" element={<AdminLayout><CategoryManagement /></AdminLayout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
