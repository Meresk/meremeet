import { useParams, Link } from 'react-router-dom';

function RoomPage() {
    const { roomId } = useParams();

    return (
        <div style={{ padding: '20px' }}>
            <h1>Комната</h1>
            <p>ID комнаты: {roomId}</p>
            <Link to="/">← На главную</Link>
            
            {/* Здесь будет контент комнаты */}
        </div>
    );
}

export default RoomPage;