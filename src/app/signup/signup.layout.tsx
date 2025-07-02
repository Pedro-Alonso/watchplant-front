import Input from "@/components/input/input";
import { ISignup } from "./signup.types";
import { useLoader } from "@/components/loader/LoaderContext";
import LoaderModal from "@/components/loader/LoaderModal";

export const SignupLayout = ({
  form,
  handleChange,
  onSignup,
  error,
  fieldErrors,
}: ISignup) => {
  const LoaderModalWrapper = () => {
    const { loading } = useLoader();
    return <LoaderModal show={loading} />;
  };
  return (
    <>
      <LoaderModalWrapper />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-[900px] flex flex-col items-center">
          <h2 className="mb-6 text-green-800 text-2xl font-bold">
            Criar Conta
          </h2>

          <form className="w-full" onSubmit={onSignup}>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left column */}
              <div className="flex flex-col gap-4 flex-1">
                <Input
                  type="email"
                  placeholder="E-mail"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.email && (
                  <div className="text-red-600 text-sm mt-1">
                    {fieldErrors.email}
                  </div>
                )}
                <Input
                  type="text"
                  placeholder="Nome Completo"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.name && (
                  <div className="text-red-600 text-sm mt-1">
                    {fieldErrors.name}
                  </div>
                )}
                <Input
                  type="tel"
                  placeholder="Telefone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.phone && (
                  <div className="text-red-600 text-sm mt-1">
                    {fieldErrors.phone}
                  </div>
                )}
                <Input
                  type="password"
                  placeholder="Senha"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.password && (
                  <div className="text-red-600 text-sm mt-1">
                    {fieldErrors.password}
                  </div>
                )}
                <Input
                  type="password"
                  placeholder="Confirmar Senha"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.confirmPassword && (
                  <div className="text-red-600 text-sm mt-1">
                    {fieldErrors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-4 flex-1">
                <Input
                  type="text"
                  placeholder="CEP"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.zipCode && (
                  <div className="text-red-600 text-sm mt-1">
                    {fieldErrors.zipCode}
                  </div>
                )}
                <Input
                  type="text"
                  placeholder="Rua"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.street && (
                  <div className="text-red-600 text-sm mt-1">
                    {fieldErrors.street}
                  </div>
                )}
                <Input
                  type="text"
                  placeholder="Número"
                  name="number"
                  value={form.number}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.number && (
                  <div className="text-red-600 text-sm mt-1">
                    {fieldErrors.number}
                  </div>
                )}
                <Input
                  type="text"
                  placeholder="Bairro"
                  name="neighborhood"
                  value={form.neighborhood}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.neighborhood && (
                  <div className="text-red-600 text-sm mt-1">
                    {fieldErrors.neighborhood}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm mt-4 text-center">
                {error}
              </div>
            )}

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="px-6 py-3 rounded-md font-semibold text-white transition-colors bg-green-800 hover:bg-green-900 cursor-pointer"
              >
                Cadastrar
              </button>
            </div>

            <div className="text-center mt-4">
              <a
                href="/login"
                className="text-green-800 hover:text-green-900 text-sm"
              >
                Já tem uma conta? Entrar
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
