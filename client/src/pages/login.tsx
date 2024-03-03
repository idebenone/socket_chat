import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { EyeClosedIcon } from "@radix-ui/react-icons";

import { Eye, LogIn } from "lucide-react";
import { getToken, loginApi, setToken } from "@/components/api/auth";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [visible, setVisible] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await loginApi(values)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setToken(response.data.data);
          navigate("/");
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid credentials",
        });
      });
  };

  useEffect(() => {
    if (getToken()) navigate("/");
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-3/6 md:w-1/3 lg:w-1/5"
        >
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
            <p>Login</p>
            <LogIn className="h-4 w-4" />
          </Button>

          <small className="text-center text-muted-foreground">
            I'm
            <Link to="/register" className="text-blue-600">
              &nbsp;New!
            </Link>
          </small>
        </form>
      </Form>
    </div>
  );
};

export default Login;
