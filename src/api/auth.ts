import { AXIOS_INSTANCE } from "./_interceptor/_axios";

export const appLogin = async (email: string, password: string) => {
  return AXIOS_INSTANCE.post("/auth/email-login", { email, password });
};

export const appSignup = async (email: string, name: string, password: string) => {
  return AXIOS_INSTANCE.post("/auth/email-signup", { email, name, password });
};

export const appGoogleLogin = async (access_token: string) => {
  return AXIOS_INSTANCE.post("/auth/google-login", { access_token });
};
