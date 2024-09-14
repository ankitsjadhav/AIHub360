"use client";

import axios from "axios";
import * as z from "zod";
import { MessageSquare } from "lucide-react";

import { Heading } from "@/components/heading";
import { useForm } from "react-hook-form";

import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

// Define the message type according to the Gemini API structure
interface Message {
    role: string;
    parts: Array<{ text: string }>;
}

const ConversationPage = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Create the user message in the correct format for Gemini API
            const userMessage: Message = {
                role: "user",
                parts: [{ text: values.prompt }],
            };

            const newMessages = [...messages, userMessage];

            // Send the message array to the Gemini API
            const response = await axios.post("/api/conversation", {
                messages: newMessages,  // Send messages in Gemini API format
                generationConfig: {     // Gemini API generationConfig settings
                    maxOutputTokens: 1000,
                    temperature: 0.1,
                }
            });

            // Update the state with the user's message and the bot's response
            setMessages((current) => [
                ...current,
                userMessage,
                { role: "bot", parts: [{ text: response.data.message }] } // Adjusted for bot's response
            ]);

            form.reset();
        } catch (error: any) {
            console.log(error);
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="Conversation"
                description="Our most advanced conversation model."
                icon={MessageSquare}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="How do I calculate the radius of a circle?"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {messages.length == 0 && !isLoading && <Empty label="No Conversation Started." />}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "p-8 w-full flex items-start gap-x-8 rounded-lg",
                                    message.role == "user" ? "bg-white border border-black/10" : "bg-muted"
                                )}
                            >
                                {message.role == "user" ? <UserAvatar /> : <BotAvatar />}
                                <p className="text-sm">{String(message.parts[0].text)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversationPage;

// OPENAI CODE-
// "use client";

// import axios from "axios";
// import * as z from "zod";
// import { MessageSquare } from "lucide-react";

// import { Heading } from "@/components/heading";
// import { useForm } from "react-hook-form";

// import { formSchema } from "./constants";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
// import { useState } from "react";
// import { Empty } from "@/components/empty";
// import { Loader } from "@/components/loader";
// import { cn } from "@/lib/utils";
// import { UserAvatar } from "@/components/user-avatar";
// import { BotAvatar } from "@/components/bot-avatar";


// const ConversationPage = () => {
//     const router = useRouter();
//     const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
//     const form =useForm< z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             prompt: ""
//         }
//     });

//     const isLoading = form.formState.isSubmitting;

//     const onSubmit = async (values: z.infer<typeof formSchema>) => {
        
//         try {
//             const userMessage: ChatCompletionMessageParam = {
//                 role: "user",
//                 content: values.prompt,
                
//             };
//             const newMessages = [...messages, userMessage]

//             const response = await axios.post("/api/conversation", { messages: newMessages, });

//             setMessages((current) => [...current, userMessage, response.data]);

//             form.reset();

         
//         } catch (error: any) {
//             // TODO: Open Pro Model
//             console.log(error);
//         } finally {
//             router.refresh();
//         }
//     };
 

//     return ( 
//         <div>
//             <Heading
//             title="Conversation"
//             description="Our most advanced conversation model."
//             icon={MessageSquare}
//             iconColor="text-violet-500"
//             bgColor="bg-violet-500/10"
//              />
//              <div className="px-4 lg:px-8">
//                 <div>
//                     <Form {...form}>
//                         <form onSubmit={form.handleSubmit(onSubmit)}
//                             className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
//                         >
//                              <FormField 
//                              name="prompt"
//                              render={({ field }) => (
//                                 <FormItem className="col-span-12 lg:col-span-10">
//                                     <FormControl className="m-0 p-0">
//                                       <Input 
//                                       className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
//                                       disabled={isLoading}
//                                       placeholder="How do I calulate the radius of a circle?"
//                                       {...field}
                                      
                                      
//                                       />  
//                                     </FormControl>

//                                 </FormItem>
//                              )}
//                              />
//                              <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
//                                 Generate
//                              </Button>
//                         </form>
//                     </Form>
//                 </div>
//                 <div className="space-y-4 mt-4">
//                     {isLoading && (
//                         <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
//                             <Loader />
//                             </div>

//                     )}
//                     {messages.length == 0 && !isLoading && (
//                         <Empty label="No Conversation Started." />
//                     )}
//                    <div className="flex flex-col-reverse gap-y-4">
//                     {messages.map((message, index) => ( 
//                         <div 
//                         key={index} className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", message.role == "user" ? "big-white border border-black/10" : "bg-muted" )}>
//                             {message.role == "user" ? <UserAvatar /> : <BotAvatar />}
//                             <p className="text-sm">{String(message.content)}</p>
//                             </div>
//                     ))}
                    
//                    </div>
                    

//                 </div>
                 
//              </div>
//         </div>


//      );
// }
 
// export default ConversationPage;