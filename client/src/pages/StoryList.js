import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {formatDate} from '../utils.js';

export default function StoryList() {
    const [narratives, setNarratives] = useState([]);

    useEffect(() => {
        fetch('/api/story/get-stories-list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success === false) return;
                setNarratives(data.stories);
                console.log(data.stories);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, []) 

    return (
        <Container fluid className='bg-light min-vh-100 text-center books-bg books01-bg'>
            <Row className="justify-content-center">
                <Col md={8} className='mt-4'>
                    <h2 className='mb-4 text-white text-shadow'>Suas Narrativas</h2>
                    {narratives.map((narrative) => (
                        <Card key={narrative._id} className="mb-4">
                            <Card.Body>
                                <Card.Title className='fs-2 mb-4'>{narrative.title}</Card.Title>
                                <Card.Subtitle className="mb-3">
                                    <em>Gêneros:</em> {narrative.genres.join(", ")}
                                </Card.Subtitle>
                                <Card.Subtitle className="mb-3 ">
                                    <em>Ordem dos autores:</em> {narrative.authorsIDs.map(author => author.username).join(' > ')}
                                </Card.Subtitle>
                                <Card.Subtitle className="mb-3">
                                    <em>Número de Capítulos:</em> {narrative.chapterCounter}
                                </Card.Subtitle>
                                <Card.Subtitle className="mb-3">
                                    <em>Criado em:</em> {formatDate(narrative.createdAt)}
                                </Card.Subtitle>
                                {narrative.accessKey && <Card.Subtitle className="mb-3">
                                    <em>Chave de acesso:</em> {narrative.accessKey}
                                </Card.Subtitle>}
                                <Card.Subtitle className="mb-2 fs-5">
                                    {narrative.completed ? <span className='text-success'>Concluída</span> : <span className='text-warning'>Em Andamento</span>}
                                </Card.Subtitle>
                                <div>
                                    <Link to={`/narrativa/${narrative._id}`} className="d-inline-block m-2">
                                        <Button variant="secondary">Lista de Capítulos</Button>
                                    </Link>
                                    <Link to={`/narrativa/${narrative._id}/criar-capitulo`} className="d-inline-block">
                                        <Button variant="primary">Escrever novo capítulo</Button>
                                    </Link>
                                </div>

                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

