
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, MessageSquare } from "lucide-react";
import { AddPhotoModal } from "@/components/AddPhotoModal";
import { CommentModal } from "@/components/CommentModal";
import { format, parseISO } from 'date-fns';
import { statusConfig, priorityConfig } from "@/config/activity";

interface ActivityDetailModalProps {
  open: boolean;
  onClose: () => void;
  activity: any;
}

export function ActivityDetailModal({ open, onClose, activity }: ActivityDetailModalProps) {
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  if (!activity) return null;

  const statusKey = activity.status as keyof typeof statusConfig;
  const priorityKey = activity.priority as keyof typeof priorityConfig;
  
  const statusInfo = statusConfig[statusKey] || statusConfig.pending;
  const priorityInfo = priorityConfig[priorityKey] || priorityConfig.medium;

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{activity.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">{activity.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Badge className={statusInfo.className}>
                {statusInfo.label}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium">Prioridade</label>
              <Badge className={priorityInfo.className}>
                {priorityInfo.label}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Responsável</label>
              <p>{activity.responsible || 'Não definido'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Progresso</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-vale-blue h-2 rounded-full" 
                    style={{ width: `${activity.progress || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm">{activity.progress || 0}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Data de Início</label>
              <p>{activity.startDate ? formatDate(activity.startDate) : 'Não definida'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Data de Fim</label>
              <p>{activity.endDate ? formatDate(activity.endDate) : 'Não definida'}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Semana</label>
            <p>{activity.week || 'Não definida'}</p>
          </div>

          <div>
            <label className="text-sm font-medium">ID da Atividade</label>
            <p>{activity.custom_id || activity.customId || 'Não definido'}</p>
          </div>

          {activity.location && (
            <div>
              <label className="text-sm font-medium">Local</label>
              <p>{activity.location}</p>
            </div>
          )}

          {activity.discipline && (
            <div>
              <label className="text-sm font-medium">Disciplina</label>
              <p>{activity.discipline}</p>
            </div>
          )}

          {activity.asset && (
            <div>
              <label className="text-sm font-medium">Ativo</label>
              <p>{activity.asset}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={() => setShowAddPhotoModal(true)}>
              <Camera className="w-4 h-4 mr-2" />
              Adicionar Foto
            </Button>
            <Button variant="outline" onClick={() => setShowCommentModal(true)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Comentar
            </Button>
          </div>
        </div>

        {showAddPhotoModal && (
          <AddPhotoModal
            open={showAddPhotoModal}
            onClose={() => setShowAddPhotoModal(false)}
            reportId={activity.id}
            reportTitle={activity.title}
          />
        )}

        {showCommentModal && (
          <CommentModal
            open={showCommentModal}
            onClose={() => setShowCommentModal(false)}
            activityId={activity.id}
            activityTitle={activity.title}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
