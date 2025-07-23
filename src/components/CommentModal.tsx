
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { useActivityInteractions } from "@/hooks/useActivityInteractions";

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  activityId: string;
  activityTitle: string;
}

export function CommentModal({ open, onClose, activityId, activityTitle }: CommentModalProps) {
  const [comment, setComment] = useState('');
  const { addComment } = useActivityInteractions();

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    const result = await addComment(activityId, comment.trim());
    if (result) {
      setComment('');
      onClose();
    }
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Comentário</DialogTitle>
          <p className="text-sm text-muted-foreground">{activityTitle}</p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="comment">Comentário</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Digite seu comentário sobre a atividade..."
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!comment.trim()}
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Adicionar Comentário
            </Button>
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
