import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

export default function Home() {
  const news = [
    {
      id: 1,
      date: '15 декабря 2024',
      title: 'Новогодняя распродажа!',
      description: 'Скидки до 50% на все привилегии. Успей купить выгодно!',
      badge: 'Акция'
    },
    {
      id: 2,
      date: '10 декабря 2024',
      title: 'Обновление магазина',
      description: 'Добавлены новые эксклюзивные предметы и роли',
      badge: 'Новости'
    },
    {
      id: 3,
      date: '5 декабря 2024',
      title: 'Запуск нового сервера',
      description: 'Открылся новый сервер с уникальными модами',
      badge: 'Важное'
    },
  ];

  const features = [
    {
      icon: 'Zap',
      title: 'Мгновенная выдача',
      description: 'Получи покупку сразу после оплаты'
    },
    {
      icon: 'Shield',
      title: 'Безопасные платежи',
      description: 'Все транзакции защищены'
    },
    {
      icon: 'Headphones',
      title: 'Поддержка 24/7',
      description: 'Всегда готовы помочь'
    },
    {
      icon: 'Star',
      title: 'Честные цены',
      description: 'Прозрачная ценовая политика'
    },
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
            <Link to="/" className="text-primary font-medium">
              Главная
            </Link>
            <Link to="/shop" className="text-foreground/80 hover:text-foreground transition-colors">
              Магазин
            </Link>
            <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
              О нас
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 text-sm px-4 py-1">
              Лучший магазин для SCP:SL
            </Badge>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              SCP Shop
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Улучши свой игровой опыт в SCP: Secret Laboratory с нашими эксклюзивными предложениями
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/shop">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                  <Icon name="ShoppingBag" size={20} className="mr-2" />
                  Перейти в магазин
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  <Icon name="Info" size={20} className="mr-2" />
                  Узнать больше
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-6 text-center border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
                  <Icon name={feature.icon as any} size={24} className="text-white" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Последние новости</h2>
            <p className="text-muted-foreground">Будь в курсе всех событий</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <Card 
                key={item.id}
                className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                      {item.badge}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{item.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <Card className="p-12 text-center border-border/50 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">О магазине</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
              SCP Shop — это официальный магазин для игроков SCP: Secret Laboratory. 
              Мы предлагаем широкий выбор привилегий, наборов и кастомизаций для улучшения вашего игрового опыта. 
              Все покупки моментально активируются на вашем аккаунте. Присоединяйтесь к тысячам довольных игроков!
            </p>
            <div className="flex flex-wrap gap-6 justify-center items-center text-center">
              <div>
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Довольных игроков</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div>
                <div className="text-3xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-muted-foreground">Поддержка</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Гарантия</div>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 SCP Shop. Все права защищены.</p>
          <p className="text-sm mt-2">Не связано с официальной игрой SCP: Secret Laboratory</p>
        </div>
      </footer>
    </div>
  );
}
