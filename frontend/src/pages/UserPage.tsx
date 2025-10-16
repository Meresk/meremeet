import { useParams, Link } from 'react-router-dom';

function UserPage() {
    const { userId } = useParams();

    return (
        <div style={{ padding: '20px' }}>
            <h1>Страница пользователя</h1>
            <p>ID пользователя: {userId}</p>
            <Link to="/">← На главную</Link>
            
            {/* Здесь будет контент страницы пользователя */}
        </div>
    );
}

export default UserPage;