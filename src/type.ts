export interface Rendas {
    id: number;
    nome_renda: string;
    valor: number;
    data_inclusao: string;
    vinculo_id?: number;
    vinculo?: ContaVinculo
}
export interface Dividas {
    id: number;
    nome_renda: string;
    valor: number;
    data_inclusao: string;
}
export interface Objetivos {
    id: number;
    nome_renda: string;
    valor: number;
    data_inclusao: string;
}

export interface ContaVinculo {
    id: number;
    id_usuario_vinculado: number;
    usuario_id: number;
    codigo_vinculado: string;
    tipo_calculo: string;
    valor: number;
    username: string;
}

export interface Usuario {
    id: number;
    nome: string;
    username: string;
    codigoRecomendacao: string;
    codigoReferencia: string;
    email: string;
    created_at:string;
    updated_at:string;
    dividas: Dividas[];
    rendas: Rendas[];
    objetivos: Objetivos[];
    contavinculo: ContaVinculo[];
}