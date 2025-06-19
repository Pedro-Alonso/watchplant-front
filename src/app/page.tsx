"use client";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-xl shadow-lg min-w-[350px] flex flex-col items-center gap-8">
          <h1 className="text-green-800 text-3xl font-bold mb-2">
            Bem-vindo ao Watchplant
          </h1>
          <p className="text-gray-600 text-lg mb-6 text-center">
            Monitore suas plantas e mantenha seu jardim saudável com facilidade.
          </p>
          <div className="flex gap-8">
            <a
              href="/login"
              className="text-green-800 underline font-semibold text-lg hover:text-green-900"
            >
              Entrar
            </a>
            <a
              href="/signup"
              className="text-green-800 underline font-semibold text-lg hover:text-green-900"
            >
              Cadastrar
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
