import Router from "next/router";
import axios from "axios";
import React, { useEffect } from 'react';


const GITHUB_CLIENT_ID = "97622aae5a224b9c1db7";
const BASE_URL = "http://localhost:3000";

const LoginWithGitHubButton = () => {
  const handleClick = async () => {
    try {
      // Redirect user to GitHub OAuth authorization endpoint
      const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${BASE_URL}/`;
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
    }
  };

  const handleRedirect = async (code) => {
    try {
      // Send request to server to exchange code for access token
      const response = await axios.post("http://localhost:3001/auth/github", {
        code,
        redirect_uri: `${BASE_URL}/`,
      });
      const accessToken = response.data.access_token;

      // Store access token in local storage
      localStorage.setItem("token", accessToken);
    } catch (error) {
      console.error(error);
    }
  };

  // Check if there is a code in the URL query string
  useEffect(() => {
    const { query } = Router;
    if (query.code) {
      handleRedirect(query.code);
    }
  });
  return (
    <button type="button" onClick={handleClick}>
      Login with GitHub
    </button>
  );
};

export default LoginWithGitHubButton;
