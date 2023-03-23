import { Input } from "@/components/ui/input";
import type { NextPage } from "next";
import Head from "next/head";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import PlusCircleSolid from "@/public/icons/plus-circle-solid.svg";
import { cn } from "@/lib/cn";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";
import { Transition } from "@headlessui/react";
import Cross from "@/public/icons/close-outline.svg";
import Picture from "@/public/icons/image-outline.svg";
import { useCallback, useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { event } from "@/lib/ga";
import { Textarea } from "@/components/ui/textarea";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { ExtractColors } from "@/lib/ExtractColors";
import { DevTool } from "@hookform/devtools";

const schema = z.object({
  // prompt: z.string().min(10).nullable(),
});

type FormState = {
  prompt?: string;
  images?: File;
};

const Home: NextPage = () => {
  const [tokenSaved] = useLocalStorage("token_saved", false);

  const [showDropzone, setShowDropzone] = useState(false);
  const [text, setText] = useState("");
  const {
    control,
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
    setValue,
  } = useForm<FormState>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    register("images");
  }, []);

  // const imageColorsMutation = useMutation({
  //   mutationFn: (images:FileList) => ExtractColors(images)
  // })

  // const recipeMutation = useMutation({
  //   mutationFn: (items: string[]) =>
  //     fetch("/api/openai", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ items }),
  //     }),
  //   onSuccess: async (data) => {
  //     if (data.ok) {
  //       const body = data.body;
  //       const reader = body?.getReader();
  //       const decoder = new TextDecoder();
  //       let done = false;

  //       if (reader) {
  //         while (!done) {
  //           const { value, done: doneReading } = await reader.read();
  //           done = doneReading;
  //           const chunkValue = decoder.decode(value);

  //           setText((prev) => prev + chunkValue);
  //         }
  //       }
  //     }
  //   },
  // });

  const generateRecipe = (data: FormState) => {
    console.log(data);
    // event({
    //   action: "submit_form",
    //   category: "user_interaction",
    //   label: "Submit form",
    // });
    // recipeMutation.mutate(
    //   data.prompt
    // );
  };

  return (
    <div>
      <DevTool control={control} />
      <Head>
        <title>Tailwind Palette Generator</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content="Tailwind Palette Generator" />
        <meta
          name="og:description"
          content="AI to the rescue of cooking aficionados"
        />
        <meta
          name="og:image"
          content={`${
            process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : ""
          }/og-image.png`}
        />
      </Head>

      <main className="w-full min-h-screen px-5 bg-top bg-cover lg:px-20 py-28 bg-mesh-light dark:bg-mesh-dark">
        <section className="min-h-[65vh] flex flex-col justify-center max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold lg:text-6xl text-slate-700 dark:text-white">
            Tailwind{" "}
            <span className="text-transparent bg-gradient-to-l dark:from-lime-500 dark:to-orange-400 from-lime-500 to-indigo-600 bg-clip-text">
              palette
            </span>{" "}
            generator
          </h1>

          <p className="max-w-2xl mt-3 text-xl font-light lg:text-2xl dark:text-slate-100 font-lato">
            Create your custom tailwind palette with the help of AI 💅
          </p>

          <form
            className="relative w-full mt-8 mb-6 space-y-10"
            onSubmit={handleSubmit(generateRecipe)}
          >
            <div className="relative flex flex-col items-center justify-center w-full p-4 pt-16 bg-white shadow-md lg:flex-row rounded-xl dark:bg-transparent dark:shadow-none flex-nowrap min-h-[164px]">
              <button
                type="button"
                className="absolute flex items-center py-2 transition-all rounded-md hover:px-4 top-4 right-4 hover:backdrop-brightness-95 group"
                onClick={() => setShowDropzone((state) => !state)}
              >
                {!showDropzone ? (
                  <Picture className="w-5 h-5 text-neutral-600" />
                ) : (
                  <Cross className="w-5 h-5 text-neutral-600" />
                )}
                <span className="w-0 overflow-hidden text-sm transition-all group-hover:ml-2 group-hover:w-28 whitespace-nowrap">
                  {!showDropzone ? "Upload pictures" : "Cancel"}
                </span>
              </button>
              <Textarea {...register("prompt")} />
              <Dropzone
                multiple
                onChange={(file) => {
                  setValue("images", file);
                }}
                visible={showDropzone}
                accept={{
                  "image/png": [".png"],
                  "image/jpg": [".jpg"],
                  "image/jpeg": [".jpeg"],
                }}
              />
            </div>

            <button
              className="block px-5 py-3 mx-auto text-sm font-semibold text-white transition-colors border border-green-500 rounded-lg dark:transition-opacity bg-lime-500 hover:bg-lime-400 dark:text-green-100 dark:bg-green-700 dark:bg-opacity-30 dark:hover:bg-opacity-50 disabled:bg-slate-400 disabled:opacity-30 dark:disabled:bg-gray-700 disabled:text-white disabled:border-gray-400"
              type="submit"
              // disabled={
              //   !isValid ||
              //   isSubmitting ||
              //   // recipeMutation.isLoading ||
              //   !tokenSaved
              // }
            >
              Generate
            </button>
          </form>
        </section>
        <div className="flex flex-wrap justify-center max-w-4xl mx-auto mt-6 sm:w-full">
          <Transition
            show={!!text /*&& !recipeMutation.isError*/}
            className="max-w-prose"
          >
            <Transition.Child
              className="flex items-center w-full mb-10 lg:mb-20 lg:flex-row-reverse"
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <hr className="border-none h-0.5 bg-slate-300 dark:bg-slate-100 rounded-md w-full" />
            </Transition.Child>
            <Transition.Child
              className="w-full"
              enter="transition ease-in-out duration-300 transform"
              enterFrom="scale-0 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-0"
            >
              <ReactMarkdown className="w-full px-6 mb-12 prose-sm prose bg-white shadow-md md:prose-lg dark:bg-transparent dark:shadow-none py-7 rounded-xl prose-headings:text-purple-500 dark:prose-p:text-slate-200 dark:prose-li:text-slate-300 dark:prose-strong:text-purple-500">
                {text ?? ""}
              </ReactMarkdown>
            </Transition.Child>
          </Transition>
        </div>
      </main>
    </div>
  );
};

export default Home;

interface DropzoneProps extends DropzoneOptions {
  onChange: (...event: any[]) => void;
  visible: boolean;
}

const Dropzone = ({ multiple, onChange, visible, ...rest }: DropzoneProps) => {
  const onDrop = <T extends File>(acceptedFiles: T[]) =>
    onChange(acceptedFiles);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple,
    ...rest,
  });

  return (
    <div
      className={cn(
        "w-0 max-w-md opacity-0 transition-[opacity,width] overflow-hidden ",
        {
          "w-full opacity-100 px-6 duration-300 py-7 ml-5 border-2 border-dashed border-indigo-400 rounded-lg h-full":
            visible,
        }
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <span
        className={cn(
          "whitespace-nowrap opacity-0 duration-0 transition-opacity font-light",
          {
            "opacity-100 delay-75 duration-100": visible,
          }
        )}
      >
        Drop some inspiration here 💫
      </span>
    </div>
  );
};
