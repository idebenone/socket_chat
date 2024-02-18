import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { Eye, LogIn } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginApi } from "@/components/api/auth";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8),
});

const Login = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = await loginApi(values);
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-1/3 lg:w-1/6"
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
        </form>
      </Form>
    </div>
  );
};

export default Login;
