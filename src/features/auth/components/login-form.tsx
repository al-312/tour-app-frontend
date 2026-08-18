import * as React from "react";
import { Mail, ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegister, type FieldErrors } from "react-hook-form";

import Button from "@/components/ui/button";
import Input, { PasswordInput } from "@/components/ui/input";

import { type LoginFormData, loginSchema } from "../schemas/login.schema";
import DemoAccountsSelector, { type DemoAccount } from "./demo-accounts-selector";

function EmailInputField({
  register,
  errors,
}: {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
}): React.JSX.Element {
  return (
    <div className="relative">
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        error={errors.email?.message}
        autoComplete="email"
        className="pl-10"
        {...register("email")}
      />
      <Mail className="w-4 h-4 text-app-muted absolute left-3.5 top-9.5 pointer-events-none" />
    </div>
  );
}

function LoginForm({
  onSubmit,
  isLoading,
  onFillDemo,
}: {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  onFillDemo: (
    acc: DemoAccount,
    setVal: (field: "email" | "password", val: string) => void
  ) => void;
}): React.JSX.Element {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <>
      <form
        onSubmit={(e): void => {
          void handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-4"
      >
        <EmailInputField register={register} errors={errors} />

        <PasswordInput error={errors.password?.message} {...register("password")} />
        <Button
          type="submit"
          isLoading={isLoading}
          variant="primary"
          className="w-full py-3.5 mt-2 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-app-brand/20"
        >
          <span>Sign In to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <DemoAccountsSelector
        onSelect={(acc: DemoAccount): void => {
          onFillDemo(acc, (field, val) => {
            setValue(field, val, { shouldValidate: true });
          });
        }}
      />
    </>
  );
}

export default LoginForm;
