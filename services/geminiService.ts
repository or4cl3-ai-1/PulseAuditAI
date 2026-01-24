
import { GoogleGenAI, Type } from "@google/genai";
import { ComplianceAudit, Finding } from "../types";
import { REGULATORY_CONTEXT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const auditDocument = async (
  content: string, 
  framework: string,
  fileName: string,
  groupId?: string,
  version: number = 1
): Promise<ComplianceAudit> => {
  const model = "gemini-3-flash-preview";
  
  // Simulated RAG: Inject relevant regulatory context derived from our "embeddings corpus"
  const domainContext = REGULATORY_CONTEXT[framework as keyof typeof REGULATORY_CONTEXT] || "";

  const systemInstruction = `
    You are a world-class legal and compliance auditor specializing in ${framework}.
    
    REFERENCE REGULATORY CONTEXT (Domain-Specific Embeddings):
    ${domainContext}

    Analyze the provided document text for compliance issues relative to these specific points.
    Be thorough, objective, and provide actionable recommendations.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: `Analyze this document for ${framework} compliance: \n\n ${content.substring(0, 30000)}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Compliance score from 0-100" },
          summary: { type: Type.STRING, description: "Executive summary of findings" },
          riskAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.NUMBER }
              },
              required: ["label", "value"]
            }
          },
          findings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                severity: { type: Type.STRING, description: "high, medium, or low" },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                recommendation: { type: Type.STRING }
              },
              required: ["severity", "category", "description", "recommendation"]
            }
          }
        },
        required: ["score", "summary", "findings", "riskAnalysis"]
      }
    }
  });

  const rawResult = JSON.parse(response.text);

  return {
    id: Math.random().toString(36).substr(2, 9),
    groupId: groupId || Math.random().toString(36).substr(2, 9),
    version: version,
    userId: 'current-user',
    fileName,
    fileType: 'document',
    framework: framework as any,
    timestamp: new Date(),
    score: rawResult.score,
    summary: rawResult.summary,
    findings: rawResult.findings,
    riskAnalysis: rawResult.riskAnalysis
  };
};

export const chatWithAuditor = async (
  auditContext: ComplianceAudit,
  userMessage: string,
  history: { role: 'user' | 'assistant', content: string }[]
): Promise<string> => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are an expert compliance officer. You have already audited a document for ${auditContext.framework}. 
      Score: ${auditContext.score}/100.
      Summary: ${auditContext.summary}
      Findings count: ${auditContext.findings.length}.
      Answer the user's questions about this specific audit based on these results. Be helpful and professional.`
    }
  });

  const response = await chat.sendMessage({ message: userMessage });
  return response.text || "I'm sorry, I couldn't process that request.";
};
