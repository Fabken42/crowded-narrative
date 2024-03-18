import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import genresData from '../components/genres.json';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleError, handleSuccess } from '../utils.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { updateStoryStart, updateStorySuccess, updateStoryFailure } from '../redux/story/storySlice.js';

export default function CreateStory() {
    const maxAuthorsOptions = [1, 2, 3, 4, 5];
    const maxTimeLimitOptions = Array.from({ length: 12 }, (_, index) => (index * 10) + 10);

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.story);
    const [showModal, setShowModal] = useState(false);
    const [accessKey, setAccessKey] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [formData, setFormData] = useState({
        maxAuthors: '1',
        maxTimeLimit: '10',
        entranceType: 'public',
    });

    const handleGenerateKey = async () => {
        try {
            if (accessKey === '') {
                const res = await fetch('/api/story/generate-access-key', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();

                if (data.success === false) return;
                setAccessKey(data.accessKey);
            }
            setShowModal(true);

        } catch (error) {
            console.log(error.message);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleChange = (ev) => {
        setFormData({
            ...formData,
            [ev.target.id]: ev.target.value
        });

        if (ev.target.id === 'entranceType' && ev.target.value === 'public') setAccessKey('');
        if (ev.target.id === 'entranceType' && ev.target.value === 'accessKeyOnly') handleGenerateKey();
    }

    const handleCheckboxChange = (genre) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter((selectedGenre) => selectedGenre !== genre));
        } else {
            if (selectedGenres.length < 3) {
                setSelectedGenres([...selectedGenres, genre]);
            }
        }
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        try {
            if (selectedGenres.length === 0) {
                handleError('Escolha pelo menos 1 gênero!', 2000);
                return;
            }

            if (window.confirm('Você realmente deseja continuar? Não será possível fazer modificações no futuro.') === false)
                return;

            dispatch(updateStoryStart());

            const res = await fetch('/api/story/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    genres: selectedGenres,
                    accessKey
                }),
            });

            setFormData({...formData, entranceType: 'public' });
            setAccessKey('');

            const data = await res.json();
            if (data.success === false) {
                handleError('Erro ao criar história!', 2000);
                dispatch(updateStoryFailure(data.message));
                return;
            }

            handleSuccess('Narrativa criada com sucesso!', 2000);
            dispatch(updateStorySuccess());
        } catch (error) {
            handleError('Erro ao criar história!', 2000);
            dispatch(updateStoryFailure(error.message));
        }
    }

    return (
        <Container fluid className='bg-light min-vh-100 books-bg books02-bg'>
            <Row className="justify-content-center">
                <Col md={6} className='mt-5'>
                    <Form onSubmit={handleSubmit} className='border p-4 rounded bg-white'>
                        <h2 className="mb-4 text-center">
                            Criar Narrativa <FontAwesomeIcon icon="fa-solid fa-book" />
                        </h2>
                        <Form.Group className="mb-3" controlId="title">
                            <Form.Label>Título (5 - 40 caracteres):</Form.Label>
                            <Form.Control type="text" placeholder="título" id="title" required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Gêneros (até 3 opções):</Form.Label>
                            {genresData.map((genre) => (
                                <Form.Check
                                    key={genre}
                                    type="checkbox"
                                    label={genre}
                                    id={genre}
                                    checked={selectedGenres.includes(genre)}
                                    onChange={() => handleCheckboxChange(genre)}
                                />
                            ))}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="maxAuthors">
                            <Form.Label>Número máximo de autores:</Form.Label>
                            <Form.Control as="select" id="maxAuthors" onChange={handleChange} >
                                {maxAuthorsOptions.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId='maxTimeLimit'>
                            <Form.Label>Tempo máximo (em minutos) para cada participante escrever um capítulo:</Form.Label>
                            <Form.Control as="select" id="maxTimeLimit" onChange={handleChange}>
                                {maxTimeLimitOptions.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId='entranceType'>
                            <Form.Label>Entrada de Participantes:</Form.Label>
                            <Form.Check
                                type="radio"
                                label="Público"
                                id="entranceType"
                                name="entranceType"
                                value="public"
                                checked={formData.entranceType === 'public'}
                                onChange={handleChange}
                            />

                            <Form.Check
                                type="radio"
                                label="Somente por chave de acesso"
                                id="entranceType"
                                name="entranceType"
                                value="accessKeyOnly"
                                checked={formData.entranceType === 'accessKeyOnly'}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Modal show={showModal} onHide={handleCloseModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Chave de Acesso</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>{accessKey}</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <CopyToClipboard text={accessKey}>
                                    <Button variant="primary">
                                        <span title="Copiar para área de transferência">
                                            <FontAwesomeIcon icon="fa-solid fa-copy" />
                                        </span>
                                    </Button>
                                </CopyToClipboard>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Fechar
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <div className="d-grid gap-2">
                            <Button disabled={loading} variant="primary" type="submit">
                                {loading ? 'CARREGANDO...' : 'CRIAR'}
                            </Button>
                        </div>
                    </Form>

                </Col>
            </Row >
        </Container >
    )
}