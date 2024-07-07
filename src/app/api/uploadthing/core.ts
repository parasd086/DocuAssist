import { db } from "@/db";
import { pinecone } from "@/lib/pinecone";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user || !user.id) throw new Error("Unauthorized");

      return { userId: user.id }; //this will be passed as metadata
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod-sea1.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus: "PROCESSING",
        },
      });

      //index the file
      try {
        //fetch the url in memory-
        const response = await fetch(
          `https://uploadthing-prod-sea1.s3.us-west-2.amazonaws.com/${file.key}`
        );
        //we need pdf in blob-
        const blob = await response.blob();

        //to load pdf file in memory-
        const loader = new PDFLoader(blob);

        //to extract "each" page level text/content of pdf-
        const pageLevelDocs = await loader.load();

        //to get total no. of pages-
        const pagesAmt = pageLevelDocs.length; //useful when pricing pro/free.

        // -----vectorize and index entire document----

        //get index from pinecone-
        const pineconeIndex = pinecone.Index("docuassist");

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        });

        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: createdFile.id, //we can save vectors to certain namespace and when we query by fileId we get all the vectors for that certain file
          maxConcurrency: 5,
        });

        //DB call to update the file to a "SUCCESSFUL" uploadStatus enum
        await db.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: createdFile.id,
          },
        });
      } catch (err) {
        await db.file.update({
          data: {
            uploadStatus: "FAILED",
          },
          where: {
            id: createdFile.id,
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
