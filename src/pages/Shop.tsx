import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
}

const products: Product[] = [
  { id: 1, name: 'VIP статус', price: 299, description: 'Эксклюзивный статус на 30 дней', category: 'Привилегии' },
  { id: 2, name: 'Премиум набор', price: 499, description: 'Полный набор уникальных предметов', category: 'Наборы' },
  { id: 3, name: 'Кастомная роль', price: 399, description: 'Создай свою уникальную роль', category: 'Кастомизация' },
  { id: 4, name: 'Приоритет входа', price: 199, description: 'Заходи на сервер без очереди', category: 'Привилегии' },
  { id: 5, name: 'Цветной ник', price: 149, description: 'Уникальный цвет твоего ника', category: 'Кастомизация' },
  { id: 6, name: 'Донат набор', price: 599, description: 'Все привилегии в одном пакете', category: 'Наборы' },
];

export default function Shop() {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

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
            <Link to="/shop" className="text-primary font-medium">
              Магазин
            </Link>
            <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
              О нас
            </Link>
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <Icon name="ShoppingCart" size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Магазин
          </h1>
          <p className="text-muted-foreground text-lg">
            Получи преимущества на сервере прямо сейчас
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card 
              key={product.id}
              className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                    {product.category}
                  </Badge>
                  <div className="text-2xl font-bold text-primary">
                    {product.price}₽
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  {product.description}
                </p>
                
                <Button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                >
                  <Icon name="ShoppingBag" size={18} className="mr-2" />
                  Добавить в корзину
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Корзина</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsCartOpen(false)}
                >
                  <Icon name="X" size={24} />
                </Button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Корзина пуста</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-4 rounded-lg bg-muted/30">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-primary font-bold">{item.price}₽</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(index)}
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Итого:</span>
                      <span className="text-primary">{totalPrice}₽</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                    size="lg"
                  >
                    <Icon name="CreditCard" size={20} className="mr-2" />
                    Оплатить через ЮMoney
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
