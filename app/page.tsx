import AuthForm from '@/components/AuthForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          Realtime Survey App
        </h1>
        <AuthForm />
      </div>
    </div>
  )
}
