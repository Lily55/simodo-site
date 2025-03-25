"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ModelSelector } from "../components/MathModels/ModelSelector";

export function ExamplesContent() {
  const t = useTranslations('examples');
  
  return (
    <>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      
      <ModelSelector />
      
      <style jsx>{`
        h1 {
          margin-bottom: 20px;
          color: #333;
        }
        
        p {
          margin-bottom: 30px;
          font-size: 16px;
          line-height: 1.5;
          color: #666;
        }
      `}</style>
    </>
  );
} 