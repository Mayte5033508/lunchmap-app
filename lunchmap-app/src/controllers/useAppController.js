import { useState, useEffect } from 'react';
import { StorageModel } from '../models/storageModel';
import { DEFAULT_CAFETERIAS, DEFAULT_MENU_ITEMS, DEFAULT_USERS } from '../models/constants';

export function useAppController() {
  const [users, setUsers] = useState(() => StorageModel.get('lm_users', DEFAULT_USERS));
  const [cafeterias, setCafeterias] = useState(() => StorageModel.get('lm_cafeterias', DEFAULT_CAFETERIAS));
  const [menuItems, setMenuItems] = useState(() => StorageModel.get('lm_menu_items', DEFAULT_MENU_ITEMS));
  
  // Persistencia de Carrito y Pedidos Confirmados
  const [cart, setCart] = useState(() => StorageModel.get('lm_cart', []));
  const [orders, setOrders] = useState(() => StorageModel.get('lm_orders', []));
  const [theme, setTheme] = useState(() => StorageModel.get('lm_theme', 'light'));

  // Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    StorageModel.set('lm_cart', cart);
  }, [cart]);

  // Guardar en localStorage cuando cambien los pedidos
  useEffect(() => {
    StorageModel.set('lm_orders', orders);
  }, [orders]);

  useEffect(() => {
    StorageModel.set('lm_users', users);
  }, [users]);

  useEffect(() => {
    StorageModel.set('lm_cafeterias', cafeterias);
  }, [cafeterias]);

  useEffect(() => {
    StorageModel.set('lm_menu_items', menuItems);
  }, [menuItems]);

  // Manejador de confirmación de pedido
  const handleCheckout = (currentUser, pickupTime) => {
    if (!cart || cart.length === 0) return;

    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      studentId: currentUser.id,
      studentName: currentUser.name,
      cafeteriaId: cart[0]?.cafeteriaId || 'c_cafetin1',
      cafeteriaName: cart[0]?.cafeteriaName || 'Cafetín Escolar',
      items: [...cart],
      total: cart.reduce((s, i) => s + i.price, 0),
      pickupTime: pickupTime || 'Recreo 1',
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    setCart([]); // Vacía el carrito activo tras confirmar el apartado
    alert(`¡Reserva confirmada con éxito!\nCódigo de Pedido: ${newOrder.id}`);
  };

  return {
    users,
    setUsers,
    cafeterias,
    setCafeterias,
    menuItems,
    setMenuItems,
    cart,
    setCart,
    orders,
    setOrders,
    theme,
    setTheme,
    handleCheckout
  };
}