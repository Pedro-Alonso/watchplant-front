import { ILogin } from "./login.types";
import Input from "@/components/input/input";
import Button from "@/components/button/button";
import { useLoader } from "@/components/loader/LoaderContext";
import LoaderModal from "@/components/loader/LoaderModal";

export const LoginLayout = ({
  email,
  password,
  emailInputProps,
  passwordInputProps,
  onLogin,
}: ILogin) => {
  const LoaderModalWrapper = () => {
    const { loading } = useLoader();
    return <LoaderModal show={loading} />;
  };
  return (
    <>
      <LoaderModalWrapper />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800">
            Bem-vindo ao Watchplant
          </h2>
          <form className="flex flex-col gap-4">
            <Input {...emailInputProps} />
            <Input {...passwordInputProps} />
            <Button
              text="Login"
              onClick={async () => {
                await onLogin();
              }}
              disabled={!email || !password}
            />
            <div className="mt-4 text-center">
              <a
                href="/signup"
                className="text-green-800 underline hover:text-green-900"
              >
                Não tem uma conta? Cadastre-se
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
