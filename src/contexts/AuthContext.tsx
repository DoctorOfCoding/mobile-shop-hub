import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AppRole = 'admin' | 'user';

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: AppRole | null;
  isAdmin: boolean;
  isEmployee: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, username: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  logActivity: (actionType: string, description: string, itemId?: string, itemType?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  let inactivityTimer: ReturnType<typeof setTimeout>;

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (session) {
      inactivityTimer = setTimeout(async () => {
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity.",
          variant: "destructive",
        });
        await signOut();
      }, INACTIVITY_TIMEOUT);
    }
  }, [session]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, [resetInactivityTimer]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile;
  };

  const fetchRole = async (userId: string): Promise<AppRole | null> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching role:', error);
      return null;
    }
    return data?.role as AppRole || null;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Defer Supabase calls with setTimeout to prevent deadlock
          setTimeout(async () => {
            const [profileData, roleData] = await Promise.all([
              fetchProfile(session.user.id),
              fetchRole(session.user.id)
            ]);
            setProfile(profileData);
            setRole(roleData);
            setLoading(false);

            // Log login activity
            if (event === 'SIGNED_IN' && profileData) {
              await logActivityInternal(
                session.user.id,
                profileData.username,
                roleData || 'user',
                'LOGIN',
                `User ${profileData.username} logged in`
              );
            }
          }, 0);
        } else {
          setProfile(null);
          setRole(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        Promise.all([
          fetchProfile(session.user.id),
          fetchRole(session.user.id)
        ]).then(([profileData, roleData]) => {
          setProfile(profileData);
          setRole(roleData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logActivityInternal = async (
    userId: string,
    username: string,
    userRole: string,
    actionType: string,
    description: string,
    itemId?: string,
    itemType?: string
  ) => {
    try {
      await supabase.from('activity_logs').insert([{
        user_id: userId,
        username,
        role: userRole,
        action_type: actionType,
        description,
        item_id: itemId || null,
        item_type: itemType || null,
      }]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const logActivity = async (
    actionType: string,
    description: string,
    itemId?: string,
    itemType?: string
  ) => {
    if (!user || !profile || !role) return;
    await logActivityInternal(user.id, profile.username, role, actionType, description, itemId, itemType);
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error };
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string, username: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username,
          full_name: fullName || '',
        },
      },
    });

    if (error) {
      return { error };
    }
    return { error: null };
  };

  const signOut = async () => {
    if (user && profile && role) {
      await logActivityInternal(
        user.id,
        profile.username,
        role,
        'LOGOUT',
        `User ${profile.username} logged out`
      );
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        isAdmin: role === 'admin',
        isEmployee: role === 'user',
        loading,
        signIn,
        signUp,
        signOut,
        logActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
