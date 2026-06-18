import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { setAuthToken } from '../services/api';

const TEST_OTP = '123456';
const TEST_MODE = true;

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setAuthToken(session.access_token);
      set({ user: session.user, session, loading: false });
    } else {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuthToken(session.access_token);
        set({ user: session.user, session });
      } else {
        setAuthToken(null);
        set({ user: null, session: null });
      }
    });
  },

  sendOtp: async (phone) => {
    if (TEST_MODE) return;
    const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phone}` });
    if (error) throw error;
  },

  verifyOtp: async (phone, otp) => {
    if (TEST_MODE) {
      if (otp === TEST_OTP) {
        setAuthToken('test-token');
        set({
          user: { id: '00000000-0000-0000-0000-000000000001', phone: `+91${phone}`, email: '' },
          session: { access_token: 'test-token' },
        });
        return;
      }
      throw new Error('Wrong OTP. Test OTP: 123456');
    }

    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token: otp,
      type: 'sms',
    });
    if (error) throw error;
    if (data.session) {
      setAuthToken(data.session.access_token);
      set({ user: data.user, session: data.session });
    }
  },

  loginDemo: () => {
    setAuthToken('demo-token');
    set({ user: { id: 'demo', email: 'demo@hisably.in' }, session: { access_token: 'demo-token' } });
  },

  logout: async () => {
    await supabase.auth.signOut();
    setAuthToken(null);
    set({ user: null, session: null });
  },
}));
