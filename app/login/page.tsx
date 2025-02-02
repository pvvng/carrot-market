import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function Login() {
  const handleForm = async (formData: FormData) => {
    // 서버에서 실행하도록
    // 버튼 클릭할때 network 확인해보면 /login으로 POST 요청 보냄
    // next가 자동으로 Route Handler 만들어 주는 것
    "use server";
    console.log("i run in the server");
    console.log(formData.get("email"), formData.get("password"));
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Login with email and password</h2>
      </div>
      <form className="flex flex-col gap-3" action={handleForm}>
        <FormInput
          name="email"
          type="email"
          placeholder="email"
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="password"
          required
          errors={[]}
        />
        <FormButton text="Create Account" isLoading={false} />
      </form>
      <SocialLogin />
    </div>
  );
}
