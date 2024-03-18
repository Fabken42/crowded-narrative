import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Navbar, Container, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

const Header = () => {
  const { currentUser } = useSelector(state => state.user)
  const [searchValue, setSearchValue] = useState('');

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('pesquisando por: ');
    console.log(searchValue);
  };

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container>
        {/* Logo/Nome do Site */}
        <Navbar.Brand as={Link} to="/">Crowded Narrative</Navbar.Brand>

        {/* Barra de Pesquisa */}
        <Form className="d-flex" onSubmit={handleSearchSubmit}>
          <FormControl
            type="text"
            placeholder="Pesquisar por título"
            className="rounded"
            value={searchValue} // Valor da caixa de pesquisa
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button variant="outline-light" type="submit">
            <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
          </Button>
        </Form>

        {/* Links na Direita (Dropdown em telas pequenas) */}
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav" className="justify-content-end">
          <Nav>
            {currentUser ? (
              <>
                <NavLink to="/entrar-em-narrativa" className="nav-link">Participar de Narrativa</NavLink>
                <NavLink to="/criar-narrativa" className="nav-link">Criar Narrativa</NavLink>
                <NavLink to="/lista-de-narrativas" className="nav-link">Suas Narrativas</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/entrar" className="nav-link">Entrar</NavLink>
                <NavLink to="/registrar" className="nav-link">Registrar</NavLink>
              </>
            )}

          </Nav>
        </Navbar.Collapse>
        {currentUser && <Link to='/perfil'><img className='rounded-circle float-right' src={currentUser.avatar} width={'40px'} height={'40px'} /></Link>}
      </Container>
    </Navbar>
  );
};

export default Header;
