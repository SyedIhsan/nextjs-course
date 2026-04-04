# NextJS Course



It use server component by default



Use 'use client' to use client component



layout.tsx act as the Parent for all Routes



##### File-based Routing



app/

  /about

    page.tsx



domain.com/about





###### Nested Routes



/dashboard

    /analytics

    /users



domain.com/dashboard/users



page.tsx is a main file to display UI





###### Dynamic Routes



users/

  /\[id]

    page.tsx





###### React.use()



import { use } from "react"



export default function Page({ params }) {

  const { id } = use(params)



  return <div>{id}</div>

}



use() = unwrap Promise in React





###### Route Groups



(dashboard)

  /dashboard

  layout.tsx

  page.tsx



domain.com/dashboard



Benefit of Route Groups:



* To separate layout.tsx between other route groups
* Allow you to create folder without affecting the URL



DO NOT create 2 page.tsx directly in Route Groups folder, for e.g.



(dashboard)

  page.tsx



(root)

  page.tsx



This will cause an error. It should have 1 main page.tsx only.





##### Error Handling



Create error.tsx file



Create global-error.tsx in root folder for global error



Only the closes error file to the route takes priority





##### Loading UIs





Loading UIs work very similarly to error handling



Create loader.tsx file





##### Data Fetching



async function Home() {

  const response = await fetch('https://jsonplaceholder.typicode.com/albums');

  if (!response.ok) throw new Error('Failed to fetch data');



  const albums = await response.json();





serverComponentsHmrCache = allows you to cache fetch responses in server components across Hot Module Replacement refreshes in 			   local development. This means you'll have faster responses and reduce cost for build API calls.





##### Server Side Fetching vs Client Side Fetching



###### Server Side Fetching



* Data is fetched on the server before the page is sent to the browser
* Less code because you usually do not need useEffect or useState for fetching
* Faster initial load because the page already includes data
* Better SEO because search engines can read the content directly
* Better security because API keys stay on the server
* Can reduce duplicate requests and improve performance
* Can run multiple requests in parallel



Simple idea:

Fetch first, then render





###### Client Side Fetching



* Data is fetched in the browser after the page loads
* Usually uses useEffect and useState
* More code because you need loading and error handling
* Slower initial load because users may see loading first
* SEO is weaker because content comes later
* Useful for interactive or real-time features



Simple idea:

Render first, then fetch





##### API Routes



Create a folder with any name or api \& then create route.tsx inside it.



api/

  route.tsx





##### Caching



Caching = Storing data temporarily



Browser cache = Saves static files locally



Server cache = Stores pre-rendered pages \& API responses



Data cache = Remembers fetched data to avoid repeat requests



Output = Makes your apps feel instance



It's disable by default

// next.config.ts

const nextConfig: NextConfig = {

&#x20; cacheComponents: true,

};



export default nextConfig;



"use cache" = this tells next.js to store and reuse the output if input have not change



Can be define on:



* File level
* Component level
* Function level





It will:



* Prerenders it at build time
* Stores it in memory
* Revalidates it automatically



Every 15 min by default



cacheLife() = controls how long data stays cache





import { unstable\_cacheLife as cacheLife } from "next/cache";



cacheLife("hours"); // cache for an hour





import { cacheTag } from "next/cache";



cacheTag("my-data")





cacheLife = When to clear



cacheTag = What to clear





To refresh constant instantly, can use:



* revalidate()
* revalidateTag()





##### Metadata



Search Engine Optimization (SEO)



2 ways to manage data in Next.JS:



* Config Based Metadata



Static Metadata:



export const metadata: Metadata = {

&#x20; title: "Learn NextJS",

&#x20; description: "How to become a pro dev with NextJS",

}



Put on any layout.tsx or page.tsx



It will overwrite the default specified in the global layout





Dynamic Metadata:



export async function generateMetadata({ params }) {

&#x20; const { id } = params;

&#x20; const resource = await getResourceById({ id });



&#x20; const title = resource.title;

&#x20; const seoDescription = "Free resources";



&#x20; return {

&#x20;   title,

&#x20;   description: seoDescription,

&#x20; }

}





* File Based Metadata



can put files directly inside the app folder:



* app/robot.txt
* app/sitemap.xml
* app/favicon.ico
* app/opengraph-image.jpg
* app/twitter-image.png
* app/icon.svg



NextJS will automatically detect and generate corresponding meta text. It have to be proper names directly inside the app folder.



File Based Metadata have higher priority and will overwrite any Config Based Metadata





##### Server Actions



"use server"



$ne = not equal

$in = included

