import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

export default function About() {
  const contacts = [
    { icon: 'Mail', label: 'Email', value: 'support@scpshop.ru', link: 'mailto:support@scpshop.ru' },
    { icon: 'MessageSquare', label: 'Discord', value: 'SCP Shop Server', link: '#' },
    { icon: 'Send', label: 'Telegram', value: '@scpshop', link: '#' },
  ];

  const team = [
    { name: 'Александр', role: 'Основатель', description: 'Идейный вдохновитель проекта' },
    { name: 'Мария', role: 'Технический директор', description: 'Разработка и поддержка сервера' },
    { name: 'Дмитрий', role: 'Менеджер сообщества', description: 'Работа с игроками' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <nav className="border-b border-border/50 backdrop-blur-lg bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SCP SHOP
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
              Главная
            </Link>
            <Link to="/shop" className="text-foreground/80 hover:text-foreground transition-colors">
              Магазин
            </Link>
            <Link to="/about" className="text-primary font-medium">
              О нас
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            О нас
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Мы создаем уникальный опыт игры в SCP: Secret Laboratory
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/20">
                <Icon name="Target" size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Наша миссия</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Мы стремимся создать лучший игровой опыт для всех игроков SCP: Secret Laboratory. 
              Наш магазин предлагает честные и сбалансированные привилегии, которые улучшают игровой процесс, 
              но не нарушают баланс игры.
            </p>
          </Card>

          <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-secondary/20">
                <Icon name="Shield" size={32} className="text-secondary" />
              </div>
              <h2 className="text-2xl font-bold">Безопасность</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Все транзакции защищены современными системами безопасности. 
              Мы используем проверенные платежные системы и гарантируем безопасность ваших данных. 
              Ваше доверие - наш главный приоритет.
            </p>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 animate-fade-in">Наша команда</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card 
                key={index}
                className="p-6 text-center border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
                  <Icon name="User" size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-8">Свяжитесь с нами</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {contacts.map((contact, index) => (
              <a
                key={index}
                href={contact.link}
                className="flex flex-col items-center p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all hover:scale-105"
              >
                <div className="p-3 rounded-full bg-primary/20 mb-4">
                  <Icon name={contact.icon as any} size={24} className="text-primary" />
                </div>
                <div className="text-sm text-muted-foreground mb-1">{contact.label}</div>
                <div className="font-medium">{contact.value}</div>
              </a>
            ))}
          </div>

          <div className="text-center">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity" size="lg">
              <Icon name="MessageCircle" size={20} className="mr-2" />
              Обратная связь
            </Button>
          </div>
        </Card>
      </main>

      <footer className="border-t border-border/50 mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 SCP Shop. Все права защищены.</p>
          <p className="text-sm mt-2">Не связано с официальной игрой SCP: Secret Laboratory</p>
        </div>
      </footer>
    </div>
  );
}
