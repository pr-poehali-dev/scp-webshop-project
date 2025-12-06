import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/lib/auth';
import AuthDialog from './AuthDialog';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <>
      <nav className="border-b border-border/50 backdrop-blur-lg bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dark Paradise
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
              Главная
            </Link>
            <Link to="/shop" className="text-foreground/80 hover:text-foreground transition-colors">
              Магазин
            </Link>
            <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
              О нас
            </Link>
            
            {user ? (
              <div className="flex items-center gap-3">
                {user.is_admin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      <Icon name="Shield" size={16} className="mr-2" />
                      Админ
                    </Button>
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <Icon name="LogOut" size={16} />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setShowAuthDialog(true)}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                <Icon name="User" size={18} className="mr-2" />
                Войти
              </Button>
            )}
          </div>
        </div>
      </nav>

      <AuthDialog open={showAuthDialog} onClose={() => setShowAuthDialog(false)} />
    </>
  );
}
