import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/app/auth/login/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#7B68EE]">
              <Image src="/logo.png" alt="logo" width={100} height={100} />
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#121212]">Sign in to your account</h2>
            <p className="mt-2 text-sm text-[#6E6E73]">
              Don't have an account?{" "}
              <Link href="/auth/register" className="font-medium text-[#7B68EE] hover:text-[#7B68EE]/90">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/login.png"
          width={1920}
          height={1080}
          alt="Beauty salon"
          priority
        />
        <div className="absolute inset-0 bg-[#7B68EE]/10 backdrop-blur-sm"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="mb-4 max-w-md rounded-xl bg-[#121212]/70 p-6 backdrop-blur-sm">
            <h3 className="mb-2 text-xl font-bold">Welcome Back</h3>
            <p className="text-sm text-white/80">
              Log in to manage your business with BanknBook's powerful suite of tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

