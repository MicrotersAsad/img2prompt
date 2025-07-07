// // hooks/useAuth.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// async function getUserFromToken(token) {
//   try {
//     const response = await fetch('/api/auth/me', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       console.error('API Error:', response.statusText);
//       return null;
//     }

//     const data = await response.json();
    
//     if (data.success && data.user) {
//       return data.user;
//     }
    
//     return null;
//   } catch (error) {
//     console.error('Network error during token validation:', error);
//     return null;
//   }
// }

// export const useAuth = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isHydrated, setIsHydrated] = useState(false);
//   const router = useRouter();

//   const checkAuth = async () => {
//     if (!isHydrated) return;
    
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('auth-token');
      
//       if (!token) {
//         console.log('No token found, redirecting to login');
//         router.push('/auth/login');
//         return;
//       }

//       const userData = await getUserFromToken(token);
      
//       if (!userData) {
//         console.log('Invalid token, removing and redirecting');
//         localStorage.removeItem('auth-token');
//         router.push('/auth/login');
//         return;
//       }
      
//       setUser(userData);
//       console.log('Authentication successful:', userData.email);
      
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       localStorage.removeItem('auth-token');
//       router.push('/auth/login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       // Call logout API
//       await fetch('/api/auth/logout', { method: 'POST' });
      
//       // Clear localStorage
//       localStorage.removeItem('auth-token');
      
//       // Clear user state
//       setUser(null);
      
//       console.log('User logged out successfully');
//       router.push('/');
      
//     } catch (error) {
//       console.error('Logout error:', error);
//       // Even on error, clear local data
//       localStorage.removeItem('auth-token');
//       setUser(null);
//       router.push('/');
//     }
//   };

//   useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   useEffect(() => {
//     if (isHydrated) {
//       checkAuth();
//     }
//   }, [isHydrated]);

//   return { user, loading, logout };
// };

// hooks/useAuth.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

async function getUserFromToken(token) {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('API Error:', response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (data.success && data.user) {
      return data.user;
    }
    
    return null;
  } catch (error) {
    console.error('Network error during token validation:', error);
    return null;
  }
}

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Pages that require authentication
  const protectedRoutes = ['/dashboard'];
  
  // Check if current route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route));

  const checkAuth = async () => {
    if (!isHydrated) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        console.log('No token found');
        setUser(null);
        
        // Only redirect to login if user is trying to access protected route
        if (isProtectedRoute) {
          console.log('Accessing protected route without token, redirecting to login');
          router.push('/auth/login');
        }
        return;
      }

      const userData = await getUserFromToken(token);
      
      if (!userData) {
        console.log('Invalid token, removing');
        localStorage.removeItem('auth-token');
        setUser(null);
        
        // Only redirect to login if user is trying to access protected route
        if (isProtectedRoute) {
          console.log('Invalid token on protected route, redirecting to login');
          router.push('/auth/login');
        }
        return;
      }
      
      setUser(userData);
      console.log('Authentication successful:', userData.email);
      
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth-token');
      setUser(null);
      
      // Only redirect to login if user is trying to access protected route
      if (isProtectedRoute) {
        console.log('Auth check failed on protected route, redirecting to login');
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Clear localStorage
      localStorage.removeItem('auth-token');
      
      // Clear user state
      setUser(null);
      
      console.log('User logged out successfully');
      
      // Always redirect to login page after logout
      router.push('/auth/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even on error, clear local data
      localStorage.removeItem('auth-token');
      setUser(null);
      
      // Still redirect to login page
      router.push('/auth/login');
    }
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      checkAuth();
    }
  }, [isHydrated, pathname]); // Add pathname dependency to recheck on route changes

  return { user, loading, logout, isProtectedRoute };
};