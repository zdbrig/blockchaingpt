import Router from "next/router";

const GITHUB_CLIENT_ID = "97622aae5a224b9c1db7";
const BASE_URL = "http://localhost:3000";
const LoginWithGitHubButton = () => {
  const handleClick = () => {
    Router.push(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${BASE_URL}/?scope=read:user`
    );
  };

  return (
    <button type="button" onClick={handleClick}>
      Login with GitHub
    </button>
  );
};

export default LoginWithGitHubButton;
