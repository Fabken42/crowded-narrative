import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { intToRoman } from '../utils.js';

function ChapterView() {
    const navigate = useNavigate();
    const { storyId, chapterNumber } = useParams();
    const [chapterData, setChapterData] = useState();
    const [loading, setLoading] = useState(true);

    const goToPreviousChapter = () => {
        try {
            if (chapterNumber === '1') return;
            navigate('/narrativa/' + storyId + '/' + (parseInt(chapterNumber) - 1));
        } catch (error) {
            console.log(error);
        }
    };

    const goToChapterList = () => {
        try {
            navigate('/narrativa/' + storyId);
        } catch (error) {
            console.log(error);
        }
    }

    const goToNextChapter = () => {
        try {
            if(parseInt(chapterNumber) === chapterData.chapterCounter) return;
            navigate('/narrativa/' + storyId + '/' + (parseInt(chapterNumber) + 1));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetch(`/api/story/${storyId}/${chapterNumber}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }) 
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setLoading(false);
                if (data.success === false) return;
                setChapterData(data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error.message);
            });
    }, [chapterNumber])

    if(loading) return <div>Carregando...</div>

    if (!chapterData) return <div>Não foi possível acessar o conteúdo</div>

    return (
        <Container fluid className='bg-light min-vh-100'>
            <Row className="justify-content-center">
                <Col md={8} xs={11} className="border mt-5 p-4 rounded bg-white mx-auto text-center">
                    <h3>{intToRoman(chapterData.chapter.chapterNumber)} - {chapterData.chapter.title}</h3>
                    <h4 className='mb-3'>Autor: {chapterData.chapter.author.username} <img className='rounded-circle float-right' src={chapterData.chapter.author.avatar} width={'30px'} height={'30px'} /></h4>
                    <p style={{ wordWrap: 'break-word' }}>{chapterData.chapter.content}</p>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={8} xs={11}>
                    <div className="d-flex flex-row justify-content-between mt-4">
                        <Button variant="primary" onClick={goToPreviousChapter} disabled={chapterNumber === '1'}>Capítulo Anterior</Button>
                        <Button variant="primary" onClick={goToChapterList}>Todos os capítulos</Button>
                        <Button variant="primary" onClick={goToNextChapter} disabled={parseInt(chapterNumber) === chapterData.chapterCounter}>Próximo Capítulo</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ChapterView;
