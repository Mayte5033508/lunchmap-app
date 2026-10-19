export const DEFAULT_SCHOOL_CODE = "12117";

// 1. USUARIOS REGISTRADOS DE CAFETINES (Credenciales de acceso)
export const DEFAULT_USERS = [
  {
    id: 'u_cafetin1',
    email: 'cafetin1@clases.edu.sv',
    username: 'cafetin1',
    password: '123',
    name: 'Cafetín 1 - Delicias Escolares',
    schoolCode: DEFAULT_SCHOOL_CODE,
    role: 'cafeteria',
    tier: 'estándar',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200'
  },
  {
    id: 'u_cafetin2',
    email: 'cafetin2@clases.edu.sv',
    username: 'cafetin2',
    password: '123',
    name: 'Cafetín 2 - Sabor & Nutrición',
    schoolCode: DEFAULT_SCHOOL_CODE,
    role: 'cafeteria',
    tier: 'estándar + plus',
    avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200'
  },
  {
    id: 'u_cafetin3',
    email: 'cafetin3@clases.edu.sv',
    username: 'cafetin3',
    password: '123',
    name: 'Cafetín 3 - Antojitos & Express',
    schoolCode: DEFAULT_SCHOOL_CODE,
    role: 'cafeteria',
    tier: 'estándar + premium',
    avatar: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200'
  }
];

// 2. CAFETERÍAS UNICAMENTE (Exactamente 3)
export const DEFAULT_CAFETERIAS = [
  { 
    id: 'c_cafetin1', 
    ownerId: 'u_cafetin1', 
    name: 'Cafetín 1', 
    schoolCode: DEFAULT_SCHOOL_CODE, 
    location: 'Edificio A - Planta Baja', 
    description: 'Comida casera tradicional, desayunos y almuerzos ejecutivos.', 
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200', 
    isOpen: true 
  },
  { 
    id: 'c_cafetin2', 
    ownerId: 'u_cafetin2', 
    name: 'Cafetín 2', 
    schoolCode: DEFAULT_SCHOOL_CODE, 
    location: 'Plaza Central del Colegio', 
    description: 'Ensaladas frescas, wraps, pechuga a la plancha, frutas y batidos.', 
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200', 
    isOpen: true 
  },
  { 
    id: 'c_cafetin3', 
    ownerId: 'u_cafetin3', 
    name: 'Cafetín 3', 
    schoolCode: DEFAULT_SCHOOL_CODE, 
    location: 'Pasillo Principal de Bachillerato', 
    description: 'Pupusas, empanadas, canoas, tortas y snacks tradicionales.', 
    logo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200', 
    isOpen: true 
  }
];

// 3. EXTRAS DISPONIBLES SIEMPRE (Accesorios para cualquier menú)
export const ALWAYS_AVAILABLE_EXTRAS = [
  { id: 'ext_1', name: 'Porción de Pan Francés', price: 0.25, category: 'extra', description: 'Pieza de pan calentito.' },
  { id: 'ext_2', name: 'Porción de Crema', price: 0.35, category: 'extra', description: 'Cucharada de crema pura.' },
  { id: 'ext_3', name: 'Huevo Adicional (Estrellado/Picado)', price: 0.50, category: 'extra', description: 'Huevo preparado al gusto.' },
  { id: 'ext_4', name: 'Porción de Queso Fresco', price: 0.50, category: 'extra', description: 'Lasca de queso artesanal.' },
  { id: 'ext_5', name: 'Porción de Frijoles Refritos', price: 0.50, category: 'extra', description: 'Frijoles rojos molidos.' },
  { id: 'ext_6', name: 'Porción de Arroz Blanco', price: 0.50, category: 'extra', description: 'Arroz calientito esponjoso.' },
  { id: 'ext_7', name: 'Orden de 2 Tortillas', price: 0.25, category: 'extra', description: 'Tortillas de maíz calientes.' },
  { id: 'ext_8', name: 'Porción de Aguacate', price: 0.75, category: 'extra', description: 'Mitad de aguacate maduro.' }
];

// 4. CATÁLOGO MAESTRO DE PLATILLOS (Insumos para que el cafetín cree su menú)
export const RECIPES_CATALOG = [
  // DESAYUNOS
  { id: 'rec_1', name: 'Desayuno Típico Criollo', price: 2.50, category: 'desayuno', description: 'Huevos picados o estrellados, frijoles colados, plátano frito, queso fresco y 2 tortillas.', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=300' },
  { id: 'rec_2', name: 'Pancakes con Miel y Frutas', price: 2.25, category: 'desayuno', description: 'Tres pancakes esponjosos servidos con miel de abeja y rodajas de banano o fresa.', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300' },
  { id: 'rec_3', name: 'Omelette de Vegetales con Queso', price: 2.75, category: 'desayuno', description: 'Huevos batidos con espinaca, tomate, pimiento verde y queso mozzarella.', image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=300' },
  { id: 'rec_4', name: 'Orden de 3 Pupusas Tradicionales', price: 2.25, category: 'desayuno', description: 'Queso con ayote, frijol con queso o revueltas con curtido y salsa.', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300' },

  // ALMUERZOS
  { id: 'rec_5', name: 'Pollo Guisado Casero', price: 3.50, category: 'almuerzo', description: 'Pieza de pollo guisado con papas y zanahoria, arroz blanco, ensalada fresca y tortillas.', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300' },
  { id: 'rec_6', name: 'Pechuga a la Plancha', price: 3.75, category: 'almuerzo', description: 'Pechuga marinada a las finas hierbas con puré de papas y vegetales al vapor.', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300' },
  { id: 'rec_7', name: 'Carne Entomatada de Res', price: 3.75, category: 'almuerzo', description: 'Corte jugoso de res en salsa suave de tomate, servido con arroz y frijoles.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300' },
  { id: 'rec_8', name: 'Pollo Empanizado Crispy', price: 3.50, category: 'almuerzo', description: 'Crispy chicken dorado con papas fritas, ensalada de repollo y aderezo.', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=300' },
  { id: 'rec_9', name: 'Lasagna de Carne Molida', price: 4.00, category: 'almuerzo', description: 'Capas de pasta gratinada con salsa boloñesa, queso mozzarella y pan con ajo.', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300' },
  { id: 'rec_10', name: 'Sopa de Res Criolla', price: 3.50, category: 'almuerzo', description: 'Sopa casera con verdura mixta (yuca, elote, güisquil) con arroz y tortilla.', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300' },

  // SNACKS
  { id: 'rec_11', name: 'Canoa de Plátano Maduro', price: 1.50, category: 'snack', description: 'Plátano maduro horneado relleno de leche poleada suave o frijoles refritos.', image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=300' },
  { id: 'rec_12', name: 'Orden de Papas Fritas', price: 1.50, category: 'snack', description: 'Papas cortadas estilo francés, crujientes, con queso fundido o aderezos.', image: 'https://images.unsplash.com/photo-1576107232684-1279f3908591?w=300' },
  { id: 'rec_13', name: 'Sandwich de Pollo / Jamón', price: 1.75, category: 'snack', description: 'Pan molde tostado con pollo desmenuzado o jamón, queso, lechuga y mayonesa.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300' },
  { id: 'rec_14', name: 'Torta de Jamón y Queso Especial', price: 2.25, category: 'snack', description: 'Pan francés calentito relleno con abundante jamón, queso derretido y tomate.', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=300' },

  // BEBIDAS
  { id: 'rec_15', name: 'Café Caliente de Altura (8 oz)', price: 0.75, category: 'bebida', description: 'Café gourmet recién colado.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300' },
  { id: 'rec_16', name: 'Chocolate Caliente Espumoso (8 oz)', price: 1.00, category: 'bebida', description: 'Chocolate artesanal preparado con leche caliente.', image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=300' },
  { id: 'rec_17', name: 'Fresco Natural de Horchata (16 oz)', price: 1.00, category: 'bebida', description: 'Bebida helada artesanal con toque de canela.', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300' },
  { id: 'rec_18', name: 'Botella de Agua Purificada (600 ml)', price: 0.60, category: 'bebida', description: 'Agua mineral embotellada helada.', image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=300' }
];

// 5. PUBLICACIONES INICIALES VACÍAS (0 publicaciones de entrada)
export const DEFAULT_MENU_ITEMS = [];