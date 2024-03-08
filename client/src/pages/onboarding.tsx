import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Link, useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { profileImageApi, userOnboardingApi } from "@/components/api/user";
import { useToast } from "@/components/ui/use-toast";
import { getToken } from "@/components/api/auth";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  bio: z.string().max(200),
});

const OnBoarding = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imageObject, setImageObject] = useState<any>();
  const [imageUrl, setImageUrl] = useState<string>("/profile_image_holder.png");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      bio: "",
    },
  });

  const handleImageObject = async (event: any) => {
    const image = event.target.files?.[0];
    const imageUrl = URL.createObjectURL(image);
    setImageUrl(imageUrl);
    setImageObject(image);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("file", imageObject, "profile.jpg");

    try {
      await profileImageApi(formData as any);
      await userOnboardingApi(values);

      toast({
        title: "Success",
        description: "Successfully updated the profile",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    }
  };

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className="flex justify-center items-center w-full h-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-3/6 md:w-1/3 lg:w-1/5"
          >
            <div className="flex justify-center">
              <label htmlFor="profile_img">
                <img
                  src={imageUrl}
                  alt=""
                  height="140"
                  width="140"
                  className="border border-muted rounded-full object-fit cursor-pointer"
                />
              </label>
              <input
                id="profile_img"
                type="file"
                onChange={handleImageObject}
                className="hidden"
              />
            </div>

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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Bio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="flex gap-4">
              <p>Continue</p>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>

            <small className="text-center text-muted-foreground">
              <Link to="/" className="text-blue-600">
                &nbsp;Skip!
              </Link>
            </small>
          </form>
        </Form>
      </div>
    </>
  );
};

export default OnBoarding;
