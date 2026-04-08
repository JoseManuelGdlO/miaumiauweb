import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { getStoredToken, portalFetch, setStoredToken } from "@/lib/portalApi";

export type PortalCliente = {
  id: number;
  nombre_completo: string;
  telefono: string;
};

export type LoginParams =
  | { flow: "first"; telefono: string; numeroPedido: string }
  | { flow: "returning"; telefono: string; password: string };

type AuthContextType = {
  token: string | null;
  cliente: PortalCliente | null;
  isReady: boolean;
  login: (params: LoginParams) => Promise<{ mustChangePassword: boolean; cliente: PortalCliente }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [cliente, setCliente] = useState<PortalCliente | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const t = getStoredToken();
    setToken(t);
    setIsReady(true);
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    setCliente(null);
  }, []);

  const login = useCallback(async (params: LoginParams) => {
    const body =
      params.flow === "first"
        ? { telefono: params.telefono, numero_pedido: params.numeroPedido.trim() }
        : { telefono: params.telefono, password: params.password };
    const json = await portalFetch<{
      success: boolean;
      data: { token: string; mustChangePassword: boolean; cliente: PortalCliente };
    }>("/portal/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      token: null,
    });
    const { token: t, mustChangePassword, cliente: cl } = json.data;
    setStoredToken(t);
    setToken(t);
    setCliente(cl);
    return { mustChangePassword, cliente: cl };
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    const json = await portalFetch<{
      success: boolean;
      data: { token: string; cliente: PortalCliente };
    }>("/portal/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const { token: t, cliente: cl } = json.data;
    setStoredToken(t);
    setToken(t);
    setCliente(cl);
  }, []);

  const value = useMemo(
    () => ({
      token,
      cliente,
      isReady,
      login,
      changePassword,
      logout,
    }),
    [token, cliente, isReady, login, changePassword, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
