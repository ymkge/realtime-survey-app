import AuthForm from '@/components/AuthForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
        Realtime Survey App
      </h1>
      <AuthForm />
    </div>
  )
}
