import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthDialog({ open, onClose }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [demoSteamId, setDemoSteamId] = useState('');
  const [demoDiscordId, setDemoDiscordId] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSteamLogin = async () => {
    if (!demoSteamId) {
      toast({ title: 'Ошибка', description: 'Введите Steam ID', variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.loginSteam(demoSteamId, `Player_${demoSteamId.slice(0, 6)}`, undefined);
      login(response.user, response.token);
      toast({ title: 'Успешно', description: 'Вы вошли через Steam' });
      onClose();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось войти', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = async () => {
    if (!demoDiscordId) {
      toast({ title: 'Ошибка', description: 'Введите Discord ID', variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.loginDiscord(demoDiscordId, `User_${demoDiscordId.slice(0, 6)}`, undefined);
      login(response.user, response.token);
      toast({ title: 'Успешно', description: 'Вы вошли через Discord' });
      onClose();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось войти', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Войти в аккаунт</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Войти через Steam</p>
            <div className="flex gap-2">
              <Input 
                placeholder="Введите Steam ID" 
                value={demoSteamId}
                onChange={(e) => setDemoSteamId(e.target.value)}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSteamLogin}
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                <Icon name="User" size={18} />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">или</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Войти через Discord</p>
            <div className="flex gap-2">
              <Input 
                placeholder="Введите Discord ID" 
                value={demoDiscordId}
                onChange={(e) => setDemoDiscordId(e.target.value)}
                disabled={isLoading}
              />
              <Button 
                onClick={handleDiscordLogin}
                disabled={isLoading}
                variant="secondary"
                className="bg-gradient-to-r from-secondary to-primary"
              >
                <Icon name="MessageCircle" size={18} />
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Для демо версии просто введите любой ID
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
