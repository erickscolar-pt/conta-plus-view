import { Rendas } from "./type";

export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const formatDate = (date: string): string => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString('pt-BR');
};

export function formatVinculoUsername(renda: Rendas) {
    if (renda?.vinculo && renda?.vinculo.username) {
        return renda.vinculo.username;
    }
    return '-';
}

export function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export function isValidUsername (username) {
    const regex = /^[a-zA-Z0-9_-]+$/;
    return regex.test(username);
};