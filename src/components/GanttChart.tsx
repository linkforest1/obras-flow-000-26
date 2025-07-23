
import React, { useState, useRef, useEffect } from 'react';
import { useActivities } from "@/hooks/useActivities";
import { WeekFilter } from "@/components/WeekFilter";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GanttChartProps {
  selectedWeek?: string;
}

const statusColors = {
  completed: 'bg-green-500',
  'in-progress': 'bg-blue-500',
  pending: 'bg-yellow-500',
  delayed: 'bg-red-500',
  'not-completed': 'bg-red-400'
};

const statusLabels = {
  completed: 'Concluída',
  'in-progress': 'Em Andamento',
  pending: 'Pendente',
  delayed: 'Atrasada',
  'not-completed': 'Não Concluída'
};

// Função para abreviar nomes dos dias para 3 letras
const getDayAbbreviation = (date: Date) => {
  const dayName = format(date, 'EEEE', { locale: ptBR });
  const abbreviations: { [key: string]: string } = {
    'segunda-feira': 'seg',
    'terça-feira': 'ter',
    'quarta-feira': 'qua',
    'quinta-feira': 'qui',
    'sexta-feira': 'sex',
    'sábado': 'sáb',
    'domingo': 'dom'
  };
  return abbreviations[dayName] || dayName.substring(0, 3);
};

export function GanttChart({ selectedWeek = 'current' }: GanttChartProps) {
  const { activities, loading } = useActivities();
  const [localSelectedWeek, setLocalSelectedWeek] = useState(selectedWeek);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // Sincronizar scroll horizontal entre cabeçalho e conteúdo
  const handleScroll = (source: 'header' | 'content') => (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    
    if (source === 'header' && contentScrollRef.current) {
      contentScrollRef.current.scrollLeft = scrollLeft;
    } else if (source === 'content' && headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = scrollLeft;
    }
  };

  // Calcular as datas da semana selecionada
  const getWeekDates = (weekValue: string) => {
    const today = new Date();
    let weekStart: Date;

    switch (weekValue) {
      case 'current':
        weekStart = startOfWeek(today, { weekStartsOn: 1 });
        break;
      case 'last-week':
        weekStart = startOfWeek(addDays(today, -7), { weekStartsOn: 1 });
        break;
      case 'two-weeks-ago':
        weekStart = startOfWeek(addDays(today, -14), { weekStartsOn: 1 });
        break;
      case 'three-weeks-ago':
        weekStart = startOfWeek(addDays(today, -21), { weekStartsOn: 1 });
        break;
      case 'month':
        weekStart = startOfWeek(addDays(today, -30), { weekStartsOn: 1 });
        break;
      default:
        weekStart = startOfWeek(today, { weekStartsOn: 1 });
    }

    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    return { weekStart, weekEnd };
  };

  const { weekStart, weekEnd } = getWeekDates(localSelectedWeek);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Filtrar atividades que têm datas usando a estrutura correta dos dados do Supabase
  const activitiesWithDates = activities?.filter(activity => 
    activity.startDate || activity.endDate
  ) || [];

  // Calcular posição e largura das barras
  const getActivityBar = (activity: any) => {
    if (!activity.startDate && !activity.endDate) return null;

    const startDate = activity.startDate ? parseISO(activity.startDate) : weekStart;
    const endDate = activity.endDate ? parseISO(activity.endDate) : weekEnd;

    // Calcular posição relativa na semana (0-100%)
    const totalDays = 7;
    const startDay = Math.max(0, Math.floor((startDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)));
    const endDay = Math.min(6, Math.floor((endDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)));
    
    const leftPercent = (startDay / totalDays) * 100;
    const widthPercent = ((endDay - startDay + 1) / totalDays) * 100;

    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 5)}%`, // Mínimo 5% de largura
    };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtro de semana */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {format(weekStart, 'dd/MM', { locale: ptBR })} - {format(weekEnd, 'dd/MM/yyyy', { locale: ptBR })}
        </h3>
        <WeekFilter 
          selectedWeek={localSelectedWeek} 
          onWeekChange={setLocalSelectedWeek} 
        />
      </div>

      {/* Layout unificado com scroll horizontal */}
      <Card className="p-4">
        <div className="relative">
          {/* Cabeçalho fixo verticalmente e scrollável horizontalmente */}
          <div className="sticky top-0 z-20 bg-card border-b border-border pb-4 mb-4">
            <div 
              ref={headerScrollRef}
              className="overflow-x-auto scrollbar-thin"
              onScroll={handleScroll('header')}
            >
              <div className="flex min-w-[800px]">
                <div className="w-80 font-medium text-sm pr-4 flex-shrink-0">Atividade</div>
                <div className="flex flex-1 min-w-0">
                  {weekDays.map((day, index) => (
                    <div key={index} className="flex-1 text-center text-sm font-medium min-w-[100px]">
                      <div>{getDayAbbreviation(day)}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(day, 'dd/MM')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Área de conteúdo scrollável */}
          <div className="h-[600px] overflow-y-auto">
            <div 
              ref={contentScrollRef}
              className="overflow-x-auto scrollbar-thin"
              onScroll={handleScroll('content')}
            >
              <div className="min-w-[800px]">
                <div className="space-y-3">
                  {activitiesWithDates.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhuma atividade com datas programadas encontrada</p>
                      <p className="text-sm">Adicione datas de início e fim às atividades para visualizá-las no cronograma</p>
                    </div>
                  ) : (
                    activitiesWithDates.map((activity) => {
                      const barStyle = getActivityBar(activity);
                      
                      return (
                        <div key={activity.id} className="flex items-center py-3 border-b border-border/50 last:border-b-0">
                          {/* Nome da atividade */}
                          <div className="w-80 pr-4 flex-shrink-0">
                            <div className="font-medium text-sm mb-2" title={activity.title}>
                              {activity.title}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge 
                                className={`${statusColors[activity.status as keyof typeof statusColors]} text-white text-xs`}
                              >
                                {statusLabels[activity.status as keyof typeof statusLabels]}
                              </Badge>
                              <span className="text-xs bg-muted px-2 py-1 rounded">
                                {activity.progress}%
                              </span>
                            </div>
                            {activity.discipline && (
                              <div className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-1 rounded inline-block">
                                {activity.discipline}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1">
                              <div>Início: {activity.startDate ? format(parseISO(activity.startDate), 'dd/MM/yyyy') : 'Não definido'}</div>
                              <div>Fim: {activity.endDate ? format(parseISO(activity.endDate), 'dd/MM/yyyy') : 'Não definido'}</div>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="flex-1 relative h-10 bg-gray-100 dark:bg-gray-800 rounded min-w-0">
                            {barStyle && (
                              <div
                                className={`absolute top-1 bottom-1 ${statusColors[activity.status as keyof typeof statusColors]} rounded opacity-80 flex items-center justify-center`}
                                style={barStyle}
                              >
                                <span className="text-xs text-white font-medium truncate px-1">
                                  {activity.progress}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(statusLabels).map(([status, label]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${statusColors[status as keyof typeof statusColors]}`}></div>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
