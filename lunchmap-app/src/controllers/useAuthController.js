import { useState, useEffect, useCallback } from 'react';
import { StorageModel } from '../models/storageModel';
import { DEFAULT_SCHOOL_CODE } from '../models/constants';

export function useAuthController(users, setUsers, setCafeterias) {
  const [currentUser, setCurrentUser] = useState(() => StorageModel.get('lm_session', null));
  
  // Estado para la pestaña activa en Login: 'student' (Google) | 'cafeteria' (Usuario/Pass)
  const [roleType, setRoleType] = useState('student');
  const [schoolCode, setSchoolCode] = useState('');
  
  // Campos del formulario de Login tradicional para Cafetín
  const [cafeteriaLoginData, setCafeteriaLoginData] = useState({
    usernameOrEmail: '',
    password: ''
  });

  // Guardar/limpiar sesión en localStorage
  useEffect(() => {
    if (currentUser) {
      StorageModel.set('lm_session', currentUser);
    } else {
      StorageModel.remove('lm_session');
    }
  }, [currentUser]);

  // 1. INGRESO EXCLUSIVO PARA ESTUDIANTES (@clases.edu.sv vía Google)
  const handleGoogleResponse = useCallback((response) => {
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const googleUser = JSON.parse(jsonPayload);
      const userEmail = googleUser.email.toLowerCase();

      // RESTRICCIÓN ESTRICTA DE DOMINIO INSTITUCIONAL PARA ESTUDIANTES
      if (!userEmail.endsWith('@clases.edu.sv')) {
        alert(`⛔ Acceso restringido para estudiantes.\nEl correo "${googleUser.email}" no pertenece al dominio oficial @clases.edu.sv.`);
        return;
      }

      let existingUser = users.find(u => u.email.toLowerCase() === userEmail);

      if (existingUser) {
        setCurrentUser(existingUser);
        alert(`¡Bienvenido de nuevo, ${existingUser.name}!`);
      } else {
        const cleanSchoolCode = schoolCode.trim().toUpperCase() || DEFAULT_SCHOOL_CODE;

        const newStudent = {
          id: 'u_' + Date.now(),
          email: userEmail,
          name: googleUser.name,
          schoolCode: cleanSchoolCode,
          role: 'student',
          tier: 'free',
          avatar: googleUser.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
        };

        setUsers(prev => [...prev, newStudent]);
        setCurrentUser(newStudent);
        alert(`¡Cuenta institucional de estudiante registrada!\nCorreo: ${userEmail}`);
      }
    } catch (error) {
      console.error("Error Google Auth:", error);
      alert("Error al intentar ingresar con Google.");
    }
  }, [users, schoolCode, setUsers]);

  // 2. INGRESO / REGISTRO POR USUARIO Y CONTRASEÑA PARA CAFETINES
  const handlePasswordLogin = (e) => {
    e.preventDefault();
    const { usernameOrEmail, password } = cafeteriaLoginData;

    if (!usernameOrEmail.trim() || !password.trim()) {
      alert("Por favor completa el usuario y la contraseña.");
      return;
    }

    const cleanInput = usernameOrEmail.trim().toLowerCase();

    // Buscar si ya existe una cafetería registrada con este usuario/correo
    let existingCafeteriaUser = users.find(
      u => u.role === 'cafeteria' && (u.email.toLowerCase() === cleanInput || u.username?.toLowerCase() === cleanInput)
    );

    if (existingCafeteriaUser) {
      // Validación simple de contraseña
      if (existingCafeteriaUser.password && existingCafeteriaUser.password !== password) {
        alert("🔑 Contraseña incorrecta. Inténtalo de nuevo.");
        return;
      }
      setCurrentUser(existingCafeteriaUser);
      alert(`¡Bienvenido al Panel de Administración, ${existingCafeteriaUser.name}!`);
    } else {
      // Si el usuario no existe, se registra automáticamente el nuevo Cafetín
      const cleanSchoolCode = schoolCode.trim().toUpperCase() || DEFAULT_SCHOOL_CODE;
      const userId = 'u_' + Date.now();
      const cafeteriaId = 'c_' + Date.now();

      const newCafeteriaUser = {
        id: userId,
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@cafetin.com`,
        username: cleanInput,
        password: password,
        name: `Cafetín (${cleanInput})`,
        schoolCode: cleanSchoolCode,
        role: 'cafeteria',
        tier: 'estándar',
        avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200'
      };

      const newCafeteria = {
        id: cafeteriaId,
        ownerId: userId,
        name: `Cafetín ${cleanInput.toUpperCase()}`,
        schoolCode: cleanSchoolCode,
        location: 'Planta Principal',
        description: 'Almuerzos, desayunos, bebidas y snacks preparados al día.',
        logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200',
        isOpen: true
      };

      setUsers(prev => [...prev, newCafeteriaUser]);
      setCafeterias(prev => [...prev, newCafeteria]);
      setCurrentUser(newCafeteriaUser);

      alert(`¡Cafetín registrado oficialmente!\nUsuario: ${cleanInput}\nServidor Escolar: ${cleanSchoolCode}`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    StorageModel.remove('lm_session');
  };

  return {
    currentUser,
    setCurrentUser,
    roleType,
    setRoleType,
    schoolCode,
    setSchoolCode,
    cafeteriaLoginData,
    setCafeteriaLoginData,
    handleGoogleResponse,
    handlePasswordLogin,
    handleLogout
  };
}