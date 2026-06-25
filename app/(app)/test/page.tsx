'use client';

import React, { useState, useEffect } from 'react';

export default function SseTestPage() {
    const [sessionId, setSessionId] = useState('1');
    const [token, setToken] = useState(''); // Tempat menempelkan JWT Token jika aman
    const [logs, setLogs] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!isConnected) return;

        // 1. Definisikan URL. 
        const baseUrl = `http://localhost:8080/api/session-stream/${sessionId}`;
        const urlWithToken = token ? `${baseUrl}?token=${token}` : baseUrl;

        setLogs((prev) => [...prev, `Mencoba menghubungkan ke: ${baseUrl}`]);

        // 2. Buat koneksi EventSource bawaan browser
        const eventSource = new EventSource(urlWithToken);

        eventSource.onopen = () => {
            setLogs((prev) => [...prev, '🟢 KONEKSI BERHASIL TERHUBUNG!']);
        };

        // Mendengarkan pesan tanpa nama event khusus (default message)
        eventSource.onmessage = (event) => {
            setLogs((prev) => [...prev, `📩 Pesan baru: ${event.data}`]);
        };

        // Mendengarkan event khusus "COUNTDOWN_ALERT"
        eventSource.addEventListener('COUNTDOWN_ALERT', (event) => {
            setLogs((prev) => [...prev, `⏰ ALARM COUNTDOWN: ${event.data}`]);
        });

        // Mendengarkan event khusus "ACTIVITY_COMPLETED" yang sudah diperbaiki tanda penutupnya
        eventSource.addEventListener('ACTIVITY_COMPLETED', (event) => {
            const completedActivity = JSON.parse(event.data);
            
            setLogs((prev) => [
                ...prev, 
                `✅ AKTIVITAS SELESAI: [${completedActivity.activityId}] - ${completedActivity.activityDesc}`
            ]);
        }); // <-- Tanda penutup yang sebelumnya hilang sudah ditambahkan di sini

        eventSource.onerror = (error) => {
            setLogs((prev) => [...prev, '🔴 Koneksi terputus atau ditolak oleh server.']);
            eventSource.close();
            setIsConnected(false);
        };

        // Bersihkan koneksi saat halaman ditutup atau tombol Disconnect ditekan
        return () => {
            eventSource.close();
            setLogs((prev) => [...prev, '⚪ Koneksi ditutup.']);
        };
    }, [isConnected, sessionId, token]);

    const handleClearLogs = () => {
        setLogs([]);
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>Uji Coba Koneksi Stream (SSE)</h2>
            
            <div style={{ margin: '20px 0' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Session ID:</label>
                    <input 
                        type="text" 
                        value={sessionId} 
                        onChange={(e) => setSessionId(e.target.value)} 
                        style={{ padding: '8px', width: '100%', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>JWT Token (Bearer):</label>
                    <input 
                        type="text" 
                        value={token} 
                        onChange={(e) => setToken(e.target.value)} 
                        placeholder="Tempel token di sini jika endpoint aman"
                        style={{ padding: '8px', width: '100%', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <small style={{ color: '#666' }}>*Kosongkan jika endpoint dipasang permitAll() di Spring Security</small>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setIsConnected(!isConnected)}
                        style={{
                            padding: '10px 20px', 
                            backgroundColor: isConnected ? '#d9534f' : '#5cb85c', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {isConnected ? '🔴 Putuskan Koneksi' : '🟢 Hubungkan Stream'}
                    </button>
                    
                    <button 
                        onClick={handleClearLogs}
                        style={{ padding: '10px 15px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
                    >
                        Hapus Log
                    </button>
                </div>
            </div>

            <h3>Aliran Data Log:</h3>
            <div style={{ 
                background: '#1e1e1e', 
                color: '#39ff14', 
                padding: '15px', 
                borderRadius: '6px', 
                minHeight: '250px', 
                maxHeight: '400px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '13px',
                lineHeight: '1.5'
            }}>
                {logs.length === 0 ? (
                    <span style={{ color: '#888' }}>Belum ada koneksi. Klik tombol di atas untuk memulai.</span>
                ) : (
                    logs.map((log, index) => <div key={index} style={{ marginBottom: '5px' }}>{log}</div>)
                )}
            </div>
        </div>
    );
}