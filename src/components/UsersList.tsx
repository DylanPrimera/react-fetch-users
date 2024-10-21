import { SortBy, User } from "../types.d";

interface Props {
  users: User[];
  coloredTable: boolean;
  deleteUser: (uuid: string) => void;
  changeSorting: (sort: SortBy) => void;
}

export const UsersList: React.FC<Props> = ({
  users,
  coloredTable,
  deleteUser,
  changeSorting
}) => {
  return (
    <table width="100%">
      <thead>
        <tr>
          <th>Picture</th>
          <th onClick={()=> changeSorting(SortBy.NAME)}>Name</th>
          <th onClick={() => changeSorting(SortBy.LAST)}>Lastname</th>
          <th onClick={() => changeSorting(SortBy.COUNTRY)}>Country</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user, index) => {
          const bgColor = index % 2 === 0 ? "#e9e9e973" : "#d7fdff";
          const color = coloredTable ? bgColor : "transparent";
          return (
            <tr key={user.login.uuid} style={{ backgroundColor: color }}>
              <td>
                <img
                  src={user.picture.thumbnail}
                  alt={`Picture of${user.name.first}-${user.name.last}`}
                  title={` Picture of ${user.name.first}-${user.name.last}`}
                />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button type="button" onClick={() => deleteUser(user.login.uuid)}>
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
