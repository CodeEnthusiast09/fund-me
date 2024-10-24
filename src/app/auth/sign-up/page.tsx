"use client";
import Link from "next/link";

export default function SignUp() {
  return (
    <div>
      <h1>Sign Up</h1>
      <p>
        already have an account? <Link href={"/auth/login"}> Login</Link>
      </p>
    </div>
  );
}
