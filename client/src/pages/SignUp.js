import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils.js';
import OAuth from '../components/OAuth';

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (ev) => {
        setFormData({
            ...formData,
            [ev.target.id]: ev.target.value
        })
    }

    const handleSubmit = async (ev) => {
        try {
            ev.preventDefault();
            setLoading(true);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json();
            if (data.success === false) {
                setLoading(false);
                setError(data.message);
                handleError('Erro ao cadastrar', 2000);
                return;
            }
            setLoading(false);
            setError(null);
            handleSuccess('Sucesso ao cadastrar', 2000);
            setTimeout(() => navigate('/entrar'), 2000)
        } catch (error) {
            setLoading(false);
            setError(error.message);
            handleError('Erro ao cadastrar', 2000);
        }
    }

    return (
        <Container fluid className='bg-light min-vh-100'>
            <Row className="justify-content-center">
                <Col md={6} className='mt-5'>
                    <Form onSubmit={handleSubmit} className='border p-4 rounded bg-white'>
                        <h2 className="mb-4 text-center">Registrar</h2>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome:</Form.Label>
                            <Form.Control type="text" placeholder="nome" id="username" minLength={4} maxLength={14} onChange={handleChange} />
                        </Form.Group>

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
                                {loading ? 'CARREGANDO...' : 'REGISTRAR'}
                            </Button>
                        </div>
                        <OAuth/>
                    </Form>

                    <p className="mt-3 text-center">
                        Já tem uma conta? <Link to="/entrar">Entrar</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    );
}
