
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FilterProvider } from "@/contexts/FilterContext";
import Index from "./pages/Index";
import Activities from "./pages/Activities";
import Team from "./pages/Team";
import RDO from "./pages/RDO";
import Reports from "./pages/Reports";
import Programming from "./pages/Programming";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <FilterProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/atividades" 
                    element={
                      <ProtectedRoute>
                        <Activities />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/equipe" 
                    element={
                      <ProtectedRoute>
                        <Team />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/rdo" 
                    element={
                      <ProtectedRoute>
                        <RDO />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/programacao" 
                    element={
                      <ProtectedRoute>
                        <Programming />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/relatorios" 
                    element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    } 
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </FilterProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
};

export default App;
