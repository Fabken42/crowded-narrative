import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { handleError, handleSuccess, intToRoman } from '../utils.js';

export default function CreateChapter() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { storyId } = useParams();

  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [narrative, setNarrative] = useState();

  const handleInputChange = (e) => {
    const content = e.target.value;
    setChapterContent(content);
    setCharCount(content.length);
  };

  const handleSubmit = async (e, finishNarrative) => {
    console.log(`valor de finish narrative: ${finishNarrative}`);
    e.preventDefault();

    if (isSubmitting) return;

    if (!(charCount >= 200 && charCount <= 2000)) {
      handleError('O conteúdo do capítulo deve ter entre 200 e 2000 caracteres!', 2000);
      return;
    }

    const message = finishNarrative ? 'Este será o último capítulo na narrativa. Deseja continuar?' : 'Você não será capaz de realizar modificações futuras. Deseja continuar?';

    if (window.confirm(message)) {
      setIsSubmitting(true);

      try {
        const res = await fetch(`/api/story/${storyId}/create-chapter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ finishNarrative, chapterTitle, chapterContent, userId: currentUser._id, storyCounter: narrative.chapterCounter, storyId })
        });

        if (res.ok) {
          handleSuccess('Capítulo criado com sucesso!', 2000);
          setTimeout(() => navigate(`/narrativa/${narrative._id}`), 2000);
          return;
        }
        handleError('Erro ao criar capítulo!', 2000);
      } catch (error) {
        console.log(error);
        handleError('Erro ao criar capítulo!', 2000);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSkipTurn = (e) => {
    e.preventDefault();

    if (window.confirm('Tem certeza que deseja pular seu turno?'))
      fetch(`/api/story/${storyId}/skip-turn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id, storyId })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success === false) {
            handleError('Erro ao pular turno!', 2000);
            return;
          }
          handleSuccess('Você passou sua vez!', 2000);
          setTimeout(() => navigate(`/narrativa/${narrative._id}`), 2000);
        })
        .catch((error) => {
          console.log(error.message);
          handleError('Erro ao pular turno!', 2000);
        });
  };

  useEffect(() => {
    fetch(`/api/story/${storyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) return;
        setNarrative(data.story);
        console.log(data.story);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [])

  if (narrative) {
    return (
      <Container fluid className='bg-light min-vh-100 text-center books-bg books05-bg'>
        <Row className="justify-content-center">
          <Col md={8} className='mt-4'>
            <h2 className="mb-4">{narrative.title} - capítulo {intToRoman(narrative.chapterCounter + 1)}</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formChapterName" className='mb-4'>
                <Form.Label className='fs-5'>Título (5 - 40 caracteres): </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o título do capítulo..."
                  minLength={5}
                  maxLength={40}
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formChapterContent" className='mb-4'>
                <Form.Label className='fs-5'>Conteúdo (200 - 2000 caracteres): </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  maxLength={2000}
                  placeholder="Escreva seu capítulo aqui..."
                  value={chapterContent}
                  onChange={handleInputChange}
                />
                <p className='mt-2'>Caracteres digitados: {charCount}</p>
              </Form.Group>
              <div>
                <Button className='mx-3' variant="success" type="submit" disabled={isSubmitting} onClick={(ev) => handleSubmit(ev, false)}>
                  Enviar capítulo
                </Button>
                <Button className='mx-3' variant="primary" type="submit" disabled={isSubmitting} onClick={(ev) => handleSubmit(ev, true)}>
                  Enviar e encerrar história
                </Button>
                <Button className='mx-3' variant="danger" type="button" disabled={isSubmitting} onClick={handleSkipTurn}>
                  Passar minha vez
                </Button>
              </div>
            </Form>
            <Button className='btn btn-secondary m-4' onClick={() => navigate('/lista-de-narrativas')}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
          </Col>
        </Row>
      </Container >
    );
  }
}