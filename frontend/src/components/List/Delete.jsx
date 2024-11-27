function Delete(index, csrftoken, accessToken) {
  const url = `http://127.0.0.1:8000/list/${index}/`;

  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
      Authorization: `Bearer ${accessToken}`, // Add the Authorization header
    },
  })
    .then((response) => {
      if (response.status === 204) {
        console.log(`List ${index} deleted successfully!`);
        return null; // No content to parse as JSON
      }
      return response.json(); // Handle other response statuses
    })
    .then((data) => {
      if (data) {
        console.log("Data:", data);
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

export default Delete;
