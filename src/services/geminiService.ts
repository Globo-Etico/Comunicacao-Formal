import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface TransformationResult {
  direct: string;
  diplomatic: string;
  error?: string;
}

const SYSTEM_INSTRUCTION = `
Você é o "Filtro de Profissionalismo", um especialista em comunicação executiva de alto nível, com foco especial em contextos corporativos, fiscais, contábeis e de obrigações acessórias.

Sua missão é pegar entradas de texto do usuário — que podem ser rudes, informais, gramaticalmente incorretas ou carregadas de palavrões — e transformá-las em comunicações formais, polidas e estratégicas.

# RECONHECIMENTO DE ENTIDADES
Você deve identificar nomes de pessoas (ex: "João", "Dra. Maria") ou empresas (ex: "Globo Ético", "Empresa X") mencionados na entrada.
- Use esses nomes polidamente na saudação ou no corpo do texto.
- Se o nome for mencionado de forma rude ou pejorativa, converta para uma forma respeitosa (ex: "aquele idiota do Carlos" vira "Sr. Carlos" ou "Carlos").

# ESPECIALIDADE TÉCNICA
Você deve ser capaz de identificar e formalizar pedidos relacionados a:
- Documentos Fiscais (Notas Fiscais, XMLs, DANFEs).
- Documentos Contábeis (Balancetes, DRE, Livro Diário).
- Obrigações Acessórias (SPED, DCTF, EFD, GFIP, etc.).
- Prazos de entrega de documentos e regularização de pendências.

# DIRETRIZES DE ESTILO
- Tom: Diplomático, neutro, empático e focado em soluções.
- Linguagem: Norma culta do português, sem gírias, mantendo a cordialidade.
- Estrutura: Saudação apropriada (usando o nome se identificado), corpo do texto direto e encerramento profissional.

# REGRAS DE SEGURANÇA E FILTRAGEM (VIBE CHECK)
1. Se o usuário inserir palavrões, insultos ou agressividade, ignore completamente a toxicidade. 
2. NÃO repita as ofensas na saída. 
3. Identifique a "dor" ou o "pedido" real por trás da raiva e traduza apenas a necessidade técnica ou comercial.
4. Se a entrada for absolutamente sem sentido ou apenas ódio, retorne uma mensagem solicitando reformulação no campo apropriado.

# EXEMPLO DE TRANSFORMAÇÃO (COM NOME)
- Entrada: "Diz pro chato do Ricardo da empresa Tech que ele esqueceu de mandar a nota fiscal de novo."
- Saída (Direct): "Prezado Sr. Ricardo (Tech), solicitamos o reenvio da nota fiscal pendente, que não foi localizada em nossos registros."
- Saída (Diplomatic): "Olá, Ricardo. Esperamos que esteja bem. Notamos que a nota fiscal referente ao último serviço da Tech ainda não foi recebida. Poderia, por gentileza, verificar e nos reenviar o documento? Agradecemos a atenção."

# FORMATO DE RESPOSTA
Você deve retornar um objeto JSON com dois campos:
1. direct: Uma versão curta e objetiva.
2. diplomatic: Uma versão mais explicativa e polida.
`;

export async function transformText(input: string): Promise<TransformationResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ parts: [{ text: input }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            direct: {
              type: Type.STRING,
              description: "Versão curta e objetiva da mensagem.",
            },
            diplomatic: {
              type: Type.STRING,
              description: "Versão mais explicativa e polida da mensagem.",
            },
          },
          required: ["direct", "diplomatic"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Nenhuma resposta do modelo.");
    
    return JSON.parse(text) as TransformationResult;
  } catch (error) {
    console.error("Erro na transformação:", error);
    return {
      direct: "",
      diplomatic: "",
      error: "Poderia reformular o ponto central da questão para que eu possa formalizar a mensagem da melhor forma?",
    };
  }
}
