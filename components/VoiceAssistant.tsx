
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage, LanguageCode } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import MicrophoneIcon from './icons/MicrophoneIcon';
import SpeakerIcon from './icons/SpeakerIcon';
import { useLanguage } from '../hooks/useLanguage';

const VoiceAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();


  const handleTranscript = (transcript: string) => {
    setInput(transcript);
    handleSubmit(transcript);
  };

  const { isListening, startListening, stopListening, isSpeaking, speak, cancelSpeech, supported } = useSpeech({
    onTranscript: handleTranscript,
    lang: language,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (query?: string) => {
    const text = (typeof query === 'string' ? query : input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), text, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponseText = await getChatResponse(messages, text, language);
      const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
      setMessages((prev) => [...prev, aiMessage]);
      speak(aiResponseText);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: t('voiceAssistant.errorResponse'),
        sender: 'ai',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="flex-shrink-0 flex justify-end items-center mb-4">
        <div className="flex items-center space-x-2">
            <label htmlFor="language" className="text-sm font-medium text-gray-700">{t('voiceAssistant.language')}</label>
            <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
                <option value={LanguageCode.ENGLISH}>{t('languages.en-US')}</option>
                <option value={LanguageCode.HINDI}>{t('languages.hi-IN')}</option>
                <option value={LanguageCode.TELUGU}>{t('languages.te-IN')}</option>
                <option value={LanguageCode.MALAYALAM}>{t('languages.ml-IN')}</option>
            </select>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-inner p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">🌱</div>}
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${
                msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>
            </div>
             {msg.sender === 'ai' && messages.length - 1 === index && (
                <button
                    onClick={() => (isSpeaking ? cancelSpeech() : speak(msg.text))}
                    className={`p-2 rounded-full transition-all ${isSpeaking ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'} active:scale-90`}
                >
                    <SpeakerIcon className="w-5 h-5"/>
                </button>
            )}
          </div>
        ))}
         {isLoading && (
            <div className="flex items-end gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">🌱</div>
                <div className="p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-0"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 flex-shrink-0">
       {!supported && <div className="text-center text-sm text-red-600 mb-2">{t('voiceAssistant.unsupported')}</div>}
        <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={t('voiceAssistant.placeholder')}
            className="flex-1 p-2 border-none focus:ring-0"
            disabled={isLoading}
          />
          <button
            onClick={() => isListening ? stopListening() : startListening()}
            disabled={!supported || isLoading}
            className={`p-3 rounded-full text-white transition-all duration-200 ${
              isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'
            } disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95`}
          >
            <MicrophoneIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleSubmit()}
            disabled={isLoading || !input}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95"
          >
            {t('voiceAssistant.send')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;