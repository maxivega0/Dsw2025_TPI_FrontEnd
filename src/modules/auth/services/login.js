// import { instance } from '../../shared/api/axiosInstance';

// export const login = async (username, password) => {
//   const response = await instance.post('api/auth/login', { username, password });

//   return { data: response.data.token, user: response.data.userNormalized, error: null };
// };

// maniatura xq ahora no solo devuelve el token, sino tambien el user con role y username

import { instance } from '../../shared/api/axiosInstance';

// Función para decodificar JWT
const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error("Error decodificando JWT:", error);
    return {};
  }
};

export const login = async (username, password) => {
  try {
    const response = await instance.post('api/auth/login', { username, password });
    const token = response.data.token;
    
    // Decodificar el token para obtener role y username
    const decodedToken = decodeJWT(token);
    console.log("🔍 Token decodificado:", decodedToken);
    
    return { 
      data: token, 
      user: { 
        username: decodedToken.sub || username, // ← username del token o del form
        role: decodedToken.role || 'Customer'
      }, 
      error: null 
    };
  } catch (error) {
    return { 
      data: null, 
      user: null,
      error: error.response?.data || { message: 'Error de conexión' } 
    };
  }
};
