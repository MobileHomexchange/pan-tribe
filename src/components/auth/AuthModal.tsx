import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'register';
}

export function AuthModal({ open, onClose, defaultView = 'login' }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<'login' | 'register'>(defaultView);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0">
        {currentView === 'login' ? (
          <LoginForm onSwitchToRegister={() => setCurrentView('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setCurrentView('login')} />
        )}
      </DialogContent>
    </Dialog>
  );
}