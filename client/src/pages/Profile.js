import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase.js';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutStart, signOutSuccess, signOutFailure } from '../redux/user/userSlice.js';
import { handleError, handleSuccess } from '../utils.js';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { loading, currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileRef = useRef();
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState();
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success === false) {
                handleError('Erro ao atualizar conta!', 2000);
                dispatch(updateUserFailure(data.message));
                return;
            }
            handleSuccess('Sucesso ao atualizar conta!', 2000);
            dispatch(updateUserSuccess(data));
        } catch (error) {
            handleError('Erro ao atualizar conta!', 2000);
            dispatch(updateUserFailure(error.message));
        }
    }

    const handleChange = (ev) => {
        setFormData({
            ...formData,
            [ev.target.id]: ev.target.value
        });
    }

    useEffect(() => {
        if (file) handleFileUpload(file);
    }, [file])

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, avatar: downloadURL })
                );
            }
        );
    };

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (data.success === false) {
                handleError('Erro ao excluir conta!', 2000);
                dispatch(deleteUserFailure(data.message));
                return;
            }
            handleSuccess('Sucesso ao excluir conta!', 2000);
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            handleError('Erro ao excluir conta!', 2000);
            dispatch(deleteUserFailure(error.message));
        }
    }

    const handleSignout = async () => {
        try {
            dispatch(signOutStart());
            const res = await fetch('/api/auth/signout');
            const data = await res.json();
            if (data.success = false) {
                dispatch(signOutFailure(data.message));
                return;
            }
            dispatch(signOutSuccess(data));
        } catch (error) {
            dispatch(signOutFailure(error.message));
        }
    }

    return (
        <Container fluid className='bg-light min-vh-100 books-bg books03-bg'>
            <Row className="justify-content-center">
                <Col md={6} className='mt-4'>
                    <Form onSubmit={handleSubmit} className='border p-4 rounded bg-white'>
                        <h2 className="mb-4 text-center">Alterar perfil</h2>

                        <input type='file' ref={fileRef} hidden accept='image/*' onChange={(ev) => setFile(ev.target.files[0])} />
                        <div className='text-center'>
                            <img className='rounded-circle pointer--btn' src={formData.avatar || currentUser.avatar} width={'80px'} height={'80px'} onClick={() => fileRef.current.click()} />
                            <p className='mt-2'>
                                {fileUploadError ? (
                                    <span className='text-danger'>
                                        Erro ao atualizar imagem (tamanho deve ser menor que 2MB)
                                    </span>
                                ) : (filePerc > 0 && filePerc < 100) ? (
                                    <span className='text-primary'>{`Atualizando imagem ${filePerc}%`}</span>
                                ) : filePerc === 100 ? (
                                    <span className='text-success'>Imagem atualizada com sucesso!</span>
                                ) : (
                                    ''
                                )}
                            </p>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Nome:</Form.Label>
                            <Form.Control type="text" placeholder="nome" id="username" minLength={4} maxLength={14} defaultValue={currentUser.username} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" placeholder="email" id="email" defaultValue={currentUser.email} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Senha:</Form.Label>
                            <Form.Control type="password" placeholder="senha" id="password" minLength={6} maxLength={24} onChange={handleChange} />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button disabled={loading} variant="primary" type="submit">
                                {loading ? 'CARREGANDO...' : 'ATUALIZAR'}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <Row className="justify-content-center mt-3">
                <Col xs={6} md={3} className="text-start">
                    <p className="text-danger"><span className='pointer--btn' onClick={handleSignout}>Sair</span></p>
                </Col>
                <Col xs={6} md={3} className="text-end">
                    <p className="text-danger"><span className='pointer--btn' onClick={handleDeleteUser}>Deletar conta</span></p>
                </Col>
            </Row>

        </Container>
    )
}