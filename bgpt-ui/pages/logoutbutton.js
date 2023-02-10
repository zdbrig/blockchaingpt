import { useRouter } from 'next/router';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.reload();
  };

  return (
    <button type="button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
