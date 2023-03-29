import { Input } from "@/components/ui/input";
import type { NextPage } from "next";
import Head from "next/head";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import PlusCircleSolid from "@/public/icons/plus-circle-solid.svg";
import { cn } from "@/lib/cn";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown, { Components } from "react-markdown";
import { Transition } from "@headlessui/react";
import Cross from "@/public/icons/close-outline.svg";
import Picture from "@/public/icons/image-outline.svg";
import Copy from "@/public/icons/copy-outline.svg";
import { useCallback, useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { event } from "@/lib/ga";
import { Textarea } from "@/components/ui/textarea";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { ExtractColors } from "@/lib/ExtractColors";
import { DevTool } from "@hookform/devtools";
import * as React from "react";
import rehypeHighlight from "rehype-highlight";
import { ReactMarkdownProps } from "react-markdown/lib/ast-to-react";

const schema = z.object({
  prompt: z.string().min(10),
});

type FormState = {
  prompt?: string;
};

const Home: NextPage = () => {
  const [tokenSaved] = useLocalStorage("token_saved", false);
  const [hexColors, setHexColors] = useState<string[]>([]);
  const [showDropzone, setShowDropzone] = useState(false);
  const [text, setText] = useState("");
  const {
    control,
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
    setValue,
  } = useForm<FormState>({
    defaultValues: {
      prompt: "",
    },
    resolver: zodResolver(schema),
  });

  const imageColorsMutation = useMutation({
    mutationFn: (images: string) => ExtractColors(images),
    onSuccess(data) {
      const hexColors = data.map((color) => color.hex);
      setHexColors((state) => [...state, ...hexColors]);
    },
  });

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

  const getColorsFromImages = (files: File[]) => {
    files.forEach((file) => {
      imageColorsMutation.mutate(URL.createObjectURL(file));
    });
  };

  const generateRecipe = (data: FormState) => {
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

      <main className="w-full min-h-screen px-5 bg-top bg-cover lg:px-20 py-28 bg-gradient-to-t from-sky-500 from-0% via-30% to-50% to-white via-emerald-300 dark:to-slate-800 dark:from-indigo-500 dark:via-blue-900 dark:to-50%">
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
            <div className="relative flex flex-col items-center justify-center w-full p-4 pt-16 bg-white shadow-md lg:flex-row rounded-xl dark:bg-gray-900 dark:shadow-slate-900 flex-nowrap min-h-[164px]">
              <button
                type="button"
                className="absolute flex items-center py-2 transition-all rounded-md hover:px-4 top-4 right-4 hover:backdrop-brightness-95 dark:hover:backdrop-brightness-150 group"
                onClick={() => setShowDropzone((state) => !state)}
              >
                {!showDropzone ? (
                  <Picture className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                ) : (
                  <Cross className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                )}
                <span className="w-0 overflow-hidden text-sm transition-all group-hover:ml-2 group-hover:w-28 whitespace-nowrap">
                  {!showDropzone ? "Upload pictures" : "Cancel"}
                </span>
              </button>
              <Textarea {...register("prompt")} />
              <Dropzone
                multiple
                onChange={(files) => {
                  getColorsFromImages(files);
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

          <Transition
            as="div"
            show={
              imageColorsMutation.isLoading ||
              (imageColorsMutation.isSuccess && !!hexColors.length)
            }
            className="p-6 delay-75 bg-white shadow-lg rounded-xl animate-in slide-in-from-bottom-4 dark:bg-gray-900 dark:shadow-slate-900"
            enter="transition-[opacity_transform]"
            enterFrom="opacity-0 translate-y-4"
            enterTo="opacity-100 translate-y-0"
            leave="transition-[opacity_transform]"
            leaveTo="opacity-0 translate-y-4"
            leaveFrom="opacity-100 translate-y-0"
          >
            <Transition
              show={imageColorsMutation.isLoading}
              enter="transition-opacity duration-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              leave="transition-opacity duration-150"
            >
              <h3 className="my-auto text-xl font-bold text-center mb-7">
                Extracting images colors...
              </h3>
            </Transition>

            <Transition
              show={imageColorsMutation.isSuccess && !!hexColors.length}
              enter="transition-opacity duration-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              leave="transition-opacity duration-150"
            >
              <h3 className="text-lg font-bold text-center mb-7">
                We picked these colors from the images you gave us:
              </h3>
              <div className="grid grid-cols-[repeat(auto-fill,_minmax(80px,_1fr))] items-center gap-6">
                {hexColors.map((color) => (
                  <div key={color} className="flex flex-col items-center">
                    <ColorSquare
                      color={color}
                      onDelete={(color) =>
                        setHexColors((state) =>
                          state.filter((c) => c !== color)
                        )
                      }
                    />
                    <span className="mt-2 text-sm text-center uppercase font-lato">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </Transition>
          </Transition>
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
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                  pre: Pre,
                }}
                className="w-full px-6 mb-12 prose-sm prose bg-white shadow-md md:prose-lg dark:bg-gray-900 dark:shadow-slate-900 py-7 rounded-xl prose-headings:text-purple-500 dark:prose-p:text-slate-200 dark:prose-li:text-slate-300 dark:prose-strong:text-purple-500"
              >
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

const Pre = ({
  node: _node,
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"pre"> & ReactMarkdownProps) => {
  const preRef = React.useRef<HTMLPreElement | null>(null);

  const handleClick = () => {
    if (preRef.current?.textContent) {
      navigator.clipboard.writeText(preRef.current.textContent);
    }
  };

  return (
    <pre ref={preRef} {...props} className={cn(className, "relative")}>
      <button
        onClick={handleClick}
        title="Copy content"
        className="absolute p-2 rounded-md top-2 right-2 hover:backdrop-brightness-150 active:backdrop-brightness-125"
      >
        <Copy className="w-6 h-6 text-slate-300" />
      </button>
      {children}
    </pre>
  );
};

const ColorSquare = ({
  color,
  onDelete,
}: {
  color: string;
  onDelete(color: string): void;
}) => {
  return (
    <div
      className="rounded-md shadow-md bg-[var(--analyzed-color)] w-20 h-20 relative group animate-in fade-in-10"
      key={color}
      style={{ "--analyzed-color": color } as React.CSSProperties}
    >
      <span className="text-transparent bg-transparent select-none backdrop-hue-rotate-180">
        {color}
      </span>
      <button
        onClick={() => onDelete(color)}
        className="absolute w-6 h-6 text-sm text-white transition-opacity ease-in-out bg-transparent rounded-md opacity-0 pointer-events-none top-1 right-1 group-hover:opacity-100 direction-normal anim group-hover:pointer-events-auto cursor-none hover:cursor-pointer backdrop-brightness-75"
      >
        <PlusCircleSolid className="w-5 h-5 m-auto rotate-45" />
      </button>
    </div>
  );
};

interface DropzoneProps extends DropzoneOptions {
  onChange: <T extends File>(file: T[]) => void;
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
          "w-full opacity-100 px-6 duration-300 py-7 ml-5 border-2 border-dashed border-indigo-400 dark:border-orange-400 rounded-lg h-full":
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
