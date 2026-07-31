import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  loginAdmin,
} from "../services/auth.service";

const LoginPage = () => {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      username: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const data =
          await loginAdmin(
            form
          );

        localStorage.setItem(
          "accessToken",
          data.accessToken
        );

        localStorage.setItem(
          "admin",
          JSON.stringify(
            data.admin
          )
        );

        navigate(
          "/admin/dashboard"
        );
      } catch (err) {
        setError(
          "Invalid credentials"
        );
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={
          handleSubmit
        }
        className="w-full max-w-md border rounded-xl p-8 shadow"
      >
        <h1 className="text-3xl font-bold mb-6">
          Admin Login 7230
        </h1>

        {error && (
          <p className="text-red-600 mb-4">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 mb-4"
          value={
            form.username
          }
          onChange={(e) =>
            setForm({
              ...form,
              username:
                e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 mb-4"
          value={
            form.password
          }
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded"
        >
          Login
        </button>

      </form>
    </div>
  );
};

export default LoginPage;