import React from "react";

function Token({ access, refresh }) {
  return (
    <>
      Access: {access}
      <br />
      Refresh: {refresh}
    </>
  );
}

export default Token;
