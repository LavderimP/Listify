import React from "react";

function Detail({ id }) {
  if (!id) {
    return <div>No id</div>;
  } else {
    return <div>Id: {id}</div>;
  }
}

export default Detail;
