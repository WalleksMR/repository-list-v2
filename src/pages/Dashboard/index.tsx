import React, { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { Title, Form, Repositories, Error } from './style';
import api from '../../services/api';

import logo from '../../assets/github-logo.svg';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;

    avatar_url: string;
  };
}
const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState(''); // Estado que se encontra o campo da pesquisa
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem(
      '@GithubExplorer:repositories',
    );
    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }

    return [];
  }); // Estado que se encontra o repositories
  const [inputError, setInputError] = useState(''); // Tratativa de error

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  // Função para buscar na api os repositorios
  async function handleAddRepositoty(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o auto/nome do repositório');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`); // Faz uma consulta na api do Githus pesquisando oque foi digitado no campo de pesquisa que ira passa para esse NewRepo
      const repository = response.data;

      setRepositories([...repositories, repository]); // adicionando os novos dados no repositories
      setNewRepo(''); // Zerando os NewRepo que é a pesquisa.
      setInputError(''); // Zerando os erros
    } catch (err) {
      setInputError('Erro na busca por esse repositório');
    }
  }

  return (
    <>
      <img src={logo} alt="Github Explorer" />
      <Title>Explore Repositório no Github</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepositoty}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map((repository) => (
          <Link
            key={repository.full_name}
            to={`repositories/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
