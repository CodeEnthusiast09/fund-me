"use client";
import Link from "next/link";

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <p>
        dont have an account?
        <Link href={"/auth/sign-up"}>sign up</Link>
      </p>
    </div>
  );
}
