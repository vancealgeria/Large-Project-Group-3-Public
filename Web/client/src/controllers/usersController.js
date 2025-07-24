/**************************** Login User  **********************************/
const loginUser = async (email, password) => {
  if (!email || !password) {
    throw Error("All fields are required");
  }

  const res = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw Error(data.error);
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("UserID", data.UserID);
  localStorage.setItem("firstName", data.firstName);
  localStorage.setItem("lastName", data.lastName);
  localStorage.setItem("valid", data.valid);

  return data;
};

/**************************** Register User  ********************************/
const registerUser = async (firstName, lastName, email, password, passwordConfirm) => {
  if (!firstName || !lastName || !email || !password || !passwordConfirm) {
    throw Error("All fields are required");
  }

  if (password !== passwordConfirm) {
    throw Error("Passwords do not match");
  }

  const res = await fetch('/api/users', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw Error(data.error);
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("UserID", data.UserID);
  localStorage.setItem("firstName", data.firstName);
  localStorage.setItem("lastName", data.lastName);
  localStorage.setItem("valid", data.valid);

  return data;
};

/**************************** Account Verfication Send Email ********************************/
const sendEmail = async (UserID) => {

  const res = await fetch('/api/users/email', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ UserID }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw Error(data.error);
  }

  return data;
};

/**************************** Account Verfication Check Code  ********************************/
const checkCode = async (UserID, code) => {
  if (!code) {
    throw Error("Code field is empty");
  }

  if (code.toString().length > 6) {
    throw Error("Code must be 6 digits long");
  }

  const res = await fetch('/api/users/check', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ UserID, code }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw Error(data.error);
  }

  return data;
};

/**************************** Account Recovery Send Email ********************************/
const sendRecoveryEmail = async (email) => {
  if (!email) {
    throw Error("Email field is empty");
  }

  const res = await fetch('/api/users/recoveryemail', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw Error(data.error);
  }

  localStorage.setItem("email", data.email);

  return data;
};

/**************************** Account Recovery Check Code  ********************************/
const checkRecoveryCode = async (email, code) => {
  if (!code) {
    throw Error("Code field is empty");
  }

  if (code.toString().length > 6) {
    throw Error("Code must be 6 digits long");
  }

  const res = await fetch('/api/users/recoverycheck', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw Error(data.error);
  }

  localStorage.setItem("code", data.code);
  
  return data;
};

/**************************** Account Recovery Password Update  ********************************/
const recoveryPasswordUpdate = async (email, newPassword, confirmNewPassword, code) => {
  if (!newPassword || !confirmNewPassword) {
    throw Error("All fields are required");
  }

  if (newPassword !== confirmNewPassword) {
    throw Error("Passwords do not match");
  }

  const res = await fetch('/api/users/recoverypasswordupdate', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, newPassword, code }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw Error(data.error);
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("UserID", data.UserID);
  localStorage.setItem("firstName", data.firstName);
  localStorage.setItem("lastName", data.lastName);
  localStorage.setItem("valid", data.valid);

  return data;
};

/**************************** Verify Get Email  ********************************/
const verifyGetEmail = async (UserID) => {

  const res = await fetch('/api/users/verifygetemail', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ UserID }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw Error(data.error);
  }

  return data;
};

/**************************** Verify Update Email  ********************************/
const verifyUpdateEmail = async (UserID, email) => {
  if (!email) {
    throw Error("Email field empty");
  }

  const res = await fetch('/api/users/verifyupdateemail', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ UserID, email }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw Error(data.error);
  }

  return data;
};

export { loginUser, registerUser, sendEmail, checkCode, sendRecoveryEmail, checkRecoveryCode, recoveryPasswordUpdate, verifyGetEmail, verifyUpdateEmail };
