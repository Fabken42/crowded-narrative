import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { formatDate, intToRoman } from '../utils.js';

export default function ChapterList() {
    const navigate = useNavigate();
    const { storyId } = useParams();
    const [narrative, setNarrative] = useState();

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

    if (!narrative)//ALTERAR DEPOIS
        return (<>Carregando...</>)

    if (narrative)
        return (
            <Container fluid className='bg-light min-vh-100 text-center books-bg books04-bg'>
                <Row className='justify-content-center'>
                    <Col md={7} xs={11} className='mt-5 border p-4 rounded bg-white mx-auto'>
                        <h1 className='mb-3'>{narrative.title}</h1>
                        <div className="mb-4">
                            <p className="mb-2"><em>Gêneros:</em> {narrative.genres.join(', ')}</p>
                            <p className="mb-2"><em>Autores:</em> {narrative.authorsIDs.map(author => author.username).join(', ')}</p>
                            <p className="mb-0"><em>Data de Criação:</em> {formatDate(narrative.createdAt)}</p>
                        </div>

                        <h2 className='border-top pt-4 pb-2'>Capítulos ({narrative.chapterCounter})</h2>
                        <ul className='list-unstyled'>
                            {narrative.chapters.map((chapter, index) => (
                                <li key={index}>
                                    <Link to={`/narrativa/${storyId}/${chapter.chapterNumber}`}>
                                        <Button variant="link" className='text-decoration-none'>{intToRoman(chapter.chapterNumber)} - {chapter.title}</Button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Button className='btn btn-secondary' onClick={() => window.history.back()}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
};
