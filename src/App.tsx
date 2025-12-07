import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WallpaperProvider } from "@/contexts/WallpaperContext";
import { MobileWallpaperProvider } from "@/contexts/MobileWallpaperContext";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { HomeScreenProvider } from "@/contexts/HomeScreenContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <WallpaperProvider>
        <MobileWallpaperProvider>
          <WidgetProvider>
            <HomeScreenProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </HomeScreenProvider>
          </WidgetProvider>
        </MobileWallpaperProvider>
      </WallpaperProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
