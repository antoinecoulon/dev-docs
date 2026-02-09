# Next.js - React.js

## Composants réutilisables

### CustomButton.tsx

```jsx
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
    children: ReactNode
    variant?: "outlined" | "filled"
    bgColor?: "blue" | "white"
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function CustomButton({ children, variant = "outlined", bgColor = "white", ...props }: ButtonProps) {
    const baseStyles = "px-[24px] py-[8px] cursor-pointer whitespace-nowrap text-[18px] rounded-[8px] transform transition-transform duration-200 ease-in-out hover:scale-110"
    const variantStyles = 
        variant === "outlined" ? "border-2 border-white text-white" : 
        bgColor !== "white" ? "bg-[#0810ad] text-white" : "bg-white text-black"
    
    const allClasses = `${baseStyles} ${variantStyles}`.trim()

    return (
        <button 
            className={allClasses}
            {...props}
        >
            {children}
        </button>
    )
}
```

### AnimatedTerminal.tsx

```jsx
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Command, commands } from '@/data/commands';

export default function AnimatedTerminal() {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [displayedCommands, setDisplayedCommands] = useState<Command[]>([]);
  const [typingSpeed, setTypingSpeed] = useState<number>(80)

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const terminalRef = useRef<any>(null);  

  // Effet pour le curseur clignotant
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Fonction pour démarrer l'animation
  const startTyping = () => {
    if (currentCommandIndex >= commands.length) {
      return;
    }

    setIsTyping(true);
    const currentCommand = commands[currentCommandIndex];
    const commandText = currentCommand.command;

    if (currentCharIndex < commandText.length) {
      const typingTimeout = setTimeout(() => {
        setCurrentCharIndex(prev => prev + 1);
      }, typingSpeed); // Vitesse de frappe variable

      return () => clearTimeout(typingTimeout);
    } else {
      // Commande terminée, ajouter la sortie
      setTimeout(() => {
        setDisplayedCommands(prev => [...prev,
          {
            command: commandText,
            output: currentCommand.output,
            completed: true
          }
        ]);
        
        setCurrentCommandIndex(prev => prev + 1);
        setCurrentCharIndex(0);
        setIsTyping(false);
      }, currentCommand.delay);
    }
  };

  // Effet principal pour l'animation
  useEffect(() => {
    const timeout = setTimeout(startTyping, 100);
    return () => clearTimeout(timeout);
  }, [currentCommandIndex, currentCharIndex]);

  // Fonction pour redémarrer l'animation
  const restartAnimation = () => {
    setCurrentCommandIndex(0);
    setCurrentCharIndex(0);
    setDisplayedCommands([]);
    setIsTyping(false);
  };

  // Random typing speed côté client pour éviter les erreurs SSR
  useEffect(() => {
    setTypingSpeed(50 + Math.random() * 50)
  }, [currentCharIndex])

  // Auto-scroll vers le bas
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedCommands, currentCharIndex]);

  const getCurrentCommand = () => {
    if (currentCommandIndex >= commands.length) return '';
    return commands[currentCommandIndex].command.substring(0, currentCharIndex);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl overflow-hidden">
      {/* Barre de titre du terminal */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-gray-300 text-sm font-medium">
          Terminal — bash — 80×24
        </div>
        <button
          onClick={restartAnimation}
          className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
        >
          ↻ Restart
        </button>
      </div>

      {/* Contenu du terminal */}
      <div
        ref={terminalRef}
        className="bg-gray-900 text-green-400 font-mono text-sm p-4 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        {/* Message d'accueil */}
        <div className="mb-4 text-gray-500">
          <div>Last login: {new Date().toLocaleString()}</div>
          <div>Welcome to Ubuntu 22.04.3 LTS</div>
          <div className="mb-2">developer@portfolio:~$</div>
        </div>

        {/* Commandes terminées */}
        {displayedCommands.map((cmd, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-400 mr-2">developer@portfolio:~$</span>
              <span className="text-white">{cmd.command}</span>
            </div>
            {cmd.output.map((line, lineIndex) => (
              <div key={lineIndex} className="ml-4 text-gray-300">
                {line}
              </div>
            ))}
          </div>
        ))}

        {/* Commande en cours de frappe */}
        {currentCommandIndex < commands.length && (
          <div className="flex items-center">
            <span className="text-blue-400 mr-2">developer@portfolio:~$</span>
            <span className="text-white">{getCurrentCommand()}</span>
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
              ▊
            </span>
          </div>
        )}

        {/* Message de fin */}
        {currentCommandIndex >= commands.length && (
          <div className="mt-4 text-gray-500">
            <div>🚀 Projet Next.js initialisé avec succès!</div>
            <div className="flex items-center mt-2">
              <span className="text-blue-400 mr-2">developer@portfolio:~$</span>
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
                ▊
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Barre de statut */}
      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 flex justify-between items-center">
        <div>
          {isTyping ? 'Typing...' : 'Ready'} | 
          Command {Math.min(currentCommandIndex + 1, commands.length)}/{commands.length}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span>Online</span>
          </div>
          <div>UTF-8</div>
        </div>
      </div>
    </div>
  );
};
```

### TerminalUI.tsx

```jsx
interface TerminalProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function TerminalUI({ title = "Terminal", children, className = "" }: TerminalProps) {
  return (
    <div className={`bg-bg-secondary border border-border-primary rounded-lg overflow-hidden ${className}`}>
      {/* Header avec contrôles */}
      <div className="bg-bg-tertiary px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-status-error rounded-full"></div>
            <div className="w-3 h-3 bg-status-warning rounded-full"></div>
            <div className="w-3 h-3 bg-status-success rounded-full"></div>
          </div>
          <span className="text-text-secondary font-bold font-mono ml-2">{title}</span>
        </div>
      </div>
      
      {/* Contenu */}
      <div className="p-4 font-mono text-sm">
        {children}
      </div>
    </div>
  );
}
```

## Utilitaires

### Load JSON

```jsx
// src/utils/loadStaticJSON.ts
export async function loadStaticJSON<T>(fileName: string): Promise<T> {
  const res = await fetch(`/data/${fileName}`)
  console.log('loadStaticJSON')
  if (!res.ok) throw new Error(`Erreur lors du chargement de ${fileName}`)
  return res.json()
}
```
