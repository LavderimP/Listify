import React, { useState, useEffect } from "react";
import Token from "./Token";

function Headers({ method, token }) {
  const [csrfToken, setCsrfToken] = useState(null); // State to hold the CSRF token
  const [methodToUse, setMethod] = useState(null);

  // Get CSRF Token for Cross-Site Request Forgery
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  useEffect(() => {
    const cookie = getCookie("csrftoken"); // Retrieve the CSRF token
    setCsrfToken(cookie); // Store the CSRF token in the state
    setMethod(method);
  }, [method]); // Empty dependency array ensures this runs only once after the first render

  // You can use csrfToken wherever you need it in your component
  return (
    <>
      <div>Method: {method}</div>
      <div>
        Headers:{" "}
        <pre>
          {JSON.stringify(
            {
              "Content-type": "application/json",
              "X-CSRFToken": csrfToken,
              Authorization: "Bearer tokenhere",
            },
            null,
            2
          )}
        </pre>
        Token:
        <Token />
      </div>
    </>
  );
}

export default Headers;
