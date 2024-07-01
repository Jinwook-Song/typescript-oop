{
  function getUser() {
    return {
      id: 1,
      name: 'Alice',
      age: 30,
    };
  }

  type UserType = ReturnType<typeof getUser>;

  const user: UserType = {
    id: 1,
    name: 'Alice',
    age: 30,
  };
}
