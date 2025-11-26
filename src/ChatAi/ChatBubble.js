import React, { useEffect, useState, useRef } from 'react';
import './ChatBubble.scss';
import { createChatCompletion } from '../container/services/AI';

export default function ChatBubble() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const bottomRef = useRef(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;   // FIXED ❗

        const userMessage = {
            sender: 'user',
            text: input,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);

        const question = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await createChatCompletion([...messages, userMessage]);
            const aiMessage = {
                sender: 'ai',
                text: response.data.answer,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { sender: 'ai', text: '⚠️ Lỗi server, vui lòng thử lại.' },
            ]);
        }

        setIsLoading(false);
    };

    return (
        <div className='chatwrapper'>
            {/* Nút chat nổi */}
            <button className='chat-button' onClick={() => setOpen(!open)}>💬</button>

            {open && (
                <div className='chat-box'>
                    <div className='chat-header'>
                        <h4>AI Assistant</h4>
                        <button onClick={() => setOpen(false)}>✖</button>
                    </div>

                    <div className='chat-body'>
                        {messages.map((msg, i) => (
                            <div key={i} className={`msg ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}

                        {isLoading && (
                            <div className='msg ai'>Đang trả lời...</div>
                        )}

                        <div ref={bottomRef}></div>
                    </div>

                    <div className='chat-input'>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Nhập câu hỏi..."
                        />
                        <button onClick={sendMessage}>Gửi</button>
                    </div>
                </div>
            )}
        </div>
    );
}
