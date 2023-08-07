import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [clientId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [message, setMessage] = useState({});
  const [userMessage, setUserMessage] = useState('');

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:4000/notifications/sse');
    eventSource.onmessage = (event) => {
      setCount(event.data)
    };
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:4000/notifications/sse/${clientId}`, { withCredentials: true });
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessage(data);
    };
  }, [clientId]);

  const sendNotification = async () => {
    const response = await fetch('http://localhost:4000/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId,
        mensaje: userMessage
      })
    });
    const responseBody = await response.json();
    console.log(responseBody);
  };
  function handleInputChange(event) {
    setUserMessage(event.target.value);
  }


  return (
    <div className="App">
      <div className="time-container">
        <h1>{count}</h1>
      </div>
      <div>
        <input type="text" value={userMessage} onChange={handleInputChange} placeholder="Escribe tu mensaje aquí" />
        <button onClick={sendNotification}>Enviar notificación</button>
        <h1>Notificación</h1>
        <p><strong>Remitente:</strong> {message.remitente}</p>
        <p><strong>Mensaje:</strong> {message.mensaje}</p>
        <p><strong>Hora:</strong> {message.hora}</p>
      </div>
    </div>
  )
}

export default App
