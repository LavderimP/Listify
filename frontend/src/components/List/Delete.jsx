function Delete(index, csrftoken, accessToken) {
  const url = `http://127.0.0.1:8000/list/${index}/`;

  return fetch(url, {
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
      throw new Error("Failed to delete the list"); // Handle other response statuses
    })
    .catch((error) => {
      console.log("Error:", error);
      throw error; // Propagate error so we can handle it in the calling function
    });
}

export default Delete;
