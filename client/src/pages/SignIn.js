import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils.js';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.js';

export default function SignIn() {
    const [formData, setFormData] = useState({});
    const { loading } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (ev) => {
        setFormData({
            ...formData,
            [ev.target.id]: ev.target.value
        })
    }

    const handleSubmit = async (ev) => {
        try {
            ev.preventDefault();
            dispatch(signInStart());
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data.message))
                handleError('Erro ao entrar', 2000);
                return;
            }
            dispatch(signInSuccess(data))
            handleSuccess('Sucesso ao entrar', 2000);
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            dispatch(error.message);
            handleError('Erro ao entrar', 2000);
        }
    }

    return (
        <Container fluid className='bg-light min-vh-100'>
            <Row className="justify-content-center">
                <Col md={6} className='mt-5'>
                    <Form onSubmit={handleSubmit} className='border p-4 rounded bg-white'>
                        <h2 className="mb-4 text-center">Entrar</h2>
                        <Form.Group className="mb-3">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" placeholder="email" id="email" onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Senha:</Form.Label>
                            <Form.Control type="password" placeholder="senha" id="password" minLength={6} maxLength={24} onChange={handleChange} />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button disabled={loading} variant="primary" type="submit">
                                {loading ? 'CARREGANDO...' : 'ENTRAR'}
                            </Button>
                        </div>
                        <OAuth/>
                    </Form>
                    <p className="mt-3 text-center">
                        Não tem uma conta? <Link to="/registrar">Criar</Link>
                    </p>  

                </Col>
            </Row>
        </Container>
    );
}
