import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { formatDate } from '../utils.js';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { handleError, handleSuccess } from '../utils.js';

const ParticiparNarrativa = () => {
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [publicStoriesList, setPublicStoriesList] = useState([]);
  const [chaveAcesso, setChaveAcesso] = useState('');

  console.log(publicStoriesList);

  const handleEnterStoryAccessKey = async (event) => {
    event.preventDefault();

    try {
      await fetch(`/api/story/enter-access-key`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser._id,
          accessKey: chaveAcesso
        })
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.success === false) {
            handleError('Erro ao entrar na narrativa!', 2000);
            return;
          }

          handleSuccess('Você entrou na narrativa!', 2000);
          setTimeout(() => navigate('/lista-de-narrativas'), 2000);
        })
    } catch (error) {
      handleError('Erro ao entrar na narrativa!', 2000);
      console.log(error.message);
    }
  };

  const handleEnterStoryPublic = async (storyId) => {
    try {
      await fetch(`/api/story/${storyId}/enter-public`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser._id
        })
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.success === false) {
            handleError('Erro ao entrar na narrativa!', 2000);
            return;
          }

          handleSuccess('Você entrou na narrativa!', 2000);
          setTimeout(() => navigate('/lista-de-narrativas'), 2000);
        })
    } catch (error) {
      handleError('Erro ao entrar na narrativa!', 2000);
      console.log(error.message);
    }
  };

  useEffect(() => {
    try {
      fetch('/api/story/get-public-stories')
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setLoading(false);
          if (data.success === false) return;
          setPublicStoriesList(data);
        })
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }

  }, [])

  if (loading) return <div>Carregando...</div>

  return (
    <Container fluid className='bg-light min-vh-100 py-3 text-center'>
      <Row className="justify-content-center">
        <Col md={6} xs={10}>
          <h2 className='mt-4'>Participar de uma Narrativa</h2>
          <Form onSubmit={handleEnterStoryAccessKey} className="mt-4">
            <Form.Group controlId="formChaveAcesso">
              <Form.Control
                type="text"
                placeholder="Digite a chave de acesso..."
                value={chaveAcesso}
                onChange={(e) => setChaveAcesso(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Entrar por Chave de Acesso
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="mt-4 mx-3">
        <Col md={12}>
          <h3 className='border-top pt-4 pb-3'>Narrativas públicas</h3>
        </Col>
        {publicStoriesList?.stories?.map((story, index) => (
          <Col key={index} sm={6} lg={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title className="mb-3">{story.title}</Card.Title>
                <Card.Text className="mb-1"><em>Gêneros:</em> {story.genres.join(", ")}</Card.Text>
                <Card.Text className="mb-1"><em>Número de Participantes:</em> {story.authorsIDs.length}/{story.maxAuthors}</Card.Text>
                <Card.Text className="mb-1"><em>Capítulos escritos:</em> {story.chapterCounter}</Card.Text>
                <Card.Text className="mb-1"><em>Tempo para escrever capítulo:</em> {story.maxTimeLimit} minutos</Card.Text>
                <Card.Text className="mb-2"><em>Criado em:</em> {formatDate(story.createdAt)}</Card.Text>
                <div>
                  <Button variant="primary" className='m-2' onClick={() => handleEnterStoryPublic(story._id)}>Entrar</Button>
                  <Button variant="primary" className='btn btn-secondary' onClick={() => navigate(`/narrativa/${story._id}`)}>Lista de Capítulos</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ParticiparNarrativa;