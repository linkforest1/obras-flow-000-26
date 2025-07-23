
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, LogOut } from "lucide-react";
import { GanttChart } from "@/components/GanttChart";

export default function Programming() {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [selectedWeek, setSelectedWeek] = useState<string>('current');

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden bg-background pb-[60px] md:pb-0">
          {/* Header */}
          <header className="bg-card border-b border-border p-3 md:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1 mr-2">
                <div className="min-w-0 flex-1">
                  <h1 className="text-base md:text-2xl font-bold text-foreground truncate flex items-center gap-2">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-vale-blue" />
                    <span className="hidden sm:inline">Programação de Atividades</span>
                    <span className="sm:hidden">Programação</span>
                  </h1>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">
                    <span className="hidden sm:inline">Cronograma visual das atividades do projeto</span>
                    <span className="sm:hidden">Cronograma visual</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                <div className="md:hidden">
                  <ThemeToggle />
                </div>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 p-2 md:px-3"
                >
                  <LogOut className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Sair</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <GanttChart selectedWeek={selectedWeek} />
          </div>
        </main>
      </div>
      <BottomNavBar />
    </SidebarProvider>
  );
}
