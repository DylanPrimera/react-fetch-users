import { useEffect, useMemo, useRef, useState } from "react";
import { UsersList } from "./components/UsersList";
import "./App.css";
import { SortBy, User } from "./types.d";
import { useQuery } from "@tanstack/react-query";

const API_URL = "https://randomuser.me/api/?results=10&seed=dyldev";

const fetchUsers = async (page: number) => {
  return fetch(API_URL.concat(`&page=${page}`))
    .then(async (res) => await res.json())
    .then((res) => res.results);
};

function App() {
  useQuery({
    queryKey: ["users"],
    queryFn: async () => await fetchUsers(1),
  });
  const [users, setUsers] = useState<User[]>([]);
  const [coloredTable, setColoredTable] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);

  const originalUsers = useRef<User[]>([]);

  const toggleColors = () => setColoredTable(!coloredTable);
  const toggleSortByCountry = () => {
    const sortValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(sortValue);
  };

  const handleDelete = (uuid: string) => {
    const filteredUsers = users.filter((user) => user.login.uuid !== uuid);
    setUsers(filteredUsers);
  };

  const handleReset = () => setUsers(originalUsers.current);

  const handleChangeSorting = (sort: SortBy) => setSorting(sort);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchUsers(currentPage)
      .then((data: User[]) => {
        setUsers((prevUsers) => {
          const newUsers = prevUsers.concat(data);
          originalUsers.current = newUsers;
          return newUsers;
        });
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [currentPage]);

  const filteredUsers = useMemo(() => {
    return filterCountry !== null && filterCountry.length > 0
      ? users.filter((user) =>
          user.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase())
        )
      : users;
  }, [users, filterCountry]);

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers;
    if (sorting === SortBy.NAME)
      return filteredUsers.toSorted((a, b) =>
        a.name.first.localeCompare(b.name.first)
      );
    if (sorting === SortBy.LAST)
      return filteredUsers.toSorted((a, b) =>
        a.name.last.localeCompare(b.name.last)
      );
    if (sorting === SortBy.COUNTRY)
      return filteredUsers.toSorted((a, b) =>
        a.location.country.localeCompare(b.location.country)
      );

    return filteredUsers;
  }, [filteredUsers, sorting]);

  return (
    <div className="App">
      <header>
        <button onClick={toggleColors}>Paint rows</button>
        <button onClick={toggleSortByCountry}>
          {sorting === SortBy.COUNTRY ? "Clear order" : "Order by country"}
        </button>
        <button onClick={handleReset}>Reset state</button>
        <input
          type="text"
          placeholder="Search users by country"
          onChange={(e) => setFilterCountry(e.target.value)}
        />
      </header>
      <main>
        {users.length > 0 && (
          <UsersList
            users={sortedUsers}
            coloredTable={coloredTable}
            deleteUser={handleDelete}
            changeSorting={handleChangeSorting}
          />
        )}
        {loading && <h1>Loading...</h1>}
        {!loading && error && <h1>Error</h1>}
        {!loading && !error && users.length === 0 && <h1>No users found</h1>}

        {!loading && !error && (
          <button onClick={() => setCurrentPage(currentPage + 1)}>
            Load more data
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
