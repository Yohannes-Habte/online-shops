// ===============================================================
// Validate Email
// ===============================================================
export const validEmail = (email) => {
  const emailRegex = email.match(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  return emailRegex;
};

// ===============================================================
// Validate password
// ===============================================================
export const validPassword = (password) => {
  const passwordRegex = password.match(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  );
  return passwordRegex;
};

export const validDate = (date) => {
  const dateRegex = date.matches(
    /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/
  );
  return dateRegex;
};
