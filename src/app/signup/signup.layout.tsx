import Input from "@/components/input/input";
import { ISignup } from "./signup.types";
import Button from "@/components/button/button";
import { useLoader } from "@/components/loader/LoaderContext";
import LoaderModal from "@/components/loader/LoaderModal";

export const SignupLayout = ({
  step,
  steps,
  currentStep,
  currentValue,
  handleChange,
  handleNext,
  handleBack,
}: ISignup) => {
  const LoaderModalWrapper = () => {
    const { loading } = useLoader();
    return <LoaderModal show={loading} />;
  };
  return (
    <>
      <LoaderModalWrapper />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-xl shadow-lg min-w-[350px] flex flex-col items-center">
          <h2 className="mb-6 text-green-800 text-2xl font-bold">Onboarding</h2>
          <div className="mb-6 text-gray-500 text-base">
            Step {step + 1} of {steps.length}
          </div>
          <form className="w-full flex flex-col gap-4">
            <Input
              type={currentStep.type}
              placeholder={currentStep.placeholder}
              value={currentValue}
              onChange={handleChange}
            />
            <div className="flex gap-4 mt-6">
              <Button onClick={handleBack} disabled={step === 0} text="Back" />
              <Button
                onClick={handleNext}
                disabled={!currentValue}
                text={step === steps.length - 1 ? "Finish" : "Next"}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
