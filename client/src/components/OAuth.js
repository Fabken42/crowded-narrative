import { Button } from 'react-bootstrap';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase.js';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../utils.js';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL })
            })
            const data = await res.json();
            dispatch(signInSuccess(data));
            handleSuccess('Sucesso ao entrar', 2000);
            setTimeout(() => navigate('/'), 2000)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="mt-2 d-grid gap-2">
            <Button variant="danger" type="button" onClick={handleGoogleClick}>
                CONTINUAR COM GOOGLE
            </Button>
        </div>
    )
}