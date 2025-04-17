import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import client from './apolloClient';
import { ApolloProvider } from '@apollo/client';

const GET_USERS = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

const ADD_USER = gql`
  mutation($name: String!, $email: String!) {
    addUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const EDIT_USER = gql`
  mutation($id: ID!, $name: String, $email: String) {
    editUser(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

function Users() {
  const { loading, error, data } = useQuery(GET_USERS);
  const [addUser] = useMutation(ADD_USER);
  const [editUser] = useMutation(EDIT_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: '', email: '' });

  const handleAddUser = () => {
    addUser({
      variables: { name: 'New User', email: 'newuser@example.com' },
      refetchQueries: [{ query: GET_USERS }],
    });
  };

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setEditValues({ name: user.name, email: user.email });
  };

  const handleEditSave = (id) => {
    editUser({
      variables: { id, ...editValues },
      refetchQueries: [{ query: GET_USERS }],
    });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    deleteUser({
      variables: { id },
      refetchQueries: [{ query: GET_USERS }],
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <button
        onClick={handleAddUser}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
         Add User
      </button>
      <ul className="space-y-4">
        {data.users.map((user) => (
          <li
            key={user.id}
            className="p-4 border rounded flex justify-between items-center"
          >
            {editingId === user.id ? (
              <div className="flex-1 mr-4 space-y-2">
                <input
                  type="text"
                  className="w-full border p-1 rounded"
                  value={editValues.name}
                  onChange={(e) =>
                    setEditValues((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <input
                  type="email"
                  className="w-full border p-1 rounded"
                  value={editValues.email}
                  onChange={(e) =>
                    setEditValues((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
            ) : (
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            )}

            <div className="space-x-2">
              {editingId === user.id ? (
                <>
                  <button
                    onClick={() => handleEditSave(user.id)}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-2 py-1 bg-gray-300 text-black rounded"
                  >
                     Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEditClick(user)}
                    className="px-2 py-1 bg-yellow-400 text-black rounded"
                  >
                     Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                     Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Users />
    </ApolloProvider>
  );
}
