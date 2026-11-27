export interface MenuItem {
  id: string;
  name: string;
  category: 'pasta' | 'steak' | 'pizza' | 'dessert' | 'drinks' | 'salads';
  price: number;
  description: string;
  image: string;
  badge?: string;
  calories?: string;
  isSignature?: boolean;
}

export interface MenuCategory {
  id: 'pasta' | 'steak' | 'pizza' | 'dessert' | 'drinks' | 'salads';
  name: string;
  subtitle: string;
  thumbnail: string;
}

export interface CartItem {
  dish: MenuItem;
  quantity: number;
}
