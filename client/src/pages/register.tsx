import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  getToken,
  registerApi,
  setToken,
  verifyApi,
} from "@/components/api/auth";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { Eye, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string(),
  name: z.string(),
  username: z.string().min(2).max(50),
  password: z.string().min(8),
});

const Register = () => {
  const navigate = useNavigate();

  const [visible, setVisible] = useState<boolean>(false);
  const [state, setState] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      username: "",
      password: "",
    },
  });

  const handleRegisterApi = async (values: z.infer<typeof formSchema>) => {
    setEmail(values.email);
    await registerApi(values)
      .then((response) => {
        if (response.status == 201 || 200) setState(true);
      })
      .catch((error) => console.log(error));
  };

  const handleOtpApi = async () => {
    await verifyApi({ email, otp })
      .then((response) => {
        if (response.status == 201 || 200) {
          setToken(response.data.data);
          navigate("/");
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (getToken()) navigate("/");
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full">
      {state ? (
        <div className="flex flex-col gap-4 w-1/3 lg:w-1/6">
          <Input
            placeholder="Enter OTP"
            max="6"
            type="number"
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button onClick={handleOtpApi} disabled={!otp}>
            Verify
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegisterApi)}
            className="flex flex-col gap-4 w-1/3 lg:w-1/6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <span className="relative">
                      <Input
                        placeholder="Password"
                        type={visible ? `text` : `password`}
                        {...field}
                      />
                      <div className="absolute top-3 right-4 cursor-pointer">
                        {visible ? (
                          <div>
                            <Eye
                              className="h-4 w-4"
                              onClick={() => setVisible(!visible)}
                            />
                          </div>
                        ) : (
                          <div>
                            <EyeClosedIcon
                              className="h-4 w-4"
                              onClick={() => setVisible(!visible)}
                            />
                          </div>
                        )}
                      </div>
                    </span>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="flex gap-4">
              <p>Register</p>
              <LogIn className="h-4 w-4" />
            </Button>

            <small className="text-center text-muted-foreground">
              Already an
              <Link to="/login" className="text-blue-600">
                &nbsp;User
              </Link>
            </small>
          </form>
        </Form>
      )}
    </div>
  );
};

export default Register;
