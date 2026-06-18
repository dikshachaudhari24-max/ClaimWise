import { create } from 'zustand';
import { api, setAuthToken } from '../services/api';

const TEST_OTP = '123456';
const TEST_MODE = false;

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: false,

  sendOtp: async (phone) => {
    if (TEST_MODE) return;
    await api.sendOtp(phone);
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

    const result = await api.verifyOtp(phone, otp);
    setAuthToken(result.token);
    set({
      user: { id: result.user_id, phone: result.phone },
      session: { access_token: result.token },
    });
  },

  loginDemo: () => {
    setAuthToken('demo-token');
    set({ user: { id: 'demo', email: 'demo@hisably.in' }, session: { access_token: 'demo-token' } });
  },

  logout: async () => {
    setAuthToken(null);
    set({ user: null, session: null });
  },
}));
