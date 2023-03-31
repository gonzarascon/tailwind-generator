import { NextRequest, NextResponse } from "next/server";
import { OpenAIStream } from "@/lib/OpenAiStream";

const systemConfig = `You are a front-end and design specialist,  you like making awesome design systems with figma and tailwindcss. That expertise you have leads you to always keep in mind the best practices of the technology you use to come with perfect technical and design-wise decisions.`;

const prompt = (
  userPrompt: string,
  colorList?: string
) => `Based on my indications, give me a color palette for me to add to my tailwind.config file. I don't need any conversation with you, just the color extension to add to my config.  The palette should be unique without repeating the actual colors tailwind gives as defaults. Please for each color you suggest to me, add the different variants of it, for example:
\`\`\` blue: {50: "some hex code", 100:"another hex code",  and so}\`\`\`
${userPrompt}\r\n
${
  colorList
    ? `Also, keep in mind the following colors as a reference for the palette I'm looking for, they should be included:
    ${colorList}
    `
    : ""
}`;

export default async function handler(req: NextRequest) {
  try {
    const token = req.cookies.get("OPENAPI_TOKEN")?.value;

    const body = await req.json();

    const userPrompt = body.prompt as string;
    const colors = body.colors as string[] | undefined;

    const formattedItems = colors
      ? colors.map((c) => `- ${c}`).join("\r\n")
      : undefined;

    if (!token) {
      return new Response("No token was provided", { status: 400 });
    } else {
      const stream = await OpenAIStream(token, {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt(userPrompt, formattedItems),
          },
          {
            role: "system",
            content: systemConfig,
          },
        ],
        temperature: 0.6,
        top_p: 0.5,
        stream: true,
      });

      return new Response(stream);
    }
  } catch (err: any) {
    console.log({ err });
    return new Response(err, { status: 500 });
  }
}

export const config = {
  runtime: "edge",
};
