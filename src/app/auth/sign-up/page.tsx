import Image from "next/image";
import { SignUpForm } from "./_components/sign-up-form";
// import Link from "next/link";
import { Card } from "components/card";

export default function SignUp() {
  return (
    <div className="relative flex flex-col lg:flex-row items-center min-h-screen">
      {/* Mobile and Tablet background image */}
      <div className="absolute inset-0 lg:hidden">
        <Image
          alt=""
          src="/pexels-rdne-7414284.jpg"
          fill={true}
          sizes="(max-width: 1023px) 100vw, 0vw"
          priority
          quality={100}
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

      {/* Form section */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center min-h-screen bg-black/50 lg:bg-white">
        <Card className="w-full max-w-md mx-4 bg-white py-12 rounded-xl border-none">
          {/* <Link
            href="/"
            className="bg-lightGreen hover:bg-darkGreen rounded-full w-40 p-2"
          >
            ← Go Home
          </Link> */}
          <h1 className="text-2xl lg:text-3xl text-primary-100 font-semibold mt-5">
            Sign Up
          </h1>
          <SignUpForm />
        </Card>
      </div>

      {/* Desktop image section */}
      <div className="hidden lg:block relative w-1/2 h-screen">
        <Image
          alt=""
          src="/pexels-rdne-7414284.jpg"
          fill={true}
          sizes="(min-width: 1024px) 50vw, 0vw"
          priority
          quality={100}
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>
    </div>
  );
}
